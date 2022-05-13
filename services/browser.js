import * as path from 'node:path'
import puppeteer from 'puppeteer'
import { getQueryString } from '../utils/queryUtils.js'

class Browser {
  async init() {
    this.browser = await puppeteer.launch()
  }

  async getScreenshot(options) {
    const page = await this.browser.newPage()
    console.log('path to tamplate: ', path.resolve(process.cwd(), 'static', `template.html${getQueryString(options)}`))
    await page.goto(
      path.resolve(process.cwd(), 'static', `template.html${getQueryString(options)}`)
    )
    const imageBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 100,

    })
    await page.close()
    return imageBuffer
  }

}

let browser

export const getBrowser = async () => {
  if (!browser) {
    browser = new Browser()
    await browser.init()
  }
  return browser
}