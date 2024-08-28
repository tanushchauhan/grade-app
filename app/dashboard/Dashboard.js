import { useContext, useEffect, useState } from "react";
import { globalContext } from "../providers";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ThemeToggler from "@/components/Header/ThemeToggler";
import Link from "next/link";
import Image from "next/image";

function Dashboard() {
  const { updateChangeTheHeader } = useContext(globalContext);
  const [currentView, setCurrentView] = useState("home");
  const [openUser, setOpenUser] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const [userID, setUserID] = useState("Loading...");

  const router = useRouter();

  const queryClient = useQueryClient();

  const handleClick = () => {
    deleteCookie("token");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(`data`);
      sessionStorage.removeItem("currPeriod");
      sessionStorage.removeItem("currGPADataShown");
      sessionStorage.removeItem("trans");
      sessionStorage.removeItem("perCurrPeriod");
    }
    queryClient.clear();
    updateChangeTheHeader(false);
    router.push("/signin");
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      if (sessionStorage.getItem("data")) {
        const data = JSON.parse(sessionStorage.getItem("data"));
        const perNum = Number(sessionStorage.getItem("perCurrPeriod"));
        setUserID(data[perNum].id);
        setUserName(data[perNum].studentName);
      }
    }
  }, []);
  return (
    <div
      onClick={() => {
        if (openUser) {
          setOpenUser(false);
        }
      }}
    >
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                onClick={() => {
                  setOpenSidebar((e) => !e);
                }}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link href="/" className="flex ms-2 md:me-24">
                <Image
                  src="images/logo/logo.svg"
                  className=" h-12"
                  alt="GradeMate Logo"
                  height={64.667}
                  width={165.26}
                  priority={true}
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white -ml-20">
                  GradeMate
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <ThemeToggler />
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      id="btn"
                    >
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="w-8 h-8 rounded-full"
                        src="/images/testimonials/auth-1.png"
                        alt="user photo"
                        height={70}
                        width={70}
                        priority={true}
                        onClick={() => {
                          setOpenUser((e) => {
                            if (!e === false) {
                              document.querySelector("#btn").blur();
                            }
                            return !e;
                          });
                        }}
                      />
                    </button>
                  </div>

                  {openUser ? (
                    <div className="z-50 my-4 text-base list-none bg-slate-100 divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 top-6 right-0 absolute">
                      <div className="px-4 py-3" role="none">
                        <p
                          className="text-sm text-gray-900 dark:text-white min-w-28"
                          role="none"
                        >
                          {userName}
                        </p>
                        <p
                          className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                          role="none"
                        >
                          {userID}
                        </p>
                      </div>
                      <ul className="py-1" role="none">
                        <li>
                          <a
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Dashboard
                          </a>
                        </li>
                        <li>
                          <a
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                            role="menuitem"
                            onClick={handleClick}
                          >
                            Sign out
                          </a>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    false
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
