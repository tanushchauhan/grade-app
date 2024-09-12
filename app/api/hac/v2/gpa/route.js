import { load } from "cheerio";
import getRequestSession from "../helpers/getsession";

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
    const transcriptPageResponse = await session.get(
      "https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx"
    );

    // Parse the transcript page content
    const $ = load(transcriptPageResponse.data);

    // Extract GPA and rank
    const weightedGpa = $("#plnMain_rpTranscriptGroup_lblGPACum1").text();
    const unweightedGpa = $("#plnMain_rpTranscriptGroup_lblGPACum2").text();
    let rank = null;

    try {
      rank = $("#plnMain_rpTranscriptGroup_lblGPARank1").text();
    } catch (err) {
      console.error("Rank not found:", err);
    }

    // Return the extracted data as JSON response
    return new Response(
      JSON.stringify({
        weightedGPA: weightedGpa,
        unweightedGPA: unweightedGpa,
        rank: rank || "N/A",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to fetch transcript data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch transcript data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
