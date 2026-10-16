import 'dotenv/config'
import express from 'express'
import fs from 'node:fs/promises' //file heandling system we use promises syntax
import path from 'node:path' // tool for buliding paths
import { fileURLToPath } from 'node:url'
import { randomUUID, timingSafeEqual } from 'node:crypto' // random ids + constant-time comparison for the admin token
import rateLimit from 'express-rate-limit' // caps how many wrong tokens a client can try
import { createClient } from "@supabase/supabase-js";// this allows us to reach to supabase 

const __dirname = path.dirname(fileURLToPath(import.meta.url))// we need this for the server to know where the files are

const WORK_DIR = path.join(__dirname, '..', 'public', 'work') // tell the server where the work folder is

const CATEGORIES = ['photoshoot', 'weddings', 'management', 'ugc']

const ALLOWED = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
}//creating a map for all allowed tyeps for the upload , this way we filter the files that come in
const ADMIN_TOKEN = process.env.ADMIN_TOKEN // PROSSES env is a safe way to store secert information about our app in this case it stores the password so it will not be visible to the public
if (!ADMIN_TOKEN) {
    throw new Error('ADMIN_TOKEN is missing — create a .env file with ADMIN_TOKEN=...')
}
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase env vars missing — check server/.env')
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const app = express() //we make the server appliaction and store it as app
// Render puts a proxy in front of the server. Without this every request looks like it
// comes from the proxy's IP, so the per-IP limiter below would count everyone together.
app.set('trust proxy', 1)
const ALLOWED_ORIGINS = [
    'http://localhost:8080',            // your dev frontend
    'https://shani-page.vercel.app',
    'https://www.socialshani.com'    // your live site
]
app.use((req, res, next) => {
    const origin = req.headers.origin
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)   // echo back only if allowed
    }
    res.header('X-Content-Type-Options', 'nosniff')
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') { return res.sendStatus(204) }
    next()
})
app.use(express.json());// middleware that happens everytime the server gets a response from the client, we use it to transfer files.
const PORT = 3001


function validateCategory(req, res, next) {
    if (!CATEGORIES.includes(req.params.category)) {
        return res.status(400).json({ error: 'Unknown category' })
    }
    next()// the signature of the middleware it tells the function that the function after this has finnished it's job it should move on to the next function in the chain of commands
}
// Brute-force protection for the single shared admin token. Only FAILED attempts count
// (skipSuccessfulRequests), so logging in normally never uses up the budget.
//  - per IP: stops one machine hammering guesses
//  - global: catches an attacker rotating IPs. The cost is that someone could lock the admin
//    out on purpose, which is acceptable with a single admin.
const tooManyAttempts = { error: 'Too many failed attempts, try again later' }
const perIpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: tooManyAttempts,
})
const globalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 30,
    skipSuccessfulRequests: true,
    keyGenerator: () => 'all', // one shared bucket for every client
    standardHeaders: false,
    legacyHeaders: false,
    message: tooManyAttempts,
})

// constant-time comparison so response timing can't leak how many leading characters matched
function tokenMatches(candidate) {
    const a = Buffer.from(candidate)
    const b = Buffer.from(ADMIN_TOKEN)
    return a.length === b.length && timingSafeEqual(a, b)
}

function requireAuth(req, res, next) { // the auth token by defult comes with an header so we need to strip down the token
    const header = req.headers.authorization || ''
    const token = header.replace('Bearer ', '')
    if (!tokenMatches(token)) {
        return res.status(401).json({ error: 'Invalid token' })
    }
    next() // token is valid — let the request continue to the upload/delete handler
}
// limiters must run BEFORE requireAuth so blocked clients are rejected without a comparison
const authGate = [perIpLimiter, globalLimiter, requireAuth]

app.get('/api/auth/check', authGate, (req, res) => {
    res.json({ ok: true })
    // we have to use a get here becuse the fron must use a url fetch to talk to the server and the get right away calls the auth func and returns just true of false
})

app.get('/', (req, res) => { // is the reception if client walks in it reads the message and gives a response
    res.send('Hello from the Shani CMS backend! 👋')
})
app.get('/api/media/:category', validateCategory, async (req, res) => {
    const category = req.params.category // reading the ctegory that is req 

    const { data, error } = await supabase // we wait for a response from supbase it sends the data or an error so no need to throw an error
        .from('media')
        .select('*')
        .eq('category', category)
        .order('sort_order')

    if (error) {
        return res.status(500).json({ error: error.message })
    }
    // this part only talks to the table. the table only hold info about the storage and not the actual files
    const urlFor = (row) =>
        supabase.storage.from('work-media').getPublicUrl(`${category}/${row.filename}`).data.publicUrl
    // here we turn the facts we  got from the table to the data urls
    const videos = data.filter((row) => row.type === 'video').map(urlFor)
    const photos = data.filter((row) => row.type === 'photo').map(urlFor)

    res.json({ videos, photos })
})
//" 1-Read which category they asked for >2 build the folder paths >3 list the files in those folders 
// >4 turn the filenames into web URLs > send the list back."

// Uploads no longer pipe file bytes through this server (Render's free tier is too slow/asleep
// for that). Instead: the browser asks here for a signed Storage URL, uploads the bytes straight
// to Supabase itself, then calls /confirm so we can record the row. Render only ever sees small JSON.
app.post('/api/media/:category/sign', validateCategory, authGate, async (req, res) => {
    const category = req.params.category
    const ext = typeof req.body.ext === 'string' ? req.body.ext.toLowerCase() : ''
    if (!ALLOWED[ext]) {
        return res.status(400).json({ error: 'Unknown or missing file extension' })
    }

    const filename = `${randomUUID()}${ext}`
    const { data, error } = await supabase.storage
        .from('work-media')
        .createSignedUploadUrl(`${category}/${filename}`)

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json({ filename, token: data.token, path: data.path })
})

app.post('/api/media/:category/confirm', validateCategory, authGate, async (req, res) => {
    const category = req.params.category
    const { filename, type } = req.body
    const ext = typeof filename === 'string' ? path.extname(filename).toLowerCase() : ''
    // names are only ever issued by /sign as <uuid><ext>, so refuse anything else
    const issuedName = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/
    if (!issuedName.test(filename || '') || !ALLOWED[ext] || !['video', 'photo'].includes(type)) {
        return res.status(400).json({ error: 'filename (with a known extension) and type are required' })
    }

    const { data: last } = await supabase
        .from('media')
        .select('sort_order')
        .eq('category', category)
        .order('sort_order', { ascending: false })
        .limit(1)

    const nextOrder = last && last.length ? last[0].sort_order + 1 : 0
    const { error: dbError } = await supabase
        .from('media')
        .insert({ category, filename, type, sort_order: nextOrder })

    if (dbError) {
        return res.status(500).json({ error: dbError.message })
    }

    res.json({ ok: true, file: filename })
})




app.delete('/api/media/:category/:filename', validateCategory, authGate, async (req, res) => {
    const category = req.params.category
    const filename = req.params.filename
    if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) { // make sure its not possible to delete different folders or files
        return res.status(400).json({ error: 'Invalid filename' })
    }
    const isVideo = filename.endsWith('.mp4') || filename.endsWith('.webm')
    const sub = isVideo ? 'videos' : 'photos'
    const fullPath = path.join(WORK_DIR, category, sub, filename)

    // 1) delete the ROW first (so we never leave a row pointing at a missing file)
    const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('category', category)
        .eq('filename', filename)
    if (dbError) {
        return res.status(500).json({ error: dbError.message })
    }

    // 2) remove the FILE from Storage
    const { error: storageError } = await supabase.storage
        .from('work-media')
        .remove([`${category}/${filename}`])
    if (storageError) {
        return res.status(500).json({ error: storageError.message })
    }

    res.json({ ok: true, deleted: filename })
    console.log('delete sucssefull')
})

app.post('/api/media/:category/reorder', validateCategory, authGate, async (req, res) => {
    const category = req.params.category
    const { filenames } = req.body   // ordered array of filenames, first = top

    if (!Array.isArray(filenames)) {
        return res.status(400).json({ error: 'filenames must be an array' })
    }

    // set each row's sort_order to its position in the list — in parallel, since each
    // update targets its own row (distinct filename) so there's no race between them
    const results = await Promise.all(
        filenames.map((filename, i) =>
            supabase.from('media').update({ sort_order: i }).eq('category', category).eq('filename', filename)
        )
    )
    const failed = results.find((r) => r.error)
    if (failed) {
        return res.status(500).json({ error: failed.error.message })
    }

    res.json({ ok: true })
})

app.listen(PORT, () => { // what actualy starts the server is starts waiting for requests on port 3001
    console.log(`Server running at http://localhost:${PORT}`) // prints text to the terminal this is for the developer, we leave notes confirm somthing works ect
})
