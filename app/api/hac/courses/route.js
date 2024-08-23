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
}
