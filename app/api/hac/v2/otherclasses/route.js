import * as cheerio from "cheerio";
import getRequestSession from "../helpers/getsession";

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

    const otherCoursesPayload = `__EVENTTARGET=ctl00%24plnMain%24btnRefreshView&__EVENTARGUMENT=&__VIEWSTATE=3KsXoH2rdR4nKQqtmPo25Wx6lQHydHjbv1TTTmlLJdqLxHyXN9MkmN2msWeJuUQuAbyMoJGkcq0GfESDQeY5jV0U%2BjqbfJPA45pPmzO6x%2BTHM5fYdegj2z%2FqyLBAr0QTiCEkPZTax5PtwUpjVsCSBSF2FzEy2wcql%2FB4Xn2dncYr%2BpD9ttGLL6S2i4httpDmaYpcLAAmwyI%2BxskY7uFvGosOb1BGn%2B0NXxBzqC95WUujRCsQHu899clpbYtFuqQ%2BCvjGeZ9LmwrfRRdDnNPFSAr63mcDaQhZbUTdgBe3T2xVpalrtA9dPc6hXYHvgYJ4Empqf7W1nFXZKH%2B3lTl4eHoL1jkDvj9NaQNYqtXNZnsZkg3MLT8Zc9%2Bnw3T0Sljj4uJ5IlhW5RKieDc321YS1WggCvLb2F77eINMVmChFWJSsRpiENHGwNgSKCqTsHUtYjWJH4EVS4Pp3q0Gy8lUqdZwLK%2FWjtMUY1gLwA4XEnCtLbRobm%2Fcu5aZWenDptWtNoZTkwZ9mj%2FxHc%2F5fAgbVIrh68%2FxAfKwtD3rd57vsM5NGLcaLz3jHDvGnm%2B2C%2FvStlTWM9AARENbCv8ji%2Bd2f0Xm2Gcpdu7Di1rxFFMQI6NodVUbodklknRGzWPSERQzrsPTR6wAzBMmwhiB2Zv%2BAMrQsOCDH4iMaec6qeUfQgOcarxJXc1SvP4yxRZmlEO63Orddlee4AbtpBgIMbwzSz7KKspdVpNSwhiY8IsZyLp3byKN8FHL7d6NQnn%2FSDxDzTRnA3OO8LINDGnuJnXmPsaFwNR4iLsNcHWFV%2BUcDZfmvDTI%2B8zpQQxNPo6wtT0LJl1N9MDyY2ygJoRhKdXFpr0LMK3vPaYxmdbKet%2Fxi0SqY2V5Va63x1Chj%2FWsv60fxE2R46%2BDbLXrBIi%2FdRyRuGuUUJwtqs0NdaZ46dq4JDIT8ghfd3ktMNq4wJ%2B6QP2YrHS5iMkGjiha%2F8vMeKI97H4miO3goXwps99PHVKlW9g6odMBswLeP16OvkuNRLKUBUHWmFYCDpSSjaS793IQgBwkLtAQwgzVa6YKYyPB%2Bc69A8uJQSTKRRqsGhEDWB30QWRQIZU5%2B%2FTrifixWk4Jrt2POaXiOHbmv44mcz0E74NJLBkIu0u9tZACVrsxBei0fGLt9qYL1l26cQc0RCNUuJCg5XGspJKL8k56Fq%2FOaJTOhi%2FJG%2FHiC%2FFv9TOtPWx1028IojbJRmG8eqXum3kn1LG3HqgaHvn63bYrA4dQJRGuHPmj0ROzcBruz6ZtxWmcXJ0M1dm9jHRUt1SR6KhaaFVUfF2kzINWIvRYRZhtHq1Vy6k43z6Xx5nMzhtIxwWs2gYXwunD1czrEtarRLbJi%2FSCFMt0FeAVFZxlBaOIrCC606yvfVXIBt1v%2BiCu3YLWqFUJFq75eTbgHwuCOyeAiK6G%2FFaE1HNhDU2AJtsXv5GcFfB6t1HqtOZBMU9PpG7AzzsoBH9%2Bs0CeYl402pBiDL49r5zzEcpgTCOCJVygu%2BxWzuwkWpVSPLW97KFa4CCW7BTA4xGkZy8%2BaBzQxTmRsDpxveLP9eDbj6InTrMyMxnS7rBD9jJSu2QTln9joyY4&__VIEWSTATEGENERATOR=B0093F3C&__EVENTVALIDATION=U3whT0Afqt%2Flmmchbyu%2BOrSams7rzN2eKgCzOxUfV%2Bc7UixEbsNCsAe0KAesUfGCYggdAKVpyMC%2FBjx5r%2B8TRzfKyU79WOR3OY6ksUEIyNRBEiinI6ufSQe0emHefWGDZlM%2F3GTTI0Hb5UgxgamdCfHsdFj9WgNk3yYAaMg2cDjCqoRLD8vLr4FYKmQaHMDda2XWBUA0e%2BYSNcqipo3kfsAZSw9jJjhqGC7gz%2B035sTkfW6FtihCuF94PxrxuwHkWH5t2sc64rSqwRxaq4kffvdWWph0SbLXnXFTOd69Qt4ocsJtxvion%2F9O2CN2jc8y3OktPy5gVfMHmie%2FmkqOsSkU%2B%2F2%2Bk9oRgZcQmS%2Ftepw1TasmAW%2FSZKmeQK0HElg24ppuQDJlDSLWi9Khv4LR4wuTUBBK21r0iy0jgPVVUFjg1mcAsiyOEYdy%2Ff9XpSIOOIk75ype7BR6Sb4yXCky7TYcV1tpWg%2BnztH%2Fri8U2a7OX30DCSmPgU0FrmWRDT9GumS8w5i%2BwKqMqcMpqrbSxO9TzhFgplwoLKOk%2F3f%2B7Y9GzcFcm4iIzV75Ca3aaGrKaF1XCkL52Ubpa%2Fdx1oAAYTZV8rElN%2FpsLXr9ISx5aFRdVhIPzevuonKCw7iZ%2Bwl%2F9uGHvT6KsTU3hok2%2FkwR1HByXBp90e5mi6bbP%2B%2B0TqF%2B6gUbaE50c3ZXsoVtxF62drbel3U3vCTtXLl8HuPXcVQ8dmIQVnGTXGHv4rI%2BqMZG1NHfAE4GO34bfXVdFqA%2B7xojrXk1DUHm91laiBWMxuNrYKqxpHcxxZRRfVkB9Pcg4DKhSYAEb13TiM3CwKRJLpUWXMfXjxONMIfLB8fhh%2BqCVF9U2O159rM6zTQI6iL9x1gKJRHZhoWThScPJE7gDap4CbdDUMnb6n1zZcGcONyMvDpPNpTYhzz8Cj8Cf5G72TPEBXuIvN5qUU9TWtTikkjRxBe6tbzawz0kNu2zAN8UoQHIk30FbqfEsWIYqKS15Vh6%2BubvPBg%2FjYBeSyXABxRo0riElkksV0mmENEXVtkhNV2qzEsRKJIsd%2BA8s9MQmNOjO99mqC8kvYQQlHDEJ6rHXBEoB9IgCqHP%2FF6CKEBI859Ru%2FYvMtESSrI%2F6rSAPNUShXxDgYwWPM0rwZKgftIi3UTW2lkZ60jHlEAfA%2B%2FaczdhQn8TnlPiKBRdyEktL4dE1Ssep5PeCVjfdEzfQbPZVZrd9atumUlSpoOPk4z52L5aj6Gvwn%2FXPH98E6ZPvi6k3Ck3UYf6O%2FKIugx7GU68PaO9oCXjLmYJpQt%2FRMQyVBlPdUW6GyVW0mKNzepiLIPMikWbnStjo03X9hb%2FA7eNt4P5L5S6wP10FMqsI0Vr%2BU4uraDlpSyjOyxrda541FwNltG8%2F%2FmSdb5pIFiOcLf65K0VtuDVnvzNzvNehNp3rokshKQHkTYOhvE3m9H%2Bn21OIdAFAwsZoqB1P0gqfVrA9GwQsjMV2O42eg%2BK%2Bto9epFQCjoMLTjRqXN%2FP7H0eDUDyZE4Eiq%2BoxFUAl6STeAitjJjC0L1V8DB%2FY%2F2QgHTb%2F%2FUr2RtrL69VP6S%2Bf%2FMI0bQWBScGNNhVEzLewBt&ctl00%24plnMain%24hdnValidMHACLicense=Y&ctl00%24plnMain%24hdnIsVisibleClsWrk=N&ctl00%24plnMain%24hdnIsVisibleCrsAvg=N&ctl00%24plnMain%24hdnJsAlert=Averages+cannot+be+displayed+when++Report+Card+Run+is+set+to+%28All+Runs%29.&ctl00%24plnMain%24hdnTitle=Classwork&ctl00%24plnMain%24hdnLastUpdated=Last+Updated&ctl00%24plnMain%24hdnDroppedCourse=+This+course+was+dropped+as+of+&ctl00%24plnMain%24hdnddlClasses=%28All+Classes%29&ctl00%24plnMain%24hdnddlCompetencies=%28All+Classes%29&ctl00%24plnMain%24hdnCompDateDue=Date+Due&ctl00%24plnMain%24hdnCompDateAssigned=Date+Assigned&ctl00%24plnMain%24hdnCompCourse=Course&ctl00%24plnMain%24hdnCompAssignment=Assignment&ctl00%24plnMain%24hdnCompAssignmentLabel=Assignments+Not+Related+to+Any+Competency&ctl00%24plnMain%24hdnCompNoAssignments=No+assignments+found&ctl00%24plnMain%24hdnCompNoClasswork=Classwork+could+not+be+found+for+this+competency+for+the+selected+report+card+run.&ctl00%24plnMain%24hdnCompScore=Score&ctl00%24plnMain%24hdnCompPoints=Points&ctl00%24plnMain%24hdnddlReportCardRuns1=%28All+Runs%29&ctl00%24plnMain%24hdnddlReportCardRuns2=%28All+Terms%29&ctl00%24plnMain%24hdnbtnShowAverage=Show+All+Averages&ctl00%24plnMain%24hdnShowAveragesToolTip=Show+all+student%27s+averages&ctl00%24plnMain%24hdnPrintClassworkToolTip=Print+all+classwork&ctl00%24plnMain%24hdnPrintClasswork=Print+Classwork&ctl00%24plnMain%24hdnCollapseToolTip=Collapse+all+courses&ctl00%24plnMain%24hdnCollapse=Collapse+All&ctl00%24plnMain%24hdnFullToolTip=Switch+courses+to+Full+View&ctl00%24plnMain%24hdnViewFull=Full+View&ctl00%24plnMain%24hdnQuickToolTip=Switch+courses+to+Quick+View&ctl00%24plnMain%24hdnViewQuick=Quick+View&ctl00%24plnMain%24hdnExpand=Expand+All&ctl00%24plnMain%24hdnExpandToolTip=Expand+all+courses&ctl00%24plnMain%24hdnChildCompetencyMessage=This+competency+is+calculated+as+an+average+of+the+following+competencies&ctl00%24plnMain%24hdnCompetencyScoreLabel=Grade&ctl00%24plnMain%24hdnAverageDetailsDialogTitle=Average+Details&ctl00%24plnMain%24hdnAssignmentCompetency=Assignment+Competency&ctl00%24plnMain%24hdnAssignmentCourse=Assignment+Course&ctl00%24plnMain%24hdnTooltipTitle=Title&ctl00%24plnMain%24hdnCategory=Category&ctl00%24plnMain%24hdnDueDate=Due+Date&ctl00%24plnMain%24hdnMaxPoints=Max+Points&ctl00%24plnMain%24hdnCanBeDropped=Can+Be+Dropped&ctl00%24plnMain%24hdnHasAttachments=Has+Attachments&ctl00%24plnMain%24hdnExtraCredit=Extra+Credit&ctl00%24plnMain%24hdnType=Type&ctl00%24plnMain%24hdnAssignmentDataInfo=Information+could+not+be+found+for+the+assignment&ctl00%24plnMain%24ddlReportCardRuns=${mp}-2025&ctl00%24plnMain%24ddlClasses=ALL&ctl00%24plnMain%24ddlCompetencies=ALL&ctl00%24plnMain%24ddlOrderBy=Class`;

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
    return new Response(JSON.stringify({ otherClasses: courses }), {
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
