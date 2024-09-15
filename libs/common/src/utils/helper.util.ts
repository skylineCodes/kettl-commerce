import * as puppeteer from 'puppeteer';
import ExpHandlebars from 'handlebars';

export const generateRandomDigits = (length: number): string => {
    if (length <= 0) {
      throw new Error("Length must be a positive number");
    }
  
    let randomDigits = '';
    const digits = '0123456789';
  
    for (let i = 0; i < length; i++) {
      randomDigits += digits.charAt(Math.floor(Math.random() * digits.length));
    }
  
    return randomDigits;
}

export const currencySeparator = (money: string) => {
  return money?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 9);
}

export const generateInvoice = async (html: string, outputFilePath: string): Promise<void> => {
  const template = ExpHandlebars.compile(html);
  // const finalHtml = encodeURIComponent(template(dataBinding));

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',  // Prevent /dev/shm from being exhausted
      '--disable-gpu',  // Disable GPU, especially useful for headless mode
      '--headless',  // Ensure Puppeteer is running in headless mode
    ],
    protocolTimeout: 180000
  });

  const page = await browser.newPage();

  // Set content of the page
  await page.setContent(html, {
    waitUntil: 'networkidle0', // Wait until there are no network connections for at least 500ms
  });

  // await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
  //   waitUntil: 'networkidle0'
  // });

  // Create the PDF
  await page.pdf({
    displayHeaderFooter: false,
    headerTemplate: '<p></p>',
    footerTemplate: '<p></p>',
    path: outputFilePath, // Path to store the generated PDF
    format: 'A4', // You can also set it to letter, etc.
    printBackground: true, // Ensures background colors and images are rendered
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm',
    },
  });

  await browser.close();
}
  