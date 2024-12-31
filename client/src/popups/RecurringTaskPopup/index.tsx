import Button from "@/elements/Button";
import Popup from "../";
import style from "../Popup.module.css";
import Select from "@/elements/Select";
import { useState } from "react";
import { WelldoneIcon } from "@/icons/dashboard";
import Calendar from "react-calendar";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const RecurringTaskPopup: React.FC<recurringTaskPopupType> = ({
  visibility = false,
  toggleVisibility = () => null,
  onSuccess = () => null,
  overflowAuto = false,
}) => {
  const options: selectOptionsType[] = [
    {
      label: "Choose Duration",
      value: "_",
      hidden: true,
    },
    {
      label: "Weekly",
      value: "weekly",
    },
    {
      label: "Monthly",
      value: "monthly",
    },
  ];

  const [selectedOption, setSelectedOption] = useState<selectOptionsType>(
    options[0]
  );

  const [completedPopup, setCompletedPopup] = useState<boolean>(false);
  const [value, onChange] = useState<Value>(new Date());

  const weeklyDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const saveHandler = () => {
    if (!completedPopup) {
      setCompletedPopup(true);
    } else {
      onSuccess();
      setSelectedOption(options[0]);
      setTimeout(() => {
        setCompletedPopup(false);
      }, 500);
    }
  };

  const onCancel = () => {
    if (visibility) {
      toggleVisibility();
      setTimeout(() => {
        setSelectedOption(options[0]);
      }, 500);
    }
  }

  const popupData: PopupType = {
    visibility: visibility,
    toggleVisibility: !completedPopup ? onCancel : saveHandler,
    className: style.deletePopup,
    heading: "Recurring Task",
    overflowAuto: overflowAuto,
  };

  return (
    <Popup {...popupData}>
      {!completedPopup ? (
        <div className={style.inputContainer}>
          <div className={style.inputArea}>
            <Select
              title="Repeat every"
              options={options}
              value={selectedOption.value}
              onSelect={setSelectedOption}
            />
          </div>
          <div className={style.inputArea}>
            {selectedOption.value === "weekly" && (
              <div className={style.weeklyDaysContainer}>
                {weeklyDays.map((day) => (
                  <div key={day} className={style.weeklyDay}>
                    <input type="radio" id={day} name={"weekly-day"} />
                    <label htmlFor={day}>
                      <span>{day}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
            {selectedOption.value === "monthly" && (
              <Calendar onChange={onChange} value={value} selectRange />
            )}
          </div>
        </div>
      ) : (
        <div className={style.welldoneArea}>
          <WelldoneIcon />
        </div>
      )}
      <div className={style.popupBtns}>
        <Button onClick={saveHandler}>
          {completedPopup ? "Done" : "Save"}
        </Button>
        {!completedPopup ? (
          <Button theme="danger" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </Popup>
  );
};

export default RecurringTaskPopup;
