const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require("path");


let cfile = process.argv[2];
let mfile = process.argv[3];


let itemUrl;
(async function () {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      slowMo: 100,

      args: ['--start-maximized', '--disable-notifications']
    });
    let CredObj = await fs.promises.readFile(cfile, 'utf-8');
    let credentials = JSON.parse(CredObj);
    let username = credentials.un;
    let pwd = credentials.pwd;
    let URL = credentials.url;
    let fname = credentials.fname;
    let lname = credentials.lname;
    let address = credentials.address;
    let landmark = credentials.landmark;
    let pincode = credentials.pincode;
    let mno = credentials.mno;


    let pages = await browser.pages();
    let page = pages[0];
    page.goto("https://www.naturesbasket.co.in/", {
      waitUntil: 'networkidle0'
    });

    await page.waitForSelector(".headerspantextlogin", { visible: true });
    
    await page.click(".headerspantextlogin");
    await page.waitForSelector("input[type=text]", { visible: true });
    await page.type('input[type=text]', username);
    await page.type('input[type=password]', pwd);
    await page.click("input[type=button]");

    await page.waitForSelector("div#ctl00_divMenuLogedIn", { visible: true });
    // await page.type("#ctl00_txtMasterSearch1", "Red Bull");
    // await page.keyboard.press('ArrowDown');
    // await page.keyboard.press('Enter');
    // await page.click("a[title=Energy Drink - Red Bull]");
    // let rsrcElement = await page.$('div.divAddToMyListContainer a');
    // let resourceHref = await rsrcElement.evaluate(el => el.getAttribute('href'));
    // page.goto(path.join(page.url(),resourceHref), {
    //     waitUntil: 'networkidle0'
    // });
    let metadataRead = await fs.promises.readFile(mfile);
    //parse metadata file
    let metadata = await JSON.parse(metadataRead);

    for (let i = 0; i < metadata.items.length; i++) {
      await openItemPage(page, metadata.items[i]);
    }
    await page.waitForSelector(".my-cart-wrap", { visible: true });
    await page.click('.my-cart-wrap');

    await page.waitForSelector("#ctl00_ContentPlaceHolder1_divcheckout", { visible: true });
    await page.click('#ctl00_ContentPlaceHolder1_divcheckout');
    await page.waitForSelector(".EKstextBox", { visible: true });

    await page.type('#ctl00_ContentPlaceHolder1_txtFirstName', fname);
    await page.type('#ctl00_ContentPlaceHolder1_txtLastName', lname);
    await page.type('#ctl00_ContentPlaceHolder1_txtAddress', address);
    await page.type('#ctl00_ContentPlaceHolder1_txtLandmark', landmark);
    await page.type('#ctl00_ContentPlaceHolder1_txtPincode', pincode);


    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');

    await page.type('#ctl00_ContentPlaceHolder1_txtPincode', pincode);
    await page.click('#ctl00_ContentPlaceHolder1_ddlshippingArea');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.type('#ctl00_ContentPlaceHolder1_txtMobile', mno);
    await page.click("#ctl00_ContentPlaceHolder1_btnShippingContinue");







  } catch (err) {
    console.log(err);
  }
})();


//   } catch (err) {
//     console.log(err);
//   }
// }

async function openItemPage(page, item) {
  try {
    await page.type("#ctl00_txtMasterSearch1", item.name);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    page.goto(item.url, {
      waitUntil: 'networkidle0'
    });
    await page.waitForSelector("#btnAddToCartProductDetail", { visible: true });
    await page.click("#btnAddToCartProductDetail");
    await page.waitForSelector("#ctl00_divAlertMessage", { visible: true });
    await page.click(".CommonTextBred");

    await page.waitForSelector("div#ctl00_divMenuLogedIn", { visible: true });
    console.log("well done");
  } catch (err) {
    console.log(err);
  }
}


// let userName, pwd, metadata;
// let gcrsElements,
//   gcrsi = 0,
//   gcrsurl;
// let gcodeArea, gContent, gtestArea;
// let cfileWillBeReadPromise = fs.promises.readFile(cfile);
// cfileWillBeReadPromise
//   .then(function (content) {
//     let credentials = JSON.parse(content);
//     userName = credentials.un;
//     pwd = credentials.pwd;
//   })
//   .then(function () {
//     let toWillBeSetPromise = driver.manage().setTimeouts({
//       implicit: 10000,
//     });
//     return toWillBeSetPromise;
//   })
//   .then(function () {
//     driver.manage().window().maximize();
//     let indexPageWillBeLoadedPromise = driver.get(
//       "https://www.naturesbasket.co.in/"
//     );
//     return indexPageWillBeLoadedPromise;
//   })
//   .then(function () {
//     let btnLoginWillBeFoundPromise = driver.findElement(
//       swd.By.css(".headerspantextlogin")
//     );
//     return btnLoginWillBeFoundPromise;
//   })
//   .then(function (btnLogin) {
//     let btnLoginWillBeClickedPromise = btnLogin.click();
//     return btnLoginWillBeClickedPromise;
//   })
//   .then(function () {
//     let uneWillBeFoundPromise = driver.findElement(
//       swd.By.css("#txtUserEmailId")
//     );
//     let pwdeWillBeFoundPromise = driver.findElement(
//       swd.By.css("#txtUserPassword")
//     );
//     let bothElementsWillBeFoundPromise = Promise.all([
//       uneWillBeFoundPromise,
//       pwdeWillBeFoundPromise,
//     ]);
//     return bothElementsWillBeFoundPromise;
//   })
//   .then(function (elements) {
//     let userNameWillBeEnteredPromise = elements[0].sendKeys(userName);
//     let pwdWillBeEnteredPromise = elements[1].sendKeys(pwd);
//     let bothValuessWillBeEnteredPromise = Promise.all([
//       userNameWillBeEnteredPromise,
//       pwdWillBeEnteredPromise,
//     ]);
//     return bothValuessWillBeEnteredPromise;
//   })
//   .then(function () {
//     let btnSubmitWillBeFoundPromise = driver.findElement(
//       swd.By.css(".btnCssContinue.enterEventButton")
//     );
//     return btnSubmitWillBeFoundPromise;
//   })
//   .then(function (btnSubmit) {
//     let btnSubmitWillBeClickedPromise = btnSubmit.click();
//     return btnSubmitWillBeClickedPromise;
//   })
//   // .then(function () {
//   //   // s2 -> link ka wait karein, uska href read karein, aur driver.get kar jaien
//   //   let waitForRLinkToBeLocatedPromise = driver.wait(
//   //     swd.until.elementLocated(swd.By.css("#ctl00_divMenuLogedIn span#ctl00_lblUserName").getAttribute("innerHTML"))
//   //   );
//   //   return waitForRLinkToBeLocatedPromise;
//   // })
//   .then(function () {

//     let searchBoxWillBeFoundPromise = driver.findElement(swd.By.css("#ctl00_txtMasterSearch1"));
//     return searchBoxWillBeFoundPromise;
// })
//   .then(function (searchBox) {
//     let searchBoxWillBeEnteredPromise = searchBox.sendKeys("Red Bull");

//     return searchBoxWillBeEnteredPromise;
// }).then(function () {
//     let btnSearchWillBeFoundPromise = driver.findElement(swd.By.css("#divBtnSearch"));
//     return btnSearchWillBeFoundPromise;
// }).then(function (btnSearch) {
//     let btnSearchWillBeClickedPromise = btnSearch.click();
//     return btnSearchWillBeClickedPromise;
// })
//   .then(function () {
//     console.log("well done");
//   })
//   .catch(function (err) {
//     console.log(2);
//     console.log(err);
//   })
//   .finally(function () {
//     // driver.quit();
//   });
