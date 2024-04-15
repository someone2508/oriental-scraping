const puppeteer = require('puppeteer');
const constants = require('../../constants');

let isLoggedIn = false;

async function printCurrentUrl(page) {
    const url = await page?.evaluate(() => {
        return document.URL;
    });
    console.log(url);
    return url;
}

async function checkLoginInBackground(page) {
    let intervalKey, checkedTimes = 0;
    intervalKey = setInterval(async () => {
        let url = await printCurrentUrl(page);
        if(url.includes("dashboard")) {
            clearInterval(intervalKey);
            isLoggedIn = true;
            page.close();
        }
        if(checkedTimes > 10)
        {
            clearInterval(intervalKey);
            console.log("Login timedout!");
            loginFunc();
        }
        checkedTimes++;
    }, 2000);
}

let browser;

const loginFunc = async () => {
    if(browser)
    {
        console.log("closing browser!");
        await browser.close();
        console.log("browser closed()");
    }

    browser = await puppeteer.launch({
        headless: false,
        args: ['-no-sandbox']
    });

    let page = await browser.newPage();
    page.setDefaultTimeout(0);

    // setting default navigation timeout to 0 to skip timeout issues, as portal takes too long to respond.
    page.setDefaultNavigationTimeout(0);

    // setting viewport for headfull tests.
    await page.setViewport({ width: 1200, height: 800 });

    console.log("Step 3 : new page is created!");

    // going to the portal login page.
    const loginUrl = `${constants.SCRAPPING[constants.INSURERS.ORIENTAL].BASE_URL}${constants.SCRAPPING[constants.INSURERS.ORIENTAL].LOGIN_URL}`;
    await page.goto(loginUrl);

    // current url
    await printCurrentUrl(page);

    console.log("Step 4 : redirected to login page, starting to fill login details!");

    // ====> Login flow
    // wait for login form to load on screen
    const loginFormSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOGIN_FORM;
    await page.waitForSelector(loginFormSelector);

    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    await page.waitForSelector('#kt_login_signin_submit');

    // get login form fields
    const emailField = await page.$(constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOGIN_EMAIL_FIELD);
    const passwordField = await page.$(constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOGIN_PASSWORD_FIELD);
    const loginButtonSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOGIN_SUBMIT_BUTTON;
    
    // fill login details
    await emailField.type(constants.SCRAPPING[constants.INSURERS.ORIENTAL].EMAIL);
    await passwordField.type(constants.SCRAPPING[constants.INSURERS.ORIENTAL].PASSWORD);
    
    // submit login form
    await page.waitForSelector(loginButtonSelector);
    await page.click(loginButtonSelector);



    console.log("Step 5 : clicked login button!");
    // console.log(await page.$(constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOGIN_EMAIL_FIELD).value);

    checkLoginInBackground(page);
}

const scrapeRateUsingPupetter = async (req, res) => {
    if(!isLoggedIn)
        return "Please try after sometime!";

    let page;

    try {
        console.log("Step 1 : Process is initiated!");
        
        // create a browser instance
        // if(!browser)
        // {
        //     console.log("LAUNCHING BROWSER!");
        //     browser = await puppeteer.launch({
        //         headless: false,
        //         args: ['-no-sandbox']
        //     });
        // }

        // pageCount++;

        // console.log("Step 2 : Browser is launched!");

        // create a new web page
        page = await browser.newPage();
        page.setDefaultTimeout(0);

        // setting default navigation timeout to 0 to skip timeout issues, as portal takes too long to respond.
        page.setDefaultNavigationTimeout(0);

        // // setting viewport for headfull tests.
        // await page.setViewport({ width: 1200, height: 800 });

        // console.log("Step 3 : new page is created!");

        // // going to the portal login page.
        // const loginUrl = `${constants.SCRAPPING[constants.INSURERS.ORIENTAL].BASE_URL}${constants.SCRAPPING[constants.INSURERS.ORIENTAL].LOGIN_URL}`;
        // await page.goto(loginUrl);

        // // current url
        // await printCurrentUrl(page);

        // console.log("Step 4 : redirected to login page, starting to fill login details!");

        // // ====> Login flow
        // // wait for login form to load on screen
        // const loginFormSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOGIN_FORM;
        // await page.waitForSelector(loginFormSelector);

        // await page.waitForSelector('input[type="email"]');
        // await page.waitForSelector('input[type="password"]');
        // await page.waitForSelector('#kt_login_signin_submit');

        // // get login form fields
        // const emailField = await page.$(constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOGIN_EMAIL_FIELD);
        // const passwordField = await page.$(constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOGIN_PASSWORD_FIELD);
        // const loginButtonSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOGIN_SUBMIT_BUTTON;
        
        // // fill login details
        // await emailField.type(constants.SCRAPPING[constants.INSURERS.ORIENTAL].EMAIL);
        // await passwordField.type(constants.SCRAPPING[constants.INSURERS.ORIENTAL].PASSWORD);
        
        // // submit login form
        // await page.waitForSelector(loginButtonSelector);
        // await page.click(loginButtonSelector);

        // console.log("Step 5 : clicked login button!");

        // // current url
        // await printCurrentUrl(page);

        // ====> redirection to policy form page
        // closing appering popup on screen
        // await page.waitForSelector(constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.HOME_PAGE_MODAL, {timeout: 60000}).catch((err) => console.log(err));

        // console.log("Step 6 : login is done!");

        // current url
        // await printCurrentUrl(page);

        const policyFormPageUrl = `${constants.SCRAPPING[constants.INSURERS.ORIENTAL].BASE_URL}${constants.SCRAPPING[constants.INSURERS.ORIENTAL].POLICY_FORM_URL}`;
        const resp = await page.goto(policyFormPageUrl);

        console.log(resp);

        const url = await printCurrentUrl(page);

        if(url.includes("login")) {
            console.log("Retry!");
            await page.close();
            isLoggedIn = false;
            loginFunc();
            return;
        }
        
        // ====> filling policy details form to get rate
        // policy type
        const policyTypeSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.POLICY_TYPE_SELECT;
        await page.waitForSelector(policyTypeSelector);

        // current url
        await printCurrentUrl(page);

        console.log("Step 7 : on policy form! : ", req.body.policyType);

        await page.waitForFunction(() => document.getElementsByName('policytype')[0].options.length > 1 );
        await page.select(policyTypeSelector, `${req.body.policyType}`);

        // make
        const makeSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.VEHICLE_MAKE_SELECT;
        await page.waitForSelector(makeSelector);
        await page.waitForFunction(() => document.getElementsByName('VehicleMake')[0].options.length > 1 );
        await page.select(makeSelector, `${req.body.make}`);

        // current url
        await printCurrentUrl(page);

        console.log("Step 8 : filled make!");


        // model
        const modelSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.VEHICLE_MODEL_SELECT;
        await page.waitForSelector(modelSelector);
        await page.waitForFunction(() => document.getElementsByName("makeModel")[0].options.length > 1 );
        await page.select(modelSelector, `${req.body.model}`);

        // current url
        await printCurrentUrl(page);

        console.log("Step 9 : filled model!");

        // model year
        const modelYearSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.VEHICLE_MODEL_YEAR_SELECT;
        await page.waitForSelector(modelYearSelector);
        await page.waitForFunction(() => document.getElementsByName("ModelYear")[0].options.length > 1 );
        await page.select(modelYearSelector, `${req.body.modelYear}`);

        console.log("Step 10 : filled model year!");

        // sum assured
        const sumAssuredSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.VEHICLE_SUM_ASSURED_FIELD;
        await page.waitForSelector(sumAssuredSelector);
        await page.type(sumAssuredSelector, `${req.body.sumAssured}`);

        // current url
        await printCurrentUrl(page);

        console.log("Step 11 : filled sumassured!");

        const insuredNameSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.INSURED_NAME_FIELD;
        await page.waitForSelector(insuredNameSelector);
        await page.type(insuredNameSelector, `${req.body.insuredName}`);

        console.log("Step 12 : filled insurer name!");

        const dobSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.DOB_SELECTOR;
        await page.waitForSelector(dobSelector);
        await page.type(dobSelector, `${req.body.dob}`);

        // current url
        await printCurrentUrl(page);

        console.log("Step 13 : filled dob!");

        const dlIssueDateSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.DL_ISSUE_DATE_SELECTOR;
        await page.waitForSelector(dlIssueDateSelector);
        await page.type(dlIssueDateSelector, `${req.body.dlIssueDate}`);

        console.log("Step 14 : filled dl issue date!");

        const nationalitySelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.NATIONALITY_SELECT;
        await page.waitForSelector(nationalitySelector);
        await page.waitForFunction(() => document.getElementsByName("Nationality")[0].options.length > 1 );
        await page.select(nationalitySelector, `${req.body.nationality}`);

        // current url
        await printCurrentUrl(page);

        console.log("Step 15 : filled nationality!");

        const locationSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.LOCATION_SELECT;
        await page.waitForSelector(locationSelector);
        await page.waitForFunction(() => document.getElementsByName("location")[0].options.length > 1 );
        await page.select(locationSelector, `${req.body.location}`);

        console.log("Step 16 : filled location!");

        const vehicleTypeSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.VEHICLE_TYPE_SELECT;
        await page.waitForSelector(vehicleTypeSelector);
        await page.waitForFunction(() => document.getElementsByName("vehicleType")[0].options.length > 1 );
        await page.select(vehicleTypeSelector, `${req.body.vehicleType}`);      // N - new, O - old

        // current url
        await printCurrentUrl(page);

        console.log("Step 17 : filled vehicleType!");

        const firstRegSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.FIRST_REG_DATE_SELECTOR;
        await page.waitForSelector(firstRegSelector);
        await page.type(firstRegSelector, `${req.body.registrationDate}`);

        console.log("Step 18 : filled registrationDate!");

        const ClaimsFreeSelector = constants.SCRAPPING[constants.INSURERS.ORIENTAL].SELECTORS.NO_CLAIM_SELECT;
        await page.waitForSelector(ClaimsFreeSelector);
        await page.waitForFunction(() => document.getElementsByName("ClaimsFreeDrivingYears")[0].options.length > 1 );
        await page.select(ClaimsFreeSelector, `${req.body.noClaimYear}`);

        // current url
        await printCurrentUrl(page);

        console.log("Step 19 : filled noClaimYear!");

        await page.mouse.click(500, 500);

        try {
            await page.waitForFunction(async () => document.querySelector('#kt_form .row')?.childNodes[1]?.childNodes[1]?.childNodes[0]?.childNodes[1]?.innerText, { timeout: 5000 });
        }
        catch(err) {
            await page.mouse.click(500, 500);
            await page.waitForFunction(async () => document.querySelector('#kt_form .row')?.childNodes[1]?.childNodes[1]?.childNodes[0]?.childNodes[1]?.innerText, { timeout: 5000 });
        }

        // current url
        await printCurrentUrl(page);

        console.log("Step 20 : got the rate!");
        
        const response = await page.evaluate(() => {

            console.log(`Final processing Url : ${document.URL}`);

            let elementsIdx = 0, lastCommentIdx = -1;
            
            // Temporary
            let premiumSectionElements = ["basicPremium", "includedAddons", "optionalAddons", "evg", "breakup"]
            let response = {
                basicPremium: 0,
                vat: 0,
                payableAmount: 0,
                addons: []
            }
            const formatPremiumTextToInteger = (text) => {
                text = text.replace("AED", "");
                text = text.replace(",", "");
                return parseInt(text);
            }

            // getting all child nodes of premium section
            const premiumSectionUiNodes = document.querySelector('#kt_form .row')?.childNodes[1]?.childNodes[1].childNodes;

            // processing element nodes to get premium and addons details.
            premiumSectionUiNodes.forEach((eUiNode, idx) => {
                // current node is comment
                if(eUiNode.nodeType == 8) {
                    // previous node was not comment: move to next element type
                    if(lastCommentIdx == -1 || lastCommentIdx < idx-1)
                        elementsIdx++;
                    lastCommentIdx = idx;
                    return;
                } else if(idx == 1) {
                    // skipping dummy divider after basicPremium
                    return;
                }

                // basic premium
                if(premiumSectionElements[elementsIdx] == "basicPremium") {
                    let basicPremiumText = eUiNode.lastChild.innerText;
                    response.basicPremium = formatPremiumTextToInteger(basicPremiumText);
                } else if(["includedAddons", "optionalAddons"].includes(premiumSectionElements[elementsIdx])) {
                    let addonText = eUiNode.firstChild.innerText;
                    let addonPrice = eUiNode.lastChild.innerText;
                    addonPrice = formatPremiumTextToInteger(addonPrice);
                    if(addonPrice == 0) {
                        // included addon
                        response.addons.push({
                            name: addonText,
                            premium: addonPrice,
                            is_available: true,
                            is_included: true
                        });
                    } else if(addonPrice > 0) {
                        // optional addon
                        response.addons.push({
                            name: addonText,
                            premium: addonPrice,
                            is_available: true,
                            is_included: false
                        });
                    }
                } else if(premiumSectionElements[elementsIdx] == "breakup") {
                    let nodeText = eUiNode.firstChild.innerText.toLowerCase();
                    
                    if(nodeText.includes("vat")) {
                        // vat node
                        let vatAmountText = eUiNode.lastChild.innerText;
                        response.vat = formatPremiumTextToInteger(vatAmountText);
                    } else if(nodeText.includes("grand total")) {
                        // grand total node
                        let grandTotalText = eUiNode.lastChild.innerText;
                        response.payableAmount = formatPremiumTextToInteger(grandTotalText);
                    }
                }
            });

            return response;
        });

        console.log("Step 21 : Final response is returned!");

        // if(pageCount == 1)
        //     browser.close();

        await page.close();
        
        // pageCount--;

        return response;
    }
    catch(error) {
        console.log("Oops! ended in catch!");
        console.log(error);
        printCurrentUrl(page);
        if(browser)
            browser.close();
        return res.status(501).json({
            message: "something went wrong!",
            error
        });
    }
}


module.exports = {
    scrapeRateUsingPupetter,
    loginFunc
}