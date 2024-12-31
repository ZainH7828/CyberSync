import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import style from "./Input.module.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface DateInputType {
  onCalendarOpen?: (isVisible: boolean) => void;
  type?: "text";
  autoComplete?: string;
  label?: string;
  placeholder?: string;
  name?: string;
  setValue?: React.Dispatch<React.SetStateAction<Value>>;
  value?: Value;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const DateInput: React.FC<DateInputType> = ({
  placeholder,
  type = "text",
  label,
  name,
  autoComplete,
  required = false,
  value,
  setValue,
  className = "",
  disabled = false,
  onCalendarOpen = () => null,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleFocus = () => {
    setDropdownVisible(true);
    onCalendarOpen?.(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDropdownVisible(false);
      onCalendarOpen?.(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <div className={`${style.inputArea} ${className}`} onBlur={handleBlur}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        value={value?.toLocaleString().split(", ")[0]}
        onChange={handleInputChange}
        className={style.input}
        disabled={disabled ? true : undefined}
        onFocus={handleFocus}
      />
      {isDropdownVisible && (
        <div className={style.dateDropdown}>
          <Calendar
            className="dateTdCalendar"
            onChange={setValue as React.Dispatch<React.SetStateAction<Value>>}
            value={value}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
