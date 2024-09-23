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
    const transcriptPageResponse = await session.get(
      "https://hac.friscoisd.org/HomeAccess/Content/Student/Registration.aspx"
    );

    // Parse the transcript page content
    const $ = load(transcriptPageResponse.data);

    const studentName = $("#plnMain_lblRegStudentName").text();
    const studentBirthdate = $("#plnMain_lblBirthDate").text();
    const studentCounselor = $("#plnMain_lblCounselor").text();
    const studentCampus = $("#plnMain_lblBuildingName").text();
    const studentGrade = $("#plnMain_lblGrade").text();
    let studentId;

    // Try to get the student id
    studentId = $("#plnMain_lblRegStudentID").text();

    if (!studentId) {
      // If studentId is not found, fetch the schedule page
      const schedulePageResponse = await session.get(
        "https://hac.friscoisd.org/HomeAccess/Content/Student/Classes.aspx"
      );
      const $ = cheerio.load(schedulePageResponse.data);
      studentId = $("#plnMain_lblRegStudentID").text();
    }

    return new Response(
      JSON.stringify({
        id: studentId,
        name: studentName,
        birthdate: studentBirthdate,
        campus: studentCampus,
        grade: studentGrade,
        counselor: studentCounselor,
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
