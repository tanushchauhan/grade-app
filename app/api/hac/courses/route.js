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

    if (options.onlyPeriod) {
      await page.evaluate(
        (periodNumber) =>
          (document.getElementById("plnMain_ddlReportCardRuns").selectedIndex =
            periodNumber),
        options.periodNumber
      );
      await Promise.all([
        page.click("#plnMain_btnRefreshView"),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
      periodNumber = await page.evaluate(
        () =>
          document
            .querySelector("#combobox_plnMain_ddlReportCardRuns")
            .querySelector(".sg-combobox-input.ui-autocomplete-input").value
      );
      data = await page.evaluate(() => {
        const list = document.querySelectorAll(".AssignmentClass");
        let returnVal = [];
        let courseName, studentGrade;
        for (let i = 0; i < list.length; i++) {
          courseName = list[i]
            .querySelector(".sg-header-heading")
            .textContent.trim()
            .substring(17);
          courseName = courseName.substring(0, courseName.length - 3);
          courseCode = list[i]
            .querySelector(".sg-header-heading")
            .textContent.trim()
            .substring(0, 8);
          studentGrade = list[i]
            .querySelector(".sg-header-heading.sg-right")
            .textContent.trim()
            .substring(15);
          let assignmentData,
            noWeight = false;
          try {
            studentGrade = studentGrade.substring(0, studentGrade.length - 1);
            studentGrade = Number(studentGrade);
            const oTable = list[i].querySelector(".sg-asp-table");

            assignmentData = [...oTable.rows].map((t) =>
              [...t.children].map((u) => u.innerText)
            );
            noWeight = true;

            for (let op = 1; op < assignmentData.length; op++) {
              if (
                assignmentData[op][3] === "Assessment of Learning" &&
                assignmentData[op][4] !== ""
              ) {
                noWeight = false;
              }
            }
          } catch {
            studentGrade = 0.0;
            assignmentData = {};
            noWeight = true;
          } finally {
            returnVal.push({
              courseCode,
              courseName,
              studentGrade,
              assignmentData,
              noWeight,
            });
          }
        }
        return returnVal;
      });

      for (let u = 0; u < data.length; u++) {
        let theW;
        if (!classes[data[u].courseCode]) {
          theW = {
            weight: 5.0,
            multiplier: 1,
          };
        } else {
          theW = classes[data[u].courseCode];
        }
        if (data[u].noWeight) {
          data[u]["weightDetails"] = {
            ...theW,
            weight: 0,
          };
        } else {
          data[u]["weightDetails"] = theW;
        }
      }
    } else if (options.onlyGPA) {
      for (let i = 1; i < options.limGPA; i++) {
        await page.evaluate(
          (periodNumber) =>
            (document.getElementById(
              "plnMain_ddlReportCardRuns"
            ).selectedIndex = periodNumber),
          i
        );
        await Promise.all([
          page.click("#plnMain_btnRefreshView"),
          page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);
        periodNumber = await page.evaluate(
          () =>
            document
              .querySelector("#combobox_plnMain_ddlReportCardRuns")
              .querySelector(".sg-combobox-input.ui-autocomplete-input").value
        );
        storeData = await page.evaluate(() => {
          const list = document.querySelectorAll(".AssignmentClass");
          let returnVal = [];
          let courseName, studentGrade;
          for (let i = 0; i < list.length; i++) {
            courseName = list[i]
              .querySelector(".sg-header-heading")
              .textContent.trim()
              .substring(17);
            courseName = courseName.substring(0, courseName.length - 3);
            courseCode = list[i]
              .querySelector(".sg-header-heading")
              .textContent.trim()
              .substring(0, 8);
            studentGrade = list[i]
              .querySelector(".sg-header-heading.sg-right")
              .textContent.trim()
              .substring(15);
            let noWeight = false, // this does not make any sense, if you are trying to block this from counting send it to server from peppeteer
              assignmentData;
            try {
              studentGrade = studentGrade.substring(0, studentGrade.length - 1);
              studentGrade = Number(studentGrade);
              const oTable = list[i].querySelector(".sg-asp-table");
              assignmentData = [...oTable.rows].map((t) =>
                [...t.children].map((u) => u.innerText)
              );
              noWeight = true;

              for (let op = 1; op < assignmentData.length; op++) {
                if (
                  assignmentData[op][3] === "Assessment of Learning" &&
                  assignmentData[op][4] !== ""
                ) {
                  noWeight = false;
                }
              }
            } catch {
              studentGrade = 0;
              assignmentData = {};
              noWeight = true;
            } finally {
              returnVal.push({
                courseCode,
                courseName,
                studentGrade,
                assignmentData,
                noWeight, //added noweight to be transfered
              });
            }
          }
          return returnVal;
        });

        for (let u = 0; u < storeData.length; u++) {
          let theW;
          if (!classes[storeData[u].courseCode]) {
            theW = {
              weight: 5.0,
              multiplier: 1,
            };
          } else {
            theW = classes[storeData[u].courseCode];
          }
          if (storeData[u].noWeight) {
            storeData[u]["weightDetails"] = {
              ...theW,
              weight: 0,
            };
          } else {
            storeData[u]["weightDetails"] = theW;
          }
        }

        data[periodNumber] = {
          periodNumber: String(i),
          studentName,
          data: storeData,
        };
      }
      await page.goto(
        "https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx"
      );
      await page.waitForSelector(".sg-transcript-group");
      let transData = await page.evaluate(() => {
        const x = document.querySelectorAll(".sg-transcript-group");
        let y = {};
        for (let i = 0; i < x.length; i++) {
          const oTable = x[i].querySelector("table");
          let transPerGradeData = [...oTable.rows].map((t) =>
            [...t.children].map((u) => u.innerText)
          );

          const oTable2 = x[i].querySelector(".sg-asp-table");
          let transPerGradeData2 = [...oTable2.rows].map((t) =>
            [...t.children].map((u) => u.innerText)
          );

          y[`${i + 1}`] = { transPerGradeData, transPerGradeData2 };
        }

        const oTable = document.querySelector(
          "#plnMain_rpTranscriptGroup_tblCumGPAInfo"
        );

        let transPerRankData = [...oTable.rows].map((t) =>
          [...t.children].map((u) => u.innerText)
        );
        y = { ...y, transPerRankData };
        return y;
      });

      return Response.json({
        success: true,
        data,
        transData,
        studentName,
        periodNumber,
      });
    }
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
