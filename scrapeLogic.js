const puppeteer = require('puppeteer')

const scrapeLogic = async(res) => {
  //UPS url list
  let login_page = 'https://reg.usps.com/entreg/LoginBCGAction_input?app=EadminAPP&appURL=https://gateway.usps.com/eAdmin/view/signin/loginCheck'
  let lost_claims = 'https://missingmail.usps.com/?_gl=1*1e829lb*_gcl_au*MTAzODE4MTkyNi4xNzEwODk2MjY2*_ga*ODQ3NjkyMDMzLjE3MTA4OTYyNjY.*_ga_3NXP3C8S9V*MTcxMDkyODI1MS41LjEuMTcxMDkyODg2NC4wLjAuMA..#/'
  let late_domastic_claims = 'https://servicerefunds.usps.com/OSR/?_gl=1*xjxrbg*_gcl_au*MTAzODE4MTkyNi4xNzEwODk2MjY2*_ga*ODQ3NjkyMDMzLjE3MTA4OTYyNjY.*_ga_3NXP3C8S9V*MTcxMDkyODI1MS41LjEuMTcxMDkyODcxNi4wLjAuMA..'
  let late_international_claims = 'https://internationalclaims.usps.com/OLI/landing?method=initiateOLI&_gl=1*1icvqkd*_gcl_au*MTAzODE4MTkyNi4xNzEwODk2MjY2*_ga*ODQ3NjkyMDMzLjE3MTA4OTYyNjY.*_ga_3NXP3C8S9V*MTcxMDkyODI1MS41LjEuMTcxMDkyODY1Ny4wLjAuMA..'

  let claim_type = 'unused_labels'
  //Browser Se
  let options = {
   headless: false,
   /* /executablePath: 'brave-browser',
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--incognito',
      '--disable-infobars',
      '--start-maximized',
      '--user-data-dir=C:/puppeteer/',
      '--disable-features=IsolateOrigins,site-per-process'
    ]*/
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

    //Login
    await page.waitForSelector('#username', { delay: 1000 })  
    /** /
    await page.type('#username', 'ia_claims')
    await page.type('#password', 'Welcome#12345', { delay: 500})
    /**/
    await page.type('#username', 'CVS-IA')
    await page.type('#password', 'i360@WSIA', { delay: 500})
    /** /
    await page.type('#username', uid)
    await page.type('#password', pwd, { delay: 500})
    /**/
    await Promise.all([ page.click('#btn-submit'), page.waitForNavigation({ waitUntil:'networkidle2' }) ])

    //Navigate to claim submit page based on claim type
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
        if(claim_type == 'late_domastic') {
            await Promise.all([ page.goto(late_domastic_claims), page.waitForNavigation({ waitUntil:'networkidle2' }) ])
        } else {
            if(claim_type == 'late_international') {
                await Promise.all([ page.goto(late_international_claims), page.waitForNavigation({ waitUntil:'networkidle2' }) ])
            }
        }    
    }
    
    // Type into search box
    await page.type('.devsite-search-field', 'automate beyond recorder')

    // Wait and click on first result
    const searchResultSelector = '.devsite-result-item-link'
    await page.waitForSelector(searchResultSelector)
    await page.click(searchResultSelector)

    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
        'text/Customize and automate'
    )
    const fullTitle = await textSelector?.evaluate(el => el.textContent)

    // Return page object
    res.send(page)
    
    // Print the full title
    const logStatement = `The title of this blog post is ${fullTitle}`
    console.log(logStatement)
    res.send(logStatement)
  } catch (e){
    console.error(e)
    res.send(`Something went wrong while runnign Puppetter: ${e}`)
  } finally {

    await browser.close()
  }

}

module.exports = { scrapeLogic }