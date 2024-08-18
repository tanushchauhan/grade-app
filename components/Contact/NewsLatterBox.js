"use client";

import { useTheme } from "next-themes";
import { storeSub } from "./storeSub";
import { useState } from "react";
import toast from "react-hot-toast";

const NewsLatterBox = () => {
  const [sendStatus, setSendStatus] = useState(false);
  const { theme } = useTheme();

  async function handleSubmit(e) {
    e.preventDefault();
    setSendStatus(true);
    await storeSub(e.target.name.value, e.target.email.value);
    toast("Thank you for subscribing 😀", {
      duration: 3000,
    });
    setSendStatus(false);
    e.target.name.value = "";
    e.target.email.value = "";
  }

  return (
    <div
      className="wow fadeInUp shadow-three dark:bg-gray-dark relative z-10 rounded-sm bg-white p-8 sm:p-11 lg:p-8 xl:p-11"
      data-wow-delay=".2s"
    >
      <h3 className="mb-10 text-2xl font-bold leading-tight text-black dark:text-white">
        Subscribe to receive future updates
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            disabled={sendStatus}
            placeholder="Enter your name"
            className="border-stroke dark:text-body-color-dark dark:shadow-two mb-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
          />
          <input
            type="email"
            name="email"
            disabled={sendStatus}
            placeholder="Enter your email"
            className="border-stroke dark:text-body-color-dark dark:shadow-two mb-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
          />
          <button
            type="submit"
            disabled={sendStatus}
            className="shadow-submit dark:shadow-submit-dark mb-5 flex w-full cursor-pointer items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90"
          >
            {sendStatus ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      </form>

      <div>
        <span className="absolute left-2 top-7">
          <svg
            width="57"
            height="65"
            viewBox="0 0 57 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M0.407629 15.9573L39.1541 64.0714L56.4489 0.160793L0.407629 15.9573Z"
              fill="url(#paint0_linear_1028_600)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1028_600"
                x1="-18.3187"
                y1="55.1044"
                x2="37.161"
                y2="15.3509"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0.62"
                />
                <stop
                  offset="1"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default NewsLatterBox;
