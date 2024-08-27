"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import Loader from "@/components/ui/Loader";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import { motion } from "framer-motion";

function GradeCard({ data, periodNumber, setCurrentView }) {
  const router = useRouter();
  return (
    <div
      className="w-25 h-25 border-blue-600 border-2 p-6 rounded-2xl cursor-pointer"
      onClick={() => setCurrentView(`${data.courseCode}${periodNumber}`)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-y-0 gap-y-5 item-center justify-items-center">
        <div className="flex items-center justify-self-center lg:justify-items-start">
          <h2 className="font-bold text-2xl ml-3 text-center">
            {data.courseName}
          </h2>
        </div>
        <div className="flex items-center">
          <h2 className="font-bold text-2xl ml-3 text-slate-500">
            {data.courseCode}
          </h2>
        </div>
        <div className="flex items-center">
          <h2 className="font-bold text-2xl ml-3 text-slate-500 text-center">
            {data.assignmentData?.length - 1
              ? data.assignmentData?.length - 1
              : 0}{" "}
            assignments
          </h2>
        </div>

        <div className="ml-3">
          <p className=" text-6xl bg-gradient-to-r from-blue-600 dark:via-indigo-300 via-indigo-900 dark:to-[#4A6CF7] to-[#4A6CF7] inline-block text-transparent bg-clip-text font-bold">
            {data.studentGrade}%
          </p>
        </div>
      </div>
    </div>
  );
}

const loadingSVG = (
  <svg
    className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const reloadIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 stroke-indigo-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

function Maincomponent() {
  const router = useRouter();
  const periodNumSelector = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [mainReloadBtn, setMainReloadBtn] = useState(false);

  const initialVal =
    typeof window !== "undefined"
      ? sessionStorage.getItem(`data`) && sessionStorage.getItem("currPeriod")
        ? JSON.parse(sessionStorage.getItem(`data`))[
            sessionStorage.getItem("currPeriod")
          ]
        : null
      : null;
  const initialValLoading =
    typeof window !== "undefined"
      ? sessionStorage.getItem(`data`) && sessionStorage.getItem("currPeriod")
        ? false
        : true
      : true;
  const [currentData, setCurrentData] = useState(initialVal);
  const [loading, setLoading] = useState(initialValLoading);

  const queryClient = useQueryClient();

  const { gpaTimeChanged, updateGpaTimeChanged, updateChangeTheHeader } =
    useContext(globalContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function runThis() {
      if (!hasCookie("token")) {
        router.push("/signin");
      } else if (!sessionStorage.getItem("data")) {
        const options = { onlyPeriod: false, periodNumNeeded: null };
        const token = getCookie("token");
        const dataToSend = { token, options };
        const res = await fetch("/api/hac/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });

        try {
          let data = await res.json();
          if (!data.success) {
            deleteCookie("token");
            router.push("/signin");
            return;
          } else {
            const perNum = data.periodNumber;
            const dataToStore = {};
            dataToStore[`${perNum}`] = data;
            sessionStorage.setItem(`data`, JSON.stringify(dataToStore));
            sessionStorage.setItem("currPeriod", perNum);
            sessionStorage.setItem("perCurrPeriod", perNum);
            updateChangeTheHeader(true);
            let initialData = {};
            let initialPeriod;
            initialData = JSON.parse(sessionStorage.getItem(`data`));
            initialPeriod = sessionStorage.getItem("currPeriod");
            setCurrentData(initialData[initialPeriod]);
            setLoading(false);
            if (data.studentName === "Demo User") {
              toast(
                "You are using the Demo Account!\nGrades would be same accross marking periods.",
                {
                  icon: "😀",
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                }
              );
            }
            return;
          }
        } catch (e) {
          console.error(e);
          deleteCookie("token");
          router.push("/signin");
          return;
        }
      } else {
        if (!loading) return;
        let initialData = {};
        let initialPeriod;
        initialData = JSON.parse(sessionStorage.getItem(`data`));
        initialPeriod = sessionStorage.getItem("currPeriod");
        setCurrentData(initialData[initialPeriod]);
        updateUserName(initialData[initialPeriod].studentName);
        setLoading(false);
      }
    }
    runThis();
  }, [router, loading, updateChangeTheHeader]);

  function handleRefetchClick() {
    if (gpaTimeChanged === 0) {
      queryClient.invalidateQueries(["gpa"]);
      updateGpaTimeChanged(queryClient.getQueryState(["gpa"]).dataUpdateCount);
    } else {
      const x = queryClient.getQueryState(["gpa"]);
      if (gpaTimeChanged === x.dataUpdateCount) {
        return;
      } else {
        queryClient.invalidateQueries(["gpa"]);
        updateGpaTimeChanged(
          queryClient.getQueryState(["gpa"]).dataUpdateCount
        );
      }
    }
  }

  async function mainRefetch() {
    if (mainReloadBtn) return;
    if (!isLoading) setIsLoading(true);
    const options = { onlyPeriod: false, periodNumNeeded: null };
    const token = getCookie("token");
    const dataToSend = { token, options };
    const res = await fetch("/api/hac/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    try {
      let data = await res.json();
      if (!data.success) {
        deleteCookie("token");
        console.error("API server down!");
        router.push("/signin");
        return;
      } else {
        const perNum = data.periodNumber;
        const dataToStore = {};
        dataToStore[`${perNum}`] = data;
        sessionStorage.setItem(`data`, JSON.stringify(dataToStore));
        sessionStorage.setItem("currPeriod", perNum);
        sessionStorage.setItem("perCurrPeriod", perNum);
        updateChangeTheHeader(true);
        let initialData = {};
        let initialPeriod;
        initialData = JSON.parse(sessionStorage.getItem(`data`));
        initialPeriod = sessionStorage.getItem("currPeriod");
        setCurrentData(initialData[initialPeriod]);
        setIsLoading(false);
        setMainReloadBtn(false);
        return;
      }
    } catch (e) {
      console.error(e);
      deleteCookie("token");
      router.push("/signin");
      return;
    }
  }

  async function handleChange(e) {
    if (e.target.value === currentData.periodNumber) return;
    const value = e.target.value;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currPeriod", value);
    }
    setIsLoading(true);
    const currData =
      typeof window !== "undefined"
        ? JSON.parse(sessionStorage.getItem(`data`))
        : null;
    if (currData[value]) {
      setCurrentData(currData[value]);
      setIsLoading(false);
      return;
    }
    const token = getCookie("token");

    const dataToSend = {
      token,
      options: { onlyPeriod: true, periodNumber: value },
    };
    const res = await fetch("/api/hac/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    try {
      const resData = await res.json();
      const preNum = resData.periodNumber;
      const currData =
        typeof window !== "undefined"
          ? JSON.parse(sessionStorage.getItem("data"))
          : null;
      currData[`${preNum}`] = resData;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("data", JSON.stringify(currData));
      }
      setCurrentData(resData);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      router.push("/error");
    }
  }

  if (!hasCookie("token") || loading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    ></motion.div>
  );
}

export default Maincomponent;
