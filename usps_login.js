import fs, { WriteStream } from 'fs'
import {prod_server} from './env.js'
import pg from 'pg'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())

//Get Current Date
function double_digit_date(n) { return (n < 10 ? '0' : '') + n; }
var date = new Date()
var month = double_digit_date(date.getMonth()+1)
var day = double_digit_date(date.getDate())
var year= date.getFullYear()
var formattedDate =  month+"-"+day+"-"+year
console.log(formattedDate)

//DB Connection
async function queryDB(sql, params) {
	const connection = new pg.Client()
	connection.on('error', (err => {throw err}))
	await connection.connect()
	const result = await connection.query(sql, params)
	await connection.end()
	return result
}

let srv = 15
let custcode = 'CVSC'
let claim_type = 'unused_labels'

//DB List
for(let server_index = srv; server_index < 16; server_index ++){
	if(server_index == 13) {
		continue 
	}

	prod_server(server_index)

    let uid = ''
    let pwd = ''
    let sql_out
    let sql_creds
    
    // cc.is_bc_new = true ~~~ is only for usps business customer gateway portal ~~~ claim types / unused labels / duplicate manifest / duplicate package
    if(claim_type == 'unused_labels' || claim_type == 'duplicate_manifest' || claim_type == 'duplicate_package') { 
        sql_creds = `
            select uid, pwd from cust_creds where custcode = '${custcode}' and carriercode ='USP'` //and is_new_bc`
            let login_creds = await queryDB(sql_creds);
            console.log(login_creds)
            uid = login_creds.rows[0].uid
            pwd = login_creds.rows[0].pwd
    } else {
        uid = 'ia_claims'
        pwd = 'Welcome#12345'
    }

    if(claim_type == 'unused_labels') {
        sql_out =`
            select array_agg(pkgs.trackingno) from packages pkgs where pkgs.custcode = '${custcode}' 
                and pkgs.carriercode ='USP' and pkgs.delstatus ='CUSTOMER INVESTIGATE' and pkgs.trackingno like '920%' and pkgs.credate >= current_date - 270 and pkgs.credate < current_date - 7
                and not exists (SELECT 1 FROM fdxrefunds JOIN fdxinvoicedetail fid using (seq) WHERE fid.trackingno = pkgs.trackingno)`
    } else {
        if(claim_type == 'duplicate_manifest') {
            sql_out =`select array_agg(pkgs.trackingno) from `
        } else {                                                  //claim_type duplicate_packages
            sql_out =`select array_agg(pkgs.trackingno) from `
        }
    }
    console.log(sql_out)
    var sql_array = await queryDB(sql_out)
    console.log(sql_array.rows[0].array_agg)
    var trackingno = sql_array.rows[0].array_agg
    console.log(trackingno)

    await fs.writeFileSync('./files/usps/' + custcode + '_' + uid + '_' + formattedDate + '.txt', trackingno.join('\n'))

    //UPS url list
    let login_page = 'https://reg.usps.com/entreg/LoginBCGAction_input?app=EadminAPP&appURL=https://gateway.usps.com/eAdmin/view/signin/loginCheck'
    let lost_claims = 'https://missingmail.usps.com/?_gl=1*1e829lb*_gcl_au*MTAzODE4MTkyNi4xNzEwODk2MjY2*_ga*ODQ3NjkyMDMzLjE3MTA4OTYyNjY.*_ga_3NXP3C8S9V*MTcxMDkyODI1MS41LjEuMTcxMDkyODg2NC4wLjAuMA..#/'
    let late_domastic_claims = 'https://servicerefunds.usps.com/OSR/?_gl=1*xjxrbg*_gcl_au*MTAzODE4MTkyNi4xNzEwODk2MjY2*_ga*ODQ3NjkyMDMzLjE3MTA4OTYyNjY.*_ga_3NXP3C8S9V*MTcxMDkyODI1MS41LjEuMTcxMDkyODcxNi4wLjAuMA..'
    let late_international_claims = 'https://internationalclaims.usps.com/OLI/landing?method=initiateOLI&_gl=1*1icvqkd*_gcl_au*MTAzODE4MTkyNi4xNzEwODk2MjY2*_ga*ODQ3NjkyMDMzLjE3MTA4OTYyNjY.*_ga_3NXP3C8S9V*MTcxMDkyODI1MS41LjEuMTcxMDkyODY1Ny4wLjAuMA..'

    //Browser Settings
    let options = {
        headless: false,
        ignoreHTTPSErrors: true,
        ignoreDefaultArgs: ['--enable-automation'],
        args: [
            '--incognito',
            '--disable-infobars',
            '--start-maximized',
            '--user-data-dir=C:/puppeteer/',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    }

    //options.executablePath = 'brave-browser'

    await puppeteer.launch(options).then(async browser => {
        let pages = await browser.pages()
        let page = pages.length ? pages[0] : await browser.newPage()
        console.log('Loading Stealth Plugin...')
        await Promise.all([ page.goto(login_page), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

        //Login
        await page.waitForSelector('#username', { delay: 1000 })  
        await page.type('#username', uid)
        await page.type('#password', pwd, { delay: 500})
        await Promise.all([ page.click('#btn-submit'), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

        if(claim_type == 'unused_labels' || claim_type == 'duplicate_manifest' || claim_type == 'duplicate_package') {
            let eVS = await page.waitForSelector('a[href*="requestPage=P1MANAGEEVA"]')
            if(eVS) await eVS.click()
            else console.log('Missing eVS link...')
            console.log('eVS')
            
            if(claim_type == 'unused_labels') {
            await page.waitForNavigation()
            await page.waitForSelector('frame')
            const selector1 = '#refundUploadLink'
            const Frame1 = await page.frames()[1]
            await Promise.all([
                Frame1.waitForNavigation(),
                Frame1.$eval(selector1, el => el.click())
            ])
            console.log('Unused Labels Submission...')
            return page
            } 
            
            if(claim_type == 'duplicate_manifest' || claim_type == 'duplicate_package') {
            await page.waitForNavigation()
            await page.waitForSelector('frame')
            const selector1 = '#refundLink'
            const Frame1 = await page.frames()[1]
            await Promise.all([
                Frame1.waitForNavigation(),
                Frame1.$eval(selector1, el => el.click())
            ])
            console.log('Duplicate Manifest or Duplicate Package Submission...')
            return page
            }

        } else {
            if(claim_type == 'late_domastic'){
                await Promise.all([ page.goto(late_domastic_claims), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

                /**/// get to set value of the input type text capture response  -- 35 tracking numbers at a time
                
                let trackingno = '92612931508576511305065008'
                await page.type('#trackingNumber', trackingno, { delay: 120 })
                
                await page.keyboard.press('Enter');
                or
                await page.evaluate(() => {
                document.querySelector('input[type=submit]').click();
                });

                /**/

                return page
            }
        }

        await browser.close()
    })
}