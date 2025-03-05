import * as cheerio from "cheerio";
import getRequestSession from "../helpers/getsession";
import getCouseWeight from "../helpers/getCouseWeight";
import demoAcc from "./demoAcc";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const password = searchParams.get("password");
    const mp = searchParams.get("mp");

    if (!username || !password || !mp) {
      return new Response(
        JSON.stringify({
          error: "Missing username, password, or Marking Period",
        }),
        { status: 400 }
      );
    }

    if (!(Number.isInteger(Number(mp)) && Number(mp) > 0 && Number(mp) < 5)) {
      return new Response(
        JSON.stringify({
          error: "Marking Period is invalid",
        }),
        { status: 400 }
      );
    }

    if (username == "demo" && password == "demo") {
      return new Response(JSON.stringify(demoAcc), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Function to simulate getRequestSession (you need to implement this)
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

    const assignmentsPageResponse = await session.get(
      "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx"
    );
    const assignmentsPageContent = assignmentsPageResponse.data;
    const $assignmentsPage = cheerio.load(assignmentsPageContent);

    const viewState = $assignmentsPage("#__VIEWSTATE").val();
    const viewStateGenerator = $assignmentsPage("#__VIEWSTATEGENERATOR").val();
    const eventValidation = $assignmentsPage("#__EVENTVALIDATION").val();

    const otherCoursesPayload = new URLSearchParams({
      __EVENTTARGET: "ctl00$plnMain$btnRefreshView",
      __EVENTARGUMENT: "",
      __VIEWSTATE: viewState, // Dynamically extracted
      __VIEWSTATEGENERATOR: viewStateGenerator, // Dynamically extracted
      __EVENTVALIDATION: eventValidation, // Dynamically extracted
      ctl00$plnMain$hdnValidMHACLicense: "Y",
      ctl00$plnMain$hdnIsVisibleClsWrk: "N",
      ctl00$plnMain$hdnIsVisibleCrsAvg: "N",
      ctl00$plnMain$hdnIsVisibleOverdue: "N",
      ctl00$plnMain$hdnJsAlert:
        "Averages cannot be displayed when  Report Card Run is set to (All Runs).",
      ctl00$plnMain$ddlReportCardRuns: `${mp}-2025`,
      ctl00$plnMain$ddlClasses: "ALL",
      ctl00$plnMain$ddlCompetencies: "ALL",
      ctl00$plnMain$ddlOrderBy: "Class",
    }).toString();

    // Fetch the page content
    const response = await session.post(
      "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx",
      otherCoursesPayload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "https://hac.friscoisd.org",
          Referer:
            "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx",
        },
        responseType: "text",
      }
    );

    const coursesPageContent = response.data;

    // Sample coursesPageContent
    // Parse the HTML using cheerio
    const $ = cheerio.load(coursesPageContent);

    // Initialize the result JSON object
    let courses = [];

    // Function to parse each class and its assignments
    function parseClass(index, element) {
      const newCourse = {
        name: "",
        grade: "",
        lastUpdated: "",
        assignments: [],
      };

      // Load the container for each course
      const courseContainer = $(element);

      // Extract class name, last updated, and grade
      const headerContainer = courseContainer.find(
        ".sg-header.sg-header-square"
      );

      newCourse.name = headerContainer
        .find("a.sg-header-heading")
        .text()
        .trim();

      newCourse.lastUpdated = headerContainer
        .find("span.sg-header-sub-heading")
        .text()
        .replace("(Last Updated: ", "")
        .replace(")", "")
        .trim();

      const gradeText = headerContainer
        .find("span.sg-header-heading.sg-right")
        .text()
        .trim();
      newCourse.grade = gradeText
        .replace("Student Grades ", "")
        .replace("%", "")
        .trim();

      // Extract assignments for the course
      const assignmentRows = courseContainer.find(
        ".sg-content-grid tr.sg-asp-table-data-row"
      );

      assignmentRows.each((i, row) => {
        const tds = $(row).find("td");
        const assignment = {
          name: $(tds[2]).find("a").text().trim(),
          category: $(tds[3]).text().trim(),
          dateAssigned: $(tds[1]).text().trim(),
          dateDue: $(tds[0]).text().trim(),
          score: $(tds[4]).text().trim(),
          totalPoints: $(tds[5]).text().trim(),
        };

        newCourse.assignments.push(assignment);
      });

      courses.push(newCourse);
    }

    // Iterate over each class container and parse its details
    $(".AssignmentClass").each(parseClass);
    // ------Formating the courses and adding weights------
    for (let i = 0; i < courses.length; i++) {
      courses[i].grade = Number(courses[i].grade);
      for (let w = 0; w < courses[i].assignments.length; w++) {
        if (
          (Number(courses[i].assignments[w].score) ||
            Number(courses[i].assignments[w].score) == 0) &&
          courses[i].assignments[w].score !== ""
        ) {
          courses[i].assignments[w].score = String(
            Number(courses[i].assignments[w].score)
          );
        }
        if (
          (Number(courses[i].assignments[w].totalPoints) ||
            Number(courses[i].assignments[w].totalPoints) == 0) &&
          courses[i].assignments[w].totalPoints !== ""
        ) {
          courses[i].assignments[w].totalPoints = String(
            Number(courses[i].assignments[w].totalPoints)
          );
        }
      }

      // removing the averages of AOLs and PGs
      const tempAssignments = [];
      for (let nm = 0; nm < courses[i].assignments.length; nm++) {
        if (!(courses[i].assignments[nm]["name"] === "")) {
          tempAssignments.push(courses[i].assignments[nm]);
        }
      }
      courses[i].assignments = tempAssignments;
      // --------------------------------------

      let [courseCode, courseName] = courses[i].name.split(" - ");
      courseName = courseName.slice(1, courseName.length).trim();
      courseCode = courseCode.substring(0, 8);
      courses[i].name = courseName;
      courses[i]["code"] = courseCode;
      let apply = false;
      for (let w = 0; w < courses[i].assignments.length; w++) {
        if (
          courses[i].assignments[w].category == "Assessment of Learning" &&
          Number(courses[i].assignments[w].score)
        ) {
          apply = true;
        }
      }
      if (apply) {
        if (getCouseWeight(courseCode)) {
          courses[i]["weights"] = getCouseWeight(courseCode);
        } else {
          courses[i]["weights"] = {
            weight: 5.0,
            multiplier: 1,
          };
        }
      } else {
        courses[i]["weights"] = {
          weight: 0,
        };
      }
    }
    // --------------------------------
    return new Response(
      JSON.stringify({ otherClasses: courses, periodNumber: Number(mp) }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
