"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasCookie, setCookie } from "cookies-next";
import { encCreds } from "../actions.js/encCreds";
import { useMutation } from "@tanstack/react-query";
import { globalContext } from "../providers";
import toast from "react-hot-toast";

function Form() {
  onst[(error, setError)] = useState(null);
  const [btnText, setBtnText] = useState("Sign in");
  const router = useRouter();
  const { updateChangeTheHeader } = useContext(globalContext);
  useEffect(() => {
    if (hasCookie("token")) {
      router.push("/dashboard");
    }
  }, [router]);

  async function handleQuery({ username, password, isChecked }) {
    const options = { onlyPeriod: false, periodNumNeeded: null };
    setBtnText(
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
    const preToken = username + " % " + password;
    const token = await encCreds(preToken);
    const dataToSend = { token, options };
    const res = await fetch("/api/hac/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    try {
      let data = await res.json();
      if (!data.success) {
        if (data.wrongPas) {
          setError("The username and password does not match!");
          setBtnText("Sign in");
          return;
        } else {
          setError(
            "There was a error while processing your request! Please try again later."
          );
          setBtnText("Sign in");
          return;
        }
      } else {
        if (isChecked) {
          const d = new Date();
          d.setDate(d.getDate() + 15);
          setCookie("token", token, {
            secure: true,
            sameSite: true,
            expires: d,
          });
        } else {
          setCookie("token", token, {
            secure: true,
            sameSite: true,
          });
        }
        if (typeof window !== "undefined" && window.sessionStorage) {
          const perNum = data.periodNumber;
          const dataToStore = {};
          data.id = username;
          dataToStore[`${perNum}`] = data;
          sessionStorage.setItem(`data`, JSON.stringify(dataToStore));
          sessionStorage.setItem("currPeriod", perNum);
          sessionStorage.setItem("perCurrPeriod", perNum);
        }
        setBtnText("Sign in");
        updateChangeTheHeader(true);
        router.push("/dashboard");
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
      setError(
        "There was a error while processing your request! Please try again later."
      );
      setBtnText("Sign in");
      return;
    }
  }
  return <div></div>;
}

export default Form;
