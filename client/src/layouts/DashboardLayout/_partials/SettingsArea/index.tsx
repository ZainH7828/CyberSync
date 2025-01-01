import {
  CategoryIcon,
  DownloadIcon,
  SettingsIcon,
  TeamIcon,
} from "@/icons/sideBar";
import style from "./SettingsArea.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import ReportPopup from "@/popups/ReportPopup";
import Link from "next/link";
import routes from "@/routes";
import { MainContext } from "@/context";
// import { WelldoneIcon } from "@/icons/dashboard";

const SettingsArea = () => {
  const context = useContext(MainContext);
  const [visibility, setVisibility] = useState<boolean>(false);
  const [reportVisibility, setReportVisibility] = useState<boolean>(false);
  const settingsAreaRef = useRef<HTMLUListElement>(null);

  const closeSelectDrop = (e: MouseEvent) => {
    if (
      visibility &&
      settingsAreaRef.current &&
      !settingsAreaRef.current.contains(e.target as Node)
    ) {
      toggleVisibility();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSelectDrop);

    return () => {
      document.removeEventListener("mousedown", closeSelectDrop);
    };
  }, [visibility]);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  if (
    !context?.userData.value?.rights.category?.add &&
    !context?.userData.value?.rights.category?.edit &&
    !context?.userData.value?.rights.manageTeam &&
    !context?.userData.value?.rights.downloadReport
  ) {
    return <></>;
  }

  return (
    <>
      <div className={style.settingsArea}>
        {visibility && (
          <ul className={style.settingsPopup} ref={settingsAreaRef}>
            {/* {context?.userData.value?.rights.downloadReport ? (
              <li>
                <button type="button" onClick={() => setReportVisibility(true)}>
                  <DownloadIcon />
                  <span>Download Report</span>
                </button>
              </li>
            ) : null} */}
            {/* <li>
              <Link
                href={routes.users.summaryReport}
                className="flex items-center gap-2"
              >
                <img
                  src="/summary-report-icon.png"
                  alt="summary-report"
                  style={{ width: "20px", height: "20px" }}
                />
                <span style={{ marginLeft: "10px" }}>Summary Report</span>
              </Link>
            </li> */}
            {context?.userData.value?.rights.manageTeam ? (
              <li>
                <Link href={routes.users.teamMembers}>
                  <TeamIcon />
                  <span>Team Members</span>
                </Link>
              </li>
            ) : null}
            {/* {context?.userData.value?.rights.category?.add ||
            context?.userData.value?.rights.category?.edit ? (
              <li>
                <Link href={routes.users.categoriesTask}>
                  <CategoryIcon />
                  <span>Categories & Task</span>
                </Link>
              </li>
            ) : null} */}
            {/* <li>
              <Link href={routes.users.selfAssessment.main}>
                <WelldoneIcon />
                <span>Self Assessment</span>
              </Link>
            </li> */}
          </ul>
        )}
        <button
          type="button"
          className={visibility ? style.active : ""}
          onClick={toggleVisibility}
        >
          <SettingsIcon />
          <span>Settings</span>
        </button>
      </div>
      <ReportPopup
        visibility={reportVisibility}
        toggleVisibility={() => setReportVisibility(false)}
      />
    </>
  );
};

export default SettingsArea;
