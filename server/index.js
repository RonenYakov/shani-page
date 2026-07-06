import 'dotenv/config'
import express from 'express'
import fs from 'node:fs/promises' //file heandling system we use promises syntax
import path from 'node:path' // tool for buliding paths
import { fileURLToPath } from 'node:url'
import multer from 'multer'
import { randomUUID } from 'node:crypto' // for generating random strings/ids
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
const ALLOWED_ORIGINS = [
    'http://localhost:8080',            // your dev frontend
    'https://shani-page.vercel.app',    // your live site
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
function requireAuth(req, res, next) { // the auth token by defult comes with an header so we need to strip down the token 
    const header = req.headers.authorization || ''
    const token = header.replace('Bearer ', '')
    if (token !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Invalid token' })
    }
    next() // token is valid — let the request continue to the upload/delete handler
}

function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() // extname extracts the file type .jpg .mp4 and such, tolower makes it lowercase so it match the mpa
    // extension must be known AND its expected MIME must match what the client claims
    if (ALLOWED[ext] && ALLOWED[ext] === file.mimetype) {
        cb(null, true)
    } else {
        cb(null, false)   // multer silently drops it → req.file is undefined → your route returns 400
    }
}

const storage = multer.memoryStorage() // we use memory storage becuse we are uploading to the supbase not the hard disk


const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }) // this are the upload rules we will use on post req
app.get('/api/auth/check', requireAuth, (req, res) => {
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

app.post('/api/media/:category', validateCategory, requireAuth, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
    }

    const category = req.params.category
    const ext = path.extname(req.file.originalname).toLowerCase()
    const filename = `${randomUUID()}${ext}`
    const type = req.file.mimetype.startsWith('video/') ? 'video' : 'photo'

    // 1) put the BYTES in Storage
    const { error: uploadError } = await supabase.storage
        .from('work-media')
        .upload(`${category}/${filename}`, req.file.buffer, { contentType: req.file.mimetype })

    if (uploadError) {
        return res.status(500).json({ error: uploadError.message })
    }
    const { data: last } = await supabase
        .from('media')
        .select('sort_order')
        .eq('category', category)
        .order('sort_order', { ascending: false })
        .limit(1)

    const nextOrder = last && last.length ? last[0].sort_order + 1 : 0
    // 2) record the FACTS in the table
    const { error: dbError } = await supabase
        .from('media')
        .insert({ category, filename, type, sort_order: nextOrder })

    if (dbError) {
        return res.status(500).json({ error: dbError.message })
    }

    res.json({ ok: true, file: filename })
})




app.delete('/api/media/:category/:filename', validateCategory, requireAuth, async (req, res) => {
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

app.post('/api/media/:category/reorder', validateCategory, requireAuth, async (req, res) => {
    const category = req.params.category
    const { filenames } = req.body   // ordered array of filenames, first = top

    if (!Array.isArray(filenames)) {
        return res.status(400).json({ error: 'filenames must be an array' })
    }

    // set each row's sort_order to its position in the list
    for (let i = 0; i < filenames.length; i++) {
        const { error } = await supabase
            .from('media')
            .update({ sort_order: i })
            .eq('category', category)
            .eq('filename', filenames[i])
        if (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    res.json({ ok: true })
})

app.listen(PORT, () => { // what actualy starts the server is starts waiting for requests on port 3001
    console.log(`Server running at http://localhost:${PORT}`) // prints text to the terminal this is for the developer, we leave notes confirm somthing works ect
})
