import { useContext, useEffect, useState } from "react";
import { globalContext } from "../providers";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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
  return <div></div>;
}

export default Dashboard;
