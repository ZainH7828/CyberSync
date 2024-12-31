import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Select.module.css";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";

const Select: React.FC<SelectType> = ({
  title,
  value,
  options = [],
  onSelect = () => null,
  className = "",
  hideIndicator = false,
  labelCentered = false,
}) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");

  const selectAreaRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setVisibility(!visibility);
  };

  const handleHideDropdown = (item: selectOptionsType) => {
    onSelect(item);
    setVisibility(false);
  };

  const closeSelectDrop = (e: MouseEvent) => {
    if (
      visibility &&
      selectAreaRef.current &&
      !selectAreaRef.current.contains(e.target as Node)
    ) {
      setVisibility(false);
    }
  };

  useEffect(() => {
    const getLabel = () => {
      if (!value) return "";

      const matchedOption = options.find((option) => option.value == value);
      setLabel(matchedOption ? matchedOption.label : "");
    };

    getLabel();
  }, [value, options]);

  useEffect(() => {
    document.addEventListener("mousedown", closeSelectDrop);

    return () => {
      document.removeEventListener("mousedown", closeSelectDrop);
    };
  }, [visibility]);

  return (
    <div
      className={`${style.selectArea} ${className}`}
      onClick={handleToggleDropdown}
      ref={selectAreaRef}
    >
      {title && <label>{title}</label>}
      <p className={`${labelCentered ? "justify-content-center" : ""}`}>
        <span>{label}</span>
        {!hideIndicator && <FontAwesomeIcon icon={faAngleDown} />}
      </p>
      {visibility && (
        <ul className={style.selectDropdown}>
          {options.map((item) => (
            <React.Fragment key={item.value}>
              {!item.hidden && (
                <li>
                  <button
                    type="button"
                    onClick={() => handleHideDropdown(item)}
                    className={item.value === value ? style.selected : ""}
                  >
                    {item.label}
                  </button>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
