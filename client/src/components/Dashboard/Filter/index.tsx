import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Filter.module.css";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";

const Filter: React.FC<FilterProps> = ({ data, onFilterChange }) => {
  const [query, setQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<selectOptionsType>();
  const [filterVisibility, setFilterVisibility] = useState<boolean>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  useEffect(() => {
    let filteredData = [...data];

    if (query) {
      filteredData = filteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.email && item.email.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (sortOption?.value === "az") {
      filteredData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption?.value === "za") {
      filteredData.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption?.value === "latest") {
      filteredData.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else if (sortOption?.value === "oldest") {
      filteredData.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    }

    onFilterChange(filteredData);
  }, [query, sortOption, data, onFilterChange]);

  const filterOptions = [
    {
      label: "Filter by A to Z",
      value: "az",
    },
    {
      label: "Filter by Z to A",
      value: "za",
    },
    {
      label: "Newest to Oldest",
      value: "latest",
    },
    {
      label: "Oldest to Newest",
      value: "oldest",
    },
    {
      label: "Clear All",
      value: "",
    },
  ];

  const optionsHandler = (option: selectOptionsType) => {
    setSortOption(option);
    setFilterVisibility(false);
  };

  return (
    <div className={style.filterArea}>
      <div className={style.inputArea}>
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search by name or email"
          value={query}
          onChange={handleInputChange}
        />
      </div>
      <div className={style.filterBtn}>
        <button
          type="button"
          className={`${sortOption?.value ? style.active : null}`}
          onClick={() => setFilterVisibility(!filterVisibility)}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>
            Filter{" "}
            <span>{sortOption?.value ? `| ${sortOption?.label}` : null}</span>
          </span>
        </button>
        {filterVisibility && (
          <ul className={style.filterDropDown}>
            {filterOptions.map((option, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => optionsHandler(option)}
                  className={`${
                    option.value === sortOption?.value && option.value !== ""
                      ? style.active
                      : ""
                  } ${option.value === "" ? style.danger : ""}`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Filter;
