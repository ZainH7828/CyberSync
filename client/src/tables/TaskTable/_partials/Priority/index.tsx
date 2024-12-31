import React, { useEffect, useRef, useState } from "react";
import style from "./NumberDropdown.module.css"; 
const PriorityData: React.FC<{ number: number; setNumber: (newNumber: number) => void }> = ({ number, setNumber }) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const numberTdArea = useRef<HTMLTableCellElement>(null);

  const handleNumberChange = (newNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();  
    setNumber(newNumber); 
    setTimeout(() => {
      setDropdownVisible(false);  
    }, 50);
  };

  const closeDropdown = (e: MouseEvent) => {
    if (
      dropdownVisible &&
      numberTdArea.current &&
      !numberTdArea.current.contains(e.target as Node)
    ) {
      setDropdownVisible(false); 
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown); 
    };
  }, [dropdownVisible]);

  return (
    <td
    
      className={style.numberTd}
      onClick={() => setDropdownVisible(true)}  
      ref={numberTdArea}
    >
      <div className={style.numberArea}>{number}</div> 
      {dropdownVisible && (
        <ul className={style.dropdown}>
          {Array.from({ length: 10 }, (_, i) => i+1).map((num) => (
            <li
              key={num}
              onClick={(e) => handleNumberChange(num, e)}  
              className={style.dropdownItem}
            >
              {num}
            </li>
          ))}
        </ul>
      )}
    </td>
  );
};

export default PriorityData;
