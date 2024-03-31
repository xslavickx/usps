import puppeteer from 'puppeteer'
require('dotenv').config()

export async function scrapeLogic (res,trackingno_list) {  

    // UPS url list
    let login_page = 'https://reg.usps.com/entreg/LoginBCGAction_input?app=EadminAPP&appURL=https://gateway.usps.com/eAdmin/view/signin/loginCheck'
    let late_domastic_claims = 'https://servicerefunds.usps.com/OSR/?_gl=1*xjxrbg*_gcl_au*MTAzODE4MTkyNi4xNzEwODk2MjY2*_ga*ODQ3NjkyMDMzLjE3MTA4OTYyNjY.*_ga_3NXP3C8S9V*MTcxMDkyODI1MS41LjEuMTcxMDkyODcxNi4wLjAuMA..'

    // Browser options
    let options = {
    headless: false,
    executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
        '--disable-setuid-sandbox',
        '--no-sendbox',
        '--single-process',
        '--no-zygoote',
    ]
    }
    const browser = await puppeteer.launch(options)
    try {
        let pages = await browser.newPage()
        let page = pages.length ? pages[0] : await browser.newPage()
        //throw new Error('whoops!')

        // Navigate the page to a URL
        await Promise.all([ page.goto(login_page), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

        // Set screen size
        await page.setViewport({width: 1080, height: 1024})

        // Login
        await page.waitForSelector('#username', { delay: 1000 }) 
        await page.type('#username', 'ia_claims')
        await page.type('#password', 'Welcome#12345', { delay: 500})
        await Promise.all([ page.click('#btn-submit'), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

        // Navigate to late claims submission page
        await Promise.all([ page.goto(late_domastic_claims), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

        for(let trackingno_counter = 0; trackingno_counter < trackingno_list.rows.length; trackingno_counter ++) {
            // Sumbit claims
            let tracking_num = trackingno_list.rows[trackingno_counter].trackingno
            await page.waitForSelector('#tracking-numbers-control > div > div > ul > li > input', { delay: 1000 })
            await page.type('#tracking-numbers-control > div > div > ul > li > input', tracking_num, { delay: 300})
            await page.click('#tracking-numbers-control > div > div > ul > li > input', { delay: 50})
            await page.click('.refunds-button-primary', { delay: 50})

            // Get response
            let claim_resolution = await page.evaluate(element => element.textContent, await page.$('.help-block.help-block--error span'))  
            console.log(claim_resolution)
            res.send(claim_resolution)
        }

    } catch (e){
      console.error(e)
      res.send(`Something went wrong while runnign Puppetter: ${e}`)
    } finally {

       await browser.close()
    }

}