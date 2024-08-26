function AssignmentItem({
  data,
  updateModalStatus,
  id,
  whatIF,
  allData,
  setAllData,
}) {
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
