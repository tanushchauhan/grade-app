"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

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
  return <div></div>;
}

export default Maincomponent;
