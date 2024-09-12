import * as cheerio from "cheerio";
import getRequestSession from "../helpers/getsession";
import getCouseWeight from "../helpers/getCouseWeight";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const password = searchParams.get("password");

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Missing username or password" }),
        { status: 400 }
      );
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

    // Fetch the page content
    const response = await session.get(
      "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx"
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
      if (courses[i].assignments.length !== 0) {
        courses[i].assignments.splice(courses[i].assignments.length - 2);
      }
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
    return new Response(JSON.stringify({ classes: courses }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
