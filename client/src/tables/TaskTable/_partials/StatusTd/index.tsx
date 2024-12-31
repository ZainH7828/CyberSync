import React, { useEffect, useRef, useState } from "react";
import style from "./StatusTd.module.css";

const StatusTd: React.FC<StatusTdType> = ({ status, setStatus }) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const statusTdArea = useRef<HTMLTableCellElement>(null);

  const getStatusType = (status: string) => {
    switch (status) {
      case "not-started":
        return {
          background: "#DF2F4A",
          text: "Not Started",
        };
      case "in-progress":
        return {
          background: "#fdab3d",
          text: "In Progress",
        };
      case "needs-schedule":
        return {
          background: "#DF2F4A",
          text: "Needs to Schedule",
        };
      case "scheduled":
        return {
          background: "#3D85C6",
          text: "Scheduled",
        };
      case "stuck":
      case "behind-schedule":
        return {
          background: "#A61C00",
          text: "Behind Schedule",
        };
      case "on-hold":
        return {
          background: "#9CD326",
          text: "On Hold",
        };
      case "done":
        return {
          background: "#00C875",
          text: "Done",
        };
      default:
        return {
          background: "#bbb",
          text: "",
        };
    }
  };

  const { background, text } = getStatusType(status);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setDropdownVisible(false);
  };

  const closeSelectDrop = (e: MouseEvent) => {
    if (
      dropdownVisible &&
      statusTdArea.current &&
      !statusTdArea.current.contains(e.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSelectDrop);

    return () => {
      document.removeEventListener("mousedown", closeSelectDrop);
    };
  }, [dropdownVisible]);

  return (
    <td
      className={style.statusTd}
      style={{ backgroundColor: background }}
      onClick={() => setDropdownVisible(true)}
      ref={statusTdArea}
    >
      <div className={style.statusArea}>{text}</div>
      {dropdownVisible && (
        <ul className={style.dropdown}>
          {[
            "not-started",
            "in-progress",
            // "needs-schedule",
            // "scheduled",
            // "stuck",
            "behind-schedule",
            // "on-hold",
            "done",
          ].map((status) => (
            <li
              key={status}
              onClick={() => handleStatusChange(status)}
              style={{ backgroundColor: getStatusType(status).background }}
            >
              {getStatusType(status).text}
            </li>
          ))}
        </ul>
      )}
    </td>
  );
};

export default StatusTd;
