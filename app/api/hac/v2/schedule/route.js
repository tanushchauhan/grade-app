import { load } from "cheerio";
import getRequestSession from "../helpers/getsession";
import demoAcc from "./demoAcc";

export async function GET(req) {
  // Extract the query parameters from the request URL
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const password = searchParams.get("password");

  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: "Missing username or password" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (username == "demo" && password == "demo") {
    return new Response(JSON.stringify(demoAcc), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get the session using the helper function
    const session = await getRequestSession(username, password);

    if (session == "pass error") {
      return new Response(
        JSON.stringify({ error: "Incorrect username or password" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch the transcript page
    const response = await session.get(
      "https://hac.friscoisd.org/HomeAccess/Content/Student/Classes.aspx"
    );

    // Parse the transcript page content
    const $ = load(response.data);

    const schedule = [];

    // Find and process courses
    $("tr.sg-asp-table-data-row").each((i, row) => {
      const tds = $(row)
        .find("td")
        .map((_, td) => $(td).text().trim())
        .get();

      if (tds.length > 3) {
        schedule.push({
          building: tds[7],
          courseCode: tds[0],
          courseName: tds[1],
          days: tds[5],
          markingPeriods: tds[6],
          periods: tds[2],
          room: tds[4],
          status: tds[8],
          teacher: tds[3],
        });
      }
    });

    // Return the response
    return new Response(JSON.stringify({ schedule }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to fetch transcript data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch transcript data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
