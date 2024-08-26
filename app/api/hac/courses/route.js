// argument need by puppeteer.launch() when on server - { executablePath: '/usr/bin/chromium-browser', args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ] }

import puppeteer from "puppeteer";
import NodeRSA from "node-rsa";
import { demoData, demoTransData } from "./demoData";
const fs = require("fs");

const classes = {
  CATE00210: {
    name: "Survey of Agriculture Food & Natural Resources",
    weight: 5.0,
    multiplier: 1,
  },
  CATE00310: {
    name: "Livestock Production",
    weight: 5.0,
    multiplier: 1,
  },
  CATE00400: {
    name: "Small Animal Management",
    weight: 5.0,
    multiplier: 1,
  },
  CATE00415: {
    name: "Small Animal Management@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE00500: {
    name: "Equine Science",
    weight: 5.0,
    multiplier: 1,
  },
  CATE00600: {
    name: "Veterinary Medical Applications@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE00700: {
    name: "Animal Science@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE00810: {
    name: "Plant Soil Science@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE01510: {
    name: "Wildlife, Fisheries, & Ecology Management",
    weight: 5.0,
    multiplier: 1,
  },
  CATE01800: {
    name: "Floral Design 1",
    weight: 5.0,
    multiplier: 1,
  },
  CATE01900: {
    name: "Landscape Design & Management@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE02010: {
    name: "Horticulture Science@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE02200: {
    name: "Agricultural Mechanics, & Metal Technologies",
    weight: 5.0,
    multiplier: 1,
  },
  CATE02350: {
    name: "Agricultural Structrures Design & Fabrications",
    weight: 5.0,
    multiplier: 1,
  },
  CATE02500: {
    name: "Practicum in Agricultural Structures & Equipment@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE02503: {
    name: "Practicum in Veterinary Medical Applications@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE02505: {
    name: "Floral Design 2@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE02600: {
    name: "Greenhouse Operation & Production@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE02700: {
    name: "Agricultural Equipment Design & Fabrication@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE02803: {
    name: "Internetworking I (CISCO 1)@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE02900: {
    name: "Cybersecurity@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE03742: {
    name: "PLTW Intro to Engineering Design@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE03743: {
    name: "PLTW Principles of Engineering@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE03744: {
    name: "PLTW Digital Electronics@CTEC",
    weight: 5.5,
    multiplier: 1,
  },
  CATE03745: {
    name: "PLTW Aerospace Engineering@CTEC",
    weight: 5.5,
    multiplier: 1,
  },
  CATE03747: {
    name: "PLTW Civil Engineering & Architecture@CTEC",
    weight: 5.5,
    multiplier: 1,
  },
  CATE03749: {
    name: "PLTW Engineering Design and Development@CTEC",
    weight: 5.5,
    multiplier: 1,
  },
  CATE03755: {
    name: "Engineering Design and Development Plus @ CTEC",
    weight: 5.5,
    multiplier: 2,
  },
  CATE04210: {
    name: "Architecture & Construction I@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE04300: {
    name: "Interior Design I",
    weight: 5.0,
    multiplier: 1,
  },
  CATE04600: {
    name: "Architectural Design I@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE04710: {
    name: "Architectural Design II@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE08360: {
    name: "Animation I@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE08450: {
    name: "Practicum in Animation@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE08460: {
    name: "Animation II@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE08500: {
    name: "Audio/Video Production I",
    weight: 5.0,
    multiplier: 1,
  },
  CATE08600: {
    name: "Audio/Video Production II",
    weight: 5.0,
    multiplier: 1,
  },
  CATE08860: {
    name: "Graphic Design & Illustration I@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE08960: {
    name: "Graphic Design & Illustration II@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE09000: {
    name: "Practicum in Graphic Design & Illustration@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE09300: {
    name: "Fashion Design I",
    weight: 5.0,
    multiplier: 1,
  },
  CATE09400: {
    name: "Fashion Design II",
    weight: 5.0,
    multiplier: 1,
  },
  CATE11210: {
    name: "Survey of Business, Marketing and Finance",
    weight: 5.0,
    multiplier: 1,
  },
  CATE11300: {
    name: "Touch System Data Entry",
    weight: 5.0,
    multiplier: 1,
  },
  CATE11400: {
    name: "Business Information Management I",
    weight: 5.0,
    multiplier: 1,
  },
  CATE11500: {
    name: "Business Information Management II@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE11710: {
    name: "Business Law",
    weight: 5.0,
    multiplier: 1,
  },
  CATE11800: {
    name: "Global Business",
    weight: 5.0,
    multiplier: 1,
  },
  CATE14215: {
    name: "Survey of Education & Training",
    weight: 5.0,
    multiplier: 1,
  },
  CATE14400: {
    name: "Education & Training@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE14500: {
    name: "Practicum in Education and Training@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE15100: {
    name: "Esports I",
    weight: 5.0,
    multiplier: 1,
  },
  CATE15200: {
    name: "Esports II",
    weight: 5.0,
    multiplier: 1,
  },
  CATE15300: {
    name: "Esports III@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE16210: {
    name: "Money Matters Yr@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE16300: {
    name: "Banking & Financial Services",
    weight: 5.0,
    multiplier: 1,
  },
  CATE16410: {
    name: "Securities & Investment@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE16600: {
    name: "Accounting I",
    weight: 5.0,
    multiplier: 1,
  },
  CATE16700: {
    name: "Accounting II",
    weight: 5.0,
    multiplier: 1,
  },
  CATE18210: {
    name: "Survey of Government & Public Administration@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE18300: {
    name: "Political Science@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE18320: {
    name: "Competitive Trial Advocacy@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE18350: {
    name: "Mock Trial Yr@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE18400: {
    name: "Practium in Government@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE18500: {
    name: "Foreign Services and Diplomacy@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE20200: {
    name: "Health Science",
    weight: 5.0,
    multiplier: 1,
  },
  CATE20310: {
    name: "Medical Terminology",
    weight: 5.0,
    multiplier: 1,
  },
  CATE21000: {
    name: "Future Ready Health Care@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE22300: {
    name: "Hotel Management Yr@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE22410: {
    name: "Survey of Hospitality & Tourism",
    weight: 5.0,
    multiplier: 1,
  },
  CATE22510: {
    name: "Travel & Tourism Management",
    weight: 5.0,
    multiplier: 1,
  },
  CATE22600: {
    name: "Culinary Arts I@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE22610: {
    name: "Culinary Arts II@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE22810: {
    name: "Hospitality Services@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE22900: {
    name: "Practicum in Hospitatliy Services@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE23000: {
    name: "Food Science",
    weight: 5.0,
    multiplier: 1,
  },
  CATE24300: {
    name: "Dollars & Sense",
    weight: 5.0,
    multiplier: 1,
  },
  CATE24400: {
    name: "Interpersonal Studies",
    weight: 5.0,
    multiplier: 1,
  },
  CATE24500: {
    name: "Introduction to Culinary Arts",
    weight: 5.0,
    multiplier: 1,
  },
  CATE24710: {
    name: "Child Development Yr",
    weight: 5.0,
    multiplier: 1,
  },
  CATE24800: {
    name: "Child Guidance Yr@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE25001: {
    name: "Practicum in Child Guidance@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE27200: {
    name: "Survey of Information Technology",
    weight: 5.0,
    multiplier: 1,
  },
  CATE27300: {
    name: "Computer Maintenance",
    weight: 5.0,
    multiplier: 1,
  },
  CATE27600: {
    name: "Mobile App Programming Yr@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE27700: {
    name: "Video Game Programming I@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE27800: {
    name: "Digital Media",
    weight: 5.0,
    multiplier: 1,
  },
  CATE27900: {
    name: "Web Design Yr@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE28700: {
    name: "Video Game Programming II@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE28800: {
    name: "Video Game Programming III@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE29210: {
    name: "Survey of Law, Public Safety, Corrections & Security",
    weight: 5.0,
    multiplier: 1,
  },
  CATE29300: {
    name: "Law Enforcement I@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE29350: {
    name: "Law Enforcement II@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE29500: {
    name: "Forensic Science Yr@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE29600: {
    name: "Court Systems and Practices@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE34100: {
    name: "Social Media Marketing",
    weight: 5.0,
    multiplier: 1,
  },
  CATE34250: {
    name: "Advertising",
    weight: 5.0,
    multiplier: 1,
  },
  CATE34310: {
    name: "Fashion Marketing",
    weight: 5.0,
    multiplier: 1,
  },
  CATE34400: {
    name: "Entrepreneurship",
    weight: 5.0,
    multiplier: 1,
  },
  CATE34450: {
    name: "ACCELeratoredu",
    weight: 5.0,
    multiplier: 1,
  },
  CATE34610: {
    name: "Sports & Entertainment Marketing",
    weight: 5.0,
    multiplier: 1,
  },
  CATE34710: {
    name: "Practicum in Marketing II",
    weight: 5.0,
    multiplier: 2,
  },
  CATE34711: {
    name: "Practicum in Marketing I",
    weight: 5.0,
    multiplier: 2,
  },
  CATE34750: {
    name: "Sports Management @WHS",
    weight: 5.0,
    multiplier: 2,
  },
  CATE35100: {
    name: "Practicum in Sports Broadcasting I@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE35200: {
    name: "Practicum in Sports Broadcasting II@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CATE36100: {
    name: "Architecture & Construction II@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE36200: {
    name: "Introduction to Welding@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  CATE36300: {
    name: "Practicum in News Production I",
    weight: 5.0,
    multiplier: 2,
  },
  CATE36400: {
    name: "Practicum in News Production II",
    weight: 5.0,
    multiplier: 2,
  },
  CATE36600: {
    name: "Practicum in Information Technology@CTEC",
    weight: 5.0,
    multiplier: 2,
  },
  CMR00110: {
    name: "Naval Science 1",
    weight: 5.0,
    multiplier: 1,
  },
  CMR00120: {
    name: "Naval Science 2",
    weight: 5.0,
    multiplier: 1,
  },
  CMR00130: {
    name: "Naval Science 3",
    weight: 5.0,
    multiplier: 1,
  },
  CMR00140: {
    name: "Naval Science 4",
    weight: 5.0,
    multiplier: 1,
  },
  COL02820: {
    name: "Internetworking II (CISCO 2-3)",
    weight: 5.5,
    multiplier: 1,
  },
  COL04000: {
    name: "Health Science Clinical",
    weight: 5.0,
    multiplier: 2,
  },
  COL04100: {
    name: "Practicum in Health Science",
    weight: 5.0,
    multiplier: 2,
  },
  COL04200: {
    name: "Rehabilitation Aide",
    weight: 5.0,
    multiplier: 2,
  },
  COL04300: {
    name: "Medical Scribe",
    weight: 5.0,
    multiplier: 2,
  },
  COL04570: {
    name: "Pharmacy Technician",
    weight: 5.0,
    multiplier: 2,
  },
  COL36600: {
    name: "Emergency Medical Technician@CC",
    weight: 5.0,
    multiplier: 2,
  },
  COL36700: {
    name: "Baking Pastry S1@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  COL36701: {
    name: "Baking Pastry LC S1@CTEC",
    weight: 5.0,
    multiplier: 1,
  },
  COLM0200: {
    name: "Collin Dual Credit English 3",
    weight: 5.5,
    multiplier: 1,
  },
  COLM0210: {
    name: "Collin Dual Credit Literature for Seniors",
    weight: 5.5,
    multiplier: 1,
  },
  COLM0220: {
    name: "Collin Dual Credit Composition for Seniors",
    weight: 5.5,
    multiplier: 1,
  },
  COLM0300: {
    name: "Collin Dual Credit Art Appreciation",
    weight: 5.5,
    multiplier: 1,
  },
  COLM0410: {
    name: "Collin Dual Credit Statistics",
    weight: 5.5,
    multiplier: 1,
  },
  COLM0420: {
    name: "Collin Dual Credit College Algebra",
    weight: 5.5,
    multiplier: 1,
  },
};

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
    } else {
      fs.appendFileSync(
        ".logs/log.txt",
        `${username} logged in - ${studentName}\n`
      );

      await page.waitForSelector(".AssignmentClass");
      periodNumber = await page.evaluate(
        () =>
          document
            .querySelector("#combobox_plnMain_ddlReportCardRuns")
            .querySelector(".sg-combobox-input.ui-autocomplete-input").value
      );
      data = await page.evaluate(() => {
        const list = document.querySelectorAll(".AssignmentClass");
        let returnVal = [];
        let courseName, studentGrade, courseCode;
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
          studentGrade = studentGrade.substring(0, studentGrade.length - 1);
          studentGrade = Number(studentGrade);
          const oTable = list[i].querySelector(".sg-asp-table");
          //rows becomes undefined when the marking period has nothing.
          let assignmentData,
            noWeight = false;
          try {
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
    }
    return Response.json({
      success: true,
      data,
      studentName,
      periodNumber,
    });
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
