import puppeteer from 'puppeteer'
import {setTimeout} from "timers/promises"
import fs from 'fs'
import { config } from 'dotenv'

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
        
        let page_login = false
        do {
            // Navigate the page to a URL
            await Promise.all([ page.goto(login_page), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

            // Set screen size
            await page.setViewport({width: 1080, height: 1024})

            // Login
            await page.waitForSelector('#username', { delay: 1000 }) 
            await page.type('#username', 'ia_claims')
            await page.type('#password', 'Welcome#12345', { delay: 500})
            await Promise.all([ page.click('#btn-submit'), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

            let welcome_msg = await page.evaluate(el => el.innerText, await page.$('.welcome.welcome-message'))
            console.log(welcome_msg)
            if(welcome_msg == 'Welcome, Slava Rubin') {
                page_login = true
                break
            } else {
                await setTimeout(60000)
            }

        } while(page_login == false)

        // Navigate to late claims submission page
        await Promise.all([ page.goto(late_domastic_claims), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

        for(let trackingno_counter = 0; trackingno_counter < trackingno_list.length; trackingno_counter ++) {
            // Sumbit claims
            let tracking_num = trackingno_list[trackingno_counter]
            await page.waitForSelector('#tracking-numbers-control > div > div > ul > li > input', { delay: 1000 })
            await page.type('#tracking-numbers-control > div > div > ul > li > input', tracking_num.trim(), { delay: 300 })
            await page.click('#tracking-numbers-control > div > div > ul > li > input', { delay: 100 })
            await setTimeout(1500)
            await page.click('.refunds-button-primary', { delay: 50 })
            await setTimeout(3000)

            // Get response
            let claim_resolution = await page.evaluate(element => element.textContent, await page.$('.help-block.help-block--error span'))  
            console.log(claim_resolution)
            await  appendText(claim_resolution)
            res.send(claim_resolution)
            await page.click('#tracking-numbers-control > div > div > ul > li > input', { delay: 100 })
            for (let i = 0; i < 4; i++) {
                await page.keyboard.press('Backspace', { delay: 100})
            }
            await setTimeout(3000)
        }

    } catch (e){
      console.error(e)
      res.send(`Something went wrong while runnign Puppetter: ${e}`)
    } finally {

       await browser.close()
    }

}

async function appendText(text) { 
    fs.appendFile('./outgoing/output.txt', `${text}\r\n`, function(err) {
      if(err) {
          return console.log(err);
      }
    
      console.log("The file was saved!");
    });
}
