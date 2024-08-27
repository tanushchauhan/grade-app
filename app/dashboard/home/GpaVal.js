"use client";

import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

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

function giveGPAs(periodObj) {
  let sum = 0;
  let numSum = 0;
  for (let i = 0; i < periodObj.data.length; i++) {
    if (periodObj.data[i].noWeight) continue;
    let weight = 5.0;
    try {
      weight = periodObj.data[i].weightDetails.weight;
    } catch {}
    const grade = Math.round(periodObj.data[i].studentGrade);
    if (grade <= 100) {
      for (let o = 100; o !== grade; o--) {
        weight -= 0.1;
      }
    }
    weight = Number(weight.toFixed(3));
    sum += weight;
    numSum++;
  }
  return { sum, numSum };
}

function GpaVal() {
  return <div></div>;
}

export default GpaVal;
