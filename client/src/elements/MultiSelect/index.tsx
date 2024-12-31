import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./MultiSelect.module.css";
import {
  faAngleDown,
  faCheck,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";

const MultiSelect: React.FC<MultiSelectType> = ({
  title,
  value = [],
  options = [],
  onSelect = () => null,
  className = "",
  hideIndicator = false,
  labelCentered = false,
}) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [labels, setLabels] = useState<selectOptionsType[]>([]);
  const [tempSelection, setTempSelection] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const selectAreaRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setVisibility(!visibility);
  };

  const handleSelectionToggle = (item: selectOptionsType) => {
    const isSelected = tempSelection.includes(item.value);
    const newSelection = isSelected
      ? tempSelection.filter((val) => val !== item.value)
      : [...tempSelection, item.value];

    setTempSelection(newSelection);
  };

  const closeSelectDrop = (e: MouseEvent) => {
    if (
      visibility &&
      selectAreaRef.current &&
      !selectAreaRef.current.contains(e.target as Node)
    ) {
      setVisibility(false);
      setTempSelection(value);
    }
  };

  const handleApply = () => {
    onSelect(tempSelection);
    setVisibility(false);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setTempSelection([]);
    } else {
      setTempSelection(options.map((option) => option.value));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const getLabels = () => {
      const selectedOptions = options.filter((option) =>
        value.includes(option.value)
      );
      setLabels(selectedOptions);
    };

    getLabels();
  }, [tempSelection, options]);

  useEffect(() => {
    setTempSelection(value);
  }, [value]);

  useEffect(() => {
    setSelectAll(tempSelection.length === options.length);
  }, [tempSelection]);

  useEffect(() => {
    document.addEventListener("mousedown", closeSelectDrop);

    return () => {
      document.removeEventListener("mousedown", closeSelectDrop);
    };
  }, [visibility]);

  return (
    <div className={`${style.selectArea} ${className}`} ref={selectAreaRef}>
      {title && <label>{title}</label>}
      <p
        className={`${labelCentered ? "justify-content-center" : ""}`}
        onClick={handleToggleDropdown}
      >
        <span>
          {labels.length > 0 ? (
            labels.map((item, index) => (
              <span className={style.tag} key={index}>
                <span>{item.label}</span>
              </span>
            ))
          ) : (
            <span>Select {title}</span>
          )}
        </span>
        {!hideIndicator && <FontAwesomeIcon icon={faAngleDown} />}
      </p>
      {visibility && (
        <ul className={style.selectDropdown}>
          {options.length > 0 ? (
            <>
              {options.map((item) => (
                <React.Fragment key={item.value}>
                  {!item.hidden && (
                    <li>
                      <button
                        type="button"
                        onClick={() => handleSelectionToggle(item)}
                        className={
                          tempSelection.includes(item.value)
                            ? style.selected
                            : ""
                        }
                        disabled={item.disabled}
                      >
                        <span className={style.check}>
                          {tempSelection.includes(item.value) && (
                            <FontAwesomeIcon icon={faCheck} />
                          )}
                        </span>
                        <span className={style.labelName}>{item.label}</span>
                        {item.description ? (
                          <span className={style.info}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <span>{item.description}</span>
                          </span>
                        ) : (
                          ""
                        )}
                      </button>
                    </li>
                  )}
                </React.Fragment>
              ))}
              <div className={style.footer}>
                <button
                  className={`${style.selectAll} ${
                    selectAll ? style.selectedAll : ""
                  }`}
                  type="button"
                  onClick={toggleSelectAll}
                >
                  <span className={style.trigger}></span>
                  <span>{selectAll ? "Deselect All" : "Select All"}</span>
                </button>
                <button className={style.apply} onClick={handleApply}>
                  <span>Apply</span>
                </button>
              </div>
            </>
          ) : (
            <li className={style.empty}>
              <span>No {title} found.</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
