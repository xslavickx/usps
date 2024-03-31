import express from 'express'
import { scrapeLogic } from './scrapeLogic.js'
import pg from 'pg'
import { prod_server } from './env.js'
const app = express()
const PORT = process.env.PORT || 4000

//DB Connection
async function queryDB(sql, params) {
	const connection = new pg.Client()
	connection.on('error', (err => {throw err}))
	await connection.connect()
	const result = await connection.query(sql, params)
	await connection.end()
	return result
}

//DB List
for(let server_index = 7; server_index < 8; server_index ++){
	if(server_index == 13) {
		continue 
	}

    prod_server(server_index)

    let get_trackingno_list = "select distinct dtl.trackingno from fdxinvoice inv join fdxinvoicedetail dtl using(invoicenum) join fdxinvcharge chr using(seq) where credate between current_date - 30 and current_date - 14 and code != 'FRT' and carriercode = 'USP'"
    let trackingno_list = await queryDB(get_trackingno_list)
    console.log(trackingno_list);

    app.get('/scrape', (req, res) => {
        scrapeLogic(res,trackingno_list)
    })

    app.get('/', (req, res) => {
        res.send('Render Puppeteer server is up and running!')
    }) 

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}