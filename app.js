const puppeteer = require('puppeteer');
const options = require("./settings.json");

(async () => {
  const browser = await puppeteer.launch({executablePath:"/usr/bin/chromium-browser"});
  const page = await browser.newPage();
  page.setViewport({
    width:1920,
    height:1080,
    isLandscape:true
  })
  await page.goto('https://www.wg-gesucht.de/meine-anzeigen.html');
  console.log("Website geladen")
  await page.evaluate(() => {
    fireLoginOrRegisterModalRequest("sign_in");
  })

 await page.waitForFunction("document.querySelector('#login_modal') && document.querySelector('#login_modal').clientHeight != 0");

 console.log("Login Modal geöffnet")

  await page.evaluate(async() => {
      await new Promise(function(resolve) {
             setTimeout(resolve, 500)
      });
  });

  await page.evaluate((options) => {
    document.querySelector("#login_email_username").value =  options.email;
    document.querySelector("#login_password").value =  options.password;
  },options)

  await page.evaluate(async() => {
      await new Promise(function(resolve) {
             setTimeout(resolve, 500)
      });
  });

  await page.click('#login_submit');

  console.log("Eingeloggt")

  await page.waitForSelector(`.deactivated_ad_button[data-ad_id="${options.ids[0]}"]`);

  console.log("Button gefunden")

  await page.evaluate(async() => {
      await new Promise(function(resolve) {
             setTimeout(resolve, 500)
      });
  });


  for (id of options.ids) {
    await page.click(`.deaktivieren_${id}`);
    await page.evaluate(async() => {
        await new Promise(function(resolve) {
               setTimeout(resolve, 500)
        });
    });
  }
  console.log("Deaktiviert")

  for (id of options.ids) {
    await page.click(`.aktivieren_${id}`);
    await page.evaluate(async() => {
        await new Promise(function(resolve) {
               setTimeout(resolve, 500)
        });
    });
  }
  console.log("Aktiviert")

  await page.evaluate(async() => {
      await new Promise(function(resolve) {
             setTimeout(resolve, 10000)
      });
  });

  await browser.close();
})();
