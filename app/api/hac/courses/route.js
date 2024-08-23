// argument need by puppeteer.launch() when on server - { executablePath: '/usr/bin/chromium-browser', args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ] }

import puppeteer from "puppeteer";
import NodeRSA from "node-rsa";
import { demoData, demoTransData } from "./demoData";
const fs = require("fs");

export async function GET() {
  return Response.json({ success: false, error: "Invaild method" });
}

export async function POST(req, res) {
  const { token, options } = await req.json();

  const decrypter = new NodeRSA(process.env.PRIKEY);
  const [username, password] = decrypter.decrypt(token, "utf8").split(" % ");
  let data = {},
    periodNumber;
  if (username === "demo" && password === "Demo@8790") {
    if (options.onlyPeriod) {
      data = [...demoData[Number(options.periodNumber)].data];
      periodNumber = Number(options.periodNumber);
    } else if (options.onlyGPA) {
      data = {
        1: {
          data: demoData[1].data,
          periodNumber: 1,
          studentName: "Demo User",
        },
        2: {
          data: demoData[2].data,
          periodNumber: 2,
          studentName: "Demo User",
        },
      };
      periodNumber = 2;
      await new Promise((r) => setTimeout(r, 2000));
      return Response.json({
        success: true,
        data,
        studentName: "Demo User",
        periodNumber,
        transData: demoTransData,
      });
    } else {
      data = [...demoData[3].data];
      periodNumber = 3;
    }
    await new Promise((r) => setTimeout(r, 2000));
    return Response.json({
      success: true,
      data,
      studentName: "Demo User",
      periodNumber,
    });
  }

  let storeData;
  let studentName;
  const url = "https://hac.friscoisd.org/homeaccess/";
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64)" +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36"
    );
    await page.goto(url);
    await page.evaluate(
      (username, password) => {
        document.querySelector("#LogOnDetails_UserName").value = username;
        document.querySelector("#LogOnDetails_Password").value = password;
      },
      username,
      password
    );
    await page.click(".sg-submit-button");
    await page.waitForSelector(
      ".sg-banner-menu-element.sg-menu-element-identity",
      { timeout: 5000 }
    );
    studentName = await page.evaluate(() => {
      return document
        .querySelector(".sg-banner-menu-element.sg-menu-element-identity")
        .querySelector("span").textContent;
    });

    await page.goto(
      "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx"
    );
  } catch (e) {
    if (
      await page.evaluate(() => {
        try {
          return document.querySelector(".validation-summary-errors").outerHTML;
        } catch {
          return undefined;
        }
      })
    ) {
      return Response.json({ success: false, wrongPas: true });
    } else {
      console.log(e);
    }
    return Response.json({ success: false, wrongPas: false });
  } finally {
    await page.goto("https://hac.friscoisd.org/HomeAccess/Account/Logoff");
    await page.waitForSelector(".caption");
    await browser.close();
  }
}
