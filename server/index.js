import 'dotenv/config'
import express from 'express'
import fs from 'node:fs/promises' //file heandling system we use promises syntax
import path from 'node:path' // tool for buliding paths
import { fileURLToPath } from 'node:url'
import multer from 'multer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))// we need this for the server to know where the files are

const WORK_DIR = path.join(__dirname, '..', 'public', 'work') // tell the server where the work folder is

const CATEGORIES = ['photoshoot', 'weddings', 'management', 'ugc']

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']

const ADMIN_TOKEN = process.env.ADMIN_TOKEN // PROSSES env is a safe way to store secert information about our app in this case it stores the password so it will not be visible to the public
if (!ADMIN_TOKEN) {
    throw new Error('ADMIN_TOKEN is missing — create a .env file with ADMIN_TOKEN=...')
}
const app = express() //we make the server appliaction and store it as app

app.use((req, res, next) => { // the fron and back sits on different ports so the back gives the front perrmission to access it. this is part of a security policy called CORS

    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204) // preflight: answer "yes, allowed" with No Content
    }
    next()
})
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
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const storage = multer.diskStorage({ // meaning we want to save new uploades on the hard disk
    destination: (req, file, cb) => { // req = the request (has the category in the URL).file = info about the file being uploaded (its type, original name…).cb = "call back" — how we report our answer to multer
        const category = req.params.category
        const sub = file.mimetype.startsWith('video/') ? 'videos' : 'photos'
        cb(null, path.join(WORK_DIR, category, sub))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})


const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }) // this are the upload rules we will use on post req
app.get('/api/auth/check', requireAuth, (req, res) => {
    res.json({ ok: true })
    // we have to use a get here becuse the fron must use a url fetch to talk to the server and the get right away calls the auth func and returns just true of false
})

app.get('/', (req, res) => { // is the reception if client walks in it reads the message and gives a response
    res.send('Hello from the Shani CMS backend! 👋')
})
app.get('/api/media/:category', validateCategory, async (req, res) => {
    const category = req.params.category//1

    const videosDir = path.join(WORK_DIR, category, 'videos')//2 it build the path string meaning if we choose the wedding category we will get "...\public\work\weddings\videos\"
    const photosDir = path.join(WORK_DIR, category, 'photos')
    const videoFiles = await fs.readdir(videosDir)//3
    const photoFiles = await fs.readdir(photosDir)
    // only serve real media — ignore stray files (.mov, README.txt, .DS_Store, etc.)
    const isVideoFile = name => /\.(mp4|webm)$/i.test(name)
    const isPhotoFile = name => /\.(jpe?g|png|webp)$/i.test(name)
    const videos = videoFiles.filter(isVideoFile).map(name => `/work/${category}/videos/${name}`)//4
    const photos = photoFiles.filter(isPhotoFile).map(name => `/work/${category}/photos/${name}`)

    res.json({ videos, photos })
})
//" 1-Read which category they asked for >2 build the folder paths >3 list the files in those folders 
// >4 turn the filenames into web URLs > send the list back."

app.post('/api/media/:category', validateCategory, requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
    }
    res.json({ ok: true, file: req.file.originalname })


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
    try {
        await fs.unlink(fullPath) // we use await to make sure the file ius actualy gone before moving forward
        res.json({ ok: true, deleted: filename })
    }
    catch (err) {
        res.status(400).json({ error: "No such file exists" })

    }

})



app.listen(PORT, () => { // what actualy starts the server is starts waiting for requests on port 3001
    console.log(`Server running at http://localhost:${PORT}`) // prints text to the terminal this is for the developer, we leave notes confirm somthing works ect
})
