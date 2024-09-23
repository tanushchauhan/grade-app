import * as cheerio from "cheerio";
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
    const transcriptPageResponse = await session.get(
      "https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx"
    );

    // Parse the transcript page content
    const $ = cheerio.load(transcriptPageResponse.data);

    const transcriptGroups = $("td.sg-transcript-group");

    const transcriptDetails = [];
    transcriptGroups.each((index, transcriptGroup) => {
      const transcriptHtml = `<html><body>${$(
        transcriptGroup
      ).html()}</body></html>`;
      const inner$ = cheerio.load(transcriptHtml);

      const headerTable = inner$("table").eq(0);
      const coursesTable = inner$("table").eq(1);
      const totalCreditsTable = inner$("table").eq(2);

      const yearsAttended = headerTable
        .find(`#plnMain_rpTranscriptGroup_lblYearValue_${index}`)
        .text()
        .trim();
      const gradeLevel = headerTable
        .find(`#plnMain_rpTranscriptGroup_lblGradeValue_${index}`)
        .text()
        .trim();
      const building = headerTable
        .find(`#plnMain_rpTranscriptGroup_lblBuildingValue_${index}`)
        .text()
        .trim();

      const courseRows = coursesTable.find("tr.sg-asp-table-data-row");

      const courseDetails = [];
      courseRows.each((_, courseRow) => {
        const courseInfo = $(courseRow).find("td");

        const courseCode = courseInfo.eq(0).text().trim();
        const courseName = courseInfo.eq(1).text().trim();
        const sem1Grade = courseInfo.eq(2).text().trim();
        const sem2Grade = courseInfo.eq(3).text().trim();
        const finalGrade = courseInfo.eq(4).text().trim();
        const courseCredits = courseInfo.eq(5).text().trim();
        const shouldAdd =
          courseCode.substring(0, 2) !== "EA" &&
          (Number(sem1Grade) || Number(sem2Grade))
            ? true
            : false;
        courseDetails.push({
          courseCode,
          courseName,
          sem1Grade,
          sem2Grade,
          finalGrade,
          courseCredits,
          shouldAdd,
        });
      });

      const totalCredits = totalCreditsTable
        .find(`#plnMain_rpTranscriptGroup_LblTCreditValue_${index}`)
        .text();

      transcriptDetails.push({
        yearsAttended,
        gradeLevel,
        building,
        totalCredits,
        courses: courseDetails,
      });
    });

    return new Response(JSON.stringify({ transcript: transcriptDetails }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch transcript data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch transcript data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
