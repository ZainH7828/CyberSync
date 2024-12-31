import Calendar from "react-calendar";
import style from "./DateTd.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "@/context";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const DateTd: React.FC<DateTdType> = ({ date, setDate }) => {
  const context = useContext(MainContext);

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const dateTdArea = useRef<HTMLTableCellElement>(null);

  const closeSelectDrop = (e: MouseEvent) => {
    if (
      dropdownVisible &&
      dateTdArea.current &&
      !dateTdArea.current.contains(e.target as Node)
    ) {
      console.log(dateTdArea.current.contains(e.target as Node));
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSelectDrop);

    return () => {
      document.removeEventListener("mousedown", closeSelectDrop);
    };
  }, [dropdownVisible]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <td
      className={style.dateTd}
      onClick={() => setDropdownVisible(true)}
      ref={dateTdArea}
    >
      <span>{formatDate(date)}</span>
      {(context?.userData.value?.rights.task?.edit ||
        context?.userData.value?.rights.task?.add) &&
        dropdownVisible && (
          <div className={style.dropdown}>
            <Calendar
              className="dateTdCalendar"
              onChange={setDate as React.Dispatch<React.SetStateAction<Value>>}
              value={date}
            />
          </div>
        )}
    </td>
  );
};

export default DateTd;
