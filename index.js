import fs from 'fs'
import express from 'express'
import { scrapeLogic } from './scrapeLogic.js'

const app = express()
const PORT = process.env.PORT || 4000

const filePath = './incoming/input.txt';

let fileContent = fs.readFileSync(filePath, 'utf-8');
let trackingno_list = fileContent.split('\n');

app.get('/scrape', (req, res) => {
    scrapeLogic(res,trackingno_list)
})

app.get('/', (req, res) => {
    res.send('Render Puppeteer server is up and running!')
}) 

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
