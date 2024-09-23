import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";
import qs from "querystring";

async function getRequestSession(username, password) {
  const jar = new CookieJar();
  const session = wrapper(axios.create({ jar }));

  try {
    // Fetch the login page
    const loginScreenResponse = await session.get(
      "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fhomeaccess"
    );

    // Load the HTML with cheerio
    let $ = cheerio.load(loginScreenResponse.data);

    // Extract the request verification token
    const requestVerificationToken = $(
      'input[name="__RequestVerificationToken"]'
    ).val();

    // Set up the request headers
    const requestHeaders = {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      priority: "u=0, i",
      "sec-ch-ua":
        '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      Referer:
        "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fhomeaccess",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    };

    // Set up the request payload
    const requestPayload = {
      __RequestVerificationToken: requestVerificationToken,
      SCKTY00328510CustomEnabled: "False",
      SCKTY00436568CustomEnabled: "False",
      Database: "10",
      VerificationOption: "UsernamePassword",
      "LogOnDetails.UserName": username,
      tempUN: "",
      tempPW: "",
      "LogOnDetails.Password": password,
    };

    // Send the POST request to log in
    const l = await session.post(
      "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fhomeaccess",
      qs.stringify(requestPayload), // Convert payload to x-www-form-urlencoded
      { headers: requestHeaders }
    );

    $ = cheerio.load(l.data);

    const errorText = "Your attempt to log in was unsuccessful.";
    const bodyText = $("body").text(); // Get all the text from the body

    if (bodyText.includes(errorText)) {
      return "pass error";
    }

    return session;
  } catch (error) {
    console.error("Error during the request:", error.message);
    console.error("Response data:", error.response?.data);
    throw new Error("Failed to fetch session");
  }
}

export default getRequestSession;
