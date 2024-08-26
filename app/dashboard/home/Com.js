import { useContext, useEffect, useRef, useState } from "react";
import { globalContext } from "@/app/providers";
import Link from "next/link";
import { motion } from "framer-motion";

function AssignmentItem({
  data,
  updateModalStatus,
  id,
  whatIF,
  allData,
  setAllData,
}) {
  const [inputData, setInputData] = useState(
    Number(data[4]) ? Number(data[4]) : data[4]
  );
  const [showTitleAsInput, setShowTitleAsInput] = useState(false);
  const [titleValAtWhatIF, setTitleValAtWhatIF] = useState(data[2]);
  function handleClick(e) {
    if (e.target.id === "noClick") {
      return;
    } else if (e.target.id === "noClickAtWhatIF") {
      if (whatIF) return;
      else {
        updateModalStatus(true, id);
      }
    } else {
      updateModalStatus(true, id);
    }
  }
  useEffect(() => {
    if (
      !whatIF &&
      inputData !== (Number(data[4]) ? Number(data[4]) : data[4])
    ) {
      setInputData(Number(data[4]) ? Number(data[4]) : data[4]);
    }

    if (!whatIF && titleValAtWhatIF !== data[2]) {
      setTitleValAtWhatIF(data[2]);
    }
  }, [whatIF, data, inputData, titleValAtWhatIF]);

  function handleChange(e) {
    if (
      !Number(e.target.value) &&
      e.target.value !== "" &&
      e.target.value !== "L" &&
      Number(e.target.value) !== 0
    ) {
      return;
    }
    if (Number(e.target.value) > 999 || e.target.value.length > 3) {
      return;
    }
    let assignmentData = JSON.parse(JSON.stringify(allData.assignmentData));
    assignmentData[id + 1][4] = e.target.value;
    setAllData((f) => {
      return { ...f, assignmentData };
    });
    setInputData(e.target.value);
  }

  function handleWhatIFTextClick() {
    if (!whatIF) return;

    setShowTitleAsInput(true);
  }

  return (
    <div
      className="grid grid-cols-1 items-center justify-items-center xl:justify-items-start xl:grid-cols-[30%_1fr_1fr] p-4 gap-y-4 cursor-pointer font-bold rounded-xl text-slate-800 dark:text-slate-200 border-4"
      style={{
        borderColor: `${
          data[3] === "Progress Check for Learning"
            ? "rgb(8 145 178 / var(--tw-bg-opacity)"
            : "rgb(79 70 229)"
        }`,
      }}
      onClick={handleClick}
    >
      <span className="xl:text-xl">{data[0]}</span>
      {!showTitleAsInput ? (
        <span
          id="noClickAtWhatIF"
          className="text-center text-xl"
          onClick={handleWhatIFTextClick}
        >
          {titleValAtWhatIF}
        </span>
      ) : (
        <input
          id="noClickAtWhatIF"
          value={titleValAtWhatIF}
          onChange={(e) => setTitleValAtWhatIF(e.target.value)}
          className="text-3xl xl:text-xl p-2 rounded-xl transition-all duration-300 w-full"
          onBlur={(e) => {
            setShowTitleAsInput(false);
          }}
          onKeyDown={(e) =>
            e.code === "Enter" ? setShowTitleAsInput(false) : null
          }
        />
      )}
      {whatIF === false ? (
        <span
          className={`xl:justify-self-end text-3xl xl:text-xl p-2 rounded-xl text-white ${
            Number(data[4])
              ? Number(data[4]) >= 90
                ? "bg-green-700"
                : Number(data[4]) >= 70
                ? "bg-amber-600"
                : "bg-red-700"
              : Number(data[4]) === 0 && data[4] !== ""
              ? "bg-red-700"
              : ""
          }`}
        >
          {Number(data[4]) ? Number(data[4]) : data[4]} /{" "}
          {!Number(data[5]) ? "100" : Number(data[5])}
        </span>
      ) : (
        <div className="xl:justify-self-end">
          <input
            id="noClick"
            className={`text-3xl xl:text-xl p-2 rounded-xl transition-all duration-300 w-16 text-white ${
              inputData
                ? inputData >= 90
                  ? "bg-green-700"
                  : inputData >= 70
                  ? "bg-amber-600"
                  : "bg-red-700"
                : inputData === 0 && inputData !== ""
                ? "bg-red-700"
                : ""
            }`}
            value={inputData}
            onChange={handleChange}
          ></input>
          <span> / {!Number(data[5]) ? "100" : Number(data[5])}</span>
        </div>
      )}
    </div>
  );
}

function Com({ params }) {
  const { updateChangeTheHeader } = useContext(globalContext);

  let store =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("data"))
      : null;
  const perNum = Number(params.id.substring(params.id.length - 1));
  const code = params.id.substring(0, params.id.length - 1);
  let data;
  try {
    data = store[perNum].data.filter((e) => e.courseCode === code)[0];
  } catch {
    data = null;
  }

  const [allData, setAllData] = useState(data);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [whatIFStatus, setWhatIFStatus] = useState(false);

  function calculateOverAll() {
    let studentOverallGrade;
    try {
      const count = allData?.assignmentData?.filter((e) => {
        if (e[3] === "Assessment of Learning") {
          if (e[4].trim() === "") {
            return false;
          } else if (e[4] === "L" || Number(e[4]) === 0) {
            return true;
          } else if (!Number(e[4])) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      }).length;

      const sum = allData?.assignmentData
        .filter((e) => {
          if (e[3] === "Assessment of Learning") {
            if (e[4].trim() === "") {
              return false;
            } else if (e[4] === "L" || Number(e[4]) === 0) {
              return true;
            } else if (!Number(e[4])) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        })
        .reduce((acc, e) => {
          if (!Number(e[4]) && Number(e[4]) !== 0) {
            return acc;
          } else {
            return acc + Number(e[4]);
          }
        }, 0);

      studentOverallGrade =
        Math.round((sum / count + Number.EPSILON) * 100) / 100;
      if (!studentOverallGrade) {
        studentOverallGrade = 0;
      }
    } catch (e) {
      studentOverallGrade = 0;
    }
    return studentOverallGrade;
  }

  const [per, setPer] = useState(calculateOverAll());

  const [assignmentsAdded, setAssignmentsAdded] = useState(0);

  useEffect(() => {
    function calculateOverAllAndUpdate() {
      let studentOverallGrade;
      try {
        const count = allData?.assignmentData?.filter((e) => {
          if (e[3] === "Assessment of Learning") {
            if (e[4].trim() === "") {
              return false;
            } else if (e[4] === "L" || Number(e[4]) === 0) {
              return true;
            } else if (!Number(e[4])) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        }).length;

        const sum = allData?.assignmentData
          .filter((e) => {
            if (e[3] === "Assessment of Learning") {
              if (e[4].trim() === "") {
                return false;
              } else if (e[4] === "L" || Number(e[4]) === 0) {
                return true;
              } else if (!Number(e[4])) {
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          })
          .reduce((acc, e) => {
            if (!Number(e[4]) && Number(e[4]) !== 0) {
              return acc;
            } else {
              return acc + Number(e[4]);
            }
          }, 0);

        studentOverallGrade =
          Math.round((sum / count + Number.EPSILON) * 100) / 100;
        if (!studentOverallGrade) {
          studentOverallGrade = 0;
        }
      } catch (e) {
        console.error(e);
        console.log(allData);
        studentOverallGrade = 0;
      }
      setPer(studentOverallGrade);
    }
    calculateOverAllAndUpdate();
  }, [allData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function updateModalStatus(status, id) {
    document.querySelector("html").classList.toggle("overflow-hidden");

    if (status) {
      setModalData(data.assignmentData[id + 1]);
    }
    setShowModal(status);
  }

  function addNewAOL() {
    setAllData((e) => {
      e.assignmentData.splice(1, 0, [
        "Today",
        "Today",
        "New Assignment",
        "Assessment of Learning",
        "",
        "100.00",
        "1.00",
        " ",
        "100.00",
        " ",
        Date.now(),
      ]);

      return e;
    });
    setAssignmentsAdded((e) => e + 1);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-2 text-slate-200">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div
                className="backdrop-blur-sm fixed inset-0 z-40"
                onClick={() => updateModalStatus(false)}
              ></div>
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none z-[55]">
                {/*header*/}
                <div className="flex items-center justify-between p-5  rounded-t">
                  <h3 className="text-3xl font-semibold">Assignemnt Details</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => updateModalStatus(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      className="w-14 h-14 stroke-slate-200"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 my-2">
                      <div className="flex items-center flex-col gap-2 justify-center bg-primary p-3 rounded-3xl">
                        <p className="font-bold text-center">Date Assigned</p>
                        <p className="text-xl  text-slate-100 font-semibold text-center">
                          {modalData[1].trim() === "" ? "None" : modalData[1]}
                        </p>
                      </div>
                      <div className="flex items-center flex-col gap-2 justify-center bg-primary p-3 rounded-3xl">
                        <p className="font-bold text-center">Date Due</p>
                        <p className="text-xl  text-slate-100 font-semibold text-center">
                          {modalData[0].trim() === "" ? "None" : modalData[0]}
                        </p>
                      </div>
                      <div className="flex items-center flex-col gap-2 justify-center bg-primary p-3 rounded-3xl">
                        <p className="font-bold text-center">Score</p>
                        <p className="text-xl  text-slate-100 font-semibold text-center">
                          {modalData[4].trim() === "" ? "None" : modalData[4]} /{" "}
                          {modalData[5]}
                        </p>
                      </div>
                      <div className="flex items-center flex-col gap-2 justify-center bg-primary p-3 rounded-3xl">
                        <p className="font-bold text-center">Weighted Points</p>
                        <p className="text-xl  text-slate-100 font-semibold text-center">
                          {modalData[7].trim() === "" ? "None" : modalData[7]} /{" "}
                          {modalData[8]}
                        </p>
                      </div>
                      <div className="flex items-center flex-col gap-2 justify-center bg-primary p-3 rounded-3xl">
                        <p className="font-bold text-center">Weight</p>
                        <p className="text-xl  text-slate-100 font-semibold text-center">
                          {modalData[6].trim() === "" ? "None" : modalData[6]}
                        </p>
                      </div>
                      <div className="flex items-center flex-col gap-2 justify-center bg-primary p-3 rounded-3xl">
                        <p className="font-bold text-center">Percentage</p>
                        <p className="text-xl  text-slate-100 font-semibold text-center">
                          {Number(modalData[9]) ? Number(modalData[9]) : "0.0"}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

export default Com;
