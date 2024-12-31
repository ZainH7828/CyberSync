import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import style from "@/styles/table.module.css";
import { formatRolesTile } from "@/functions";
import Select from "@/elements/Select";
import Input from "@/elements/Input";

const SimpleTable: React.FC<simpleTablePropsType> = ({
  headings,
  keys,
  data,
  showSno = false,
  showActions = false,
  actionComponents = [],
  dataPerPage = 10,
  overflowVisible = false,
  categoryData,
  setScoreState,
  noteEditable = false,
}) => {
  const [currentPageData, setCurrentPageData] = useState<any[]>([]);
  const [pagination, setPagination] = useState(0);
  const [paginationCount, setPaginationCount] = useState(0);

  useEffect(() => {
    const totalPagination = Math.ceil(data.length / dataPerPage);
    setPaginationCount(totalPagination);
  }, [data, dataPerPage]);

  useEffect(() => {
    setCurrentPageData(
      data.slice(pagination * dataPerPage, (pagination + 1) * dataPerPage)
    );
  }, [data, pagination, dataPerPage]);

  const handlePreviousPage = () => {
    setPagination((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setPagination((prev) => Math.min(prev + 1, paginationCount - 1));
  };

  const handlePageSelect = (page: number) => {
    setPagination(page);
  };

  const scoreData: selectOptionsType[] = [
    {
      value: "1",
      label: "1",
    },
    {
      value: "2",
      label: "2",
    },
    {
      value: "3",
      label: "3",
    },
    {
      value: "4",
      label: "4",
    },
    {
      value: "5",
      label: "5",
    },
  ];

  const targetScoreSelectHandler = (item: selectOptionsType, index: number) => {
    if (categoryData && setScoreState) {
      const tempData = [...categoryData];
      tempData[index].targetScore = parseInt(item.value);
      setScoreState(tempData);
    }
  };

  const scoreSelectHandler = (item: selectOptionsType, index: number) => {
    if (categoryData && setScoreState) {
      const tempData = [...categoryData];
      tempData[index].score = parseInt(item.value);
      setScoreState(tempData);
    }
  };

  const inputHandler = (value: string, index: number) => {
    if (categoryData && setScoreState) {
      const tempData = [...categoryData];
      tempData[index].note = value;
      setScoreState(tempData);
    }
  };

  return (
    <div className={style.tableListsContainer}>
      <div
        className={`${style.tableListsArea} ${
          currentPageData.length > 4 && !overflowVisible ? style.overHidden : ""
        }`}
      >
        <table className={style.tableLists}>
          <thead>
            <tr>
              {showSno && <th className={style.smallTd}>SNO</th>}
              {headings.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
              {showActions && <th className={style.smallTd}></th>}
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, index) => (
              <tr key={index}>
                {showSno && (
                  <td className="text-center">
                    {pagination * dataPerPage + index + 1}
                  </td>
                )}
                {keys.map((key, idx) => (
                  <td key={idx}>
                    {(() => {
                      if (key === "status") {
                        return (
                          <span
                            className={`${style.badge} ${
                              item[key] === "active"
                                ? style.success
                                : style.danger
                            }`}
                          >
                            {item[key] === "active" ? "Active" : "Inactive"}
                          </span>
                        );
                      }

                      if (key === "licensePeriod") {
                        return (
                          <span className={`${style.badge} ${style.success}`}>
                            {item[key]}
                          </span>
                        );
                      }

                      if (key === "role") {
                        return formatRolesTile(item[key]);
                      }

                      if (key === "score") {
                        return categoryData ? (
                          <Select
                            value={item[key]}
                            onSelect={(item: selectOptionsType) =>
                              scoreSelectHandler(item, index)
                            }
                            options={scoreData}
                          />
                        ) : (
                          item[key]
                        );
                      }

                      // if (key === "targetScore") {
                      //   return categoryData ? (
                      //     <Select
                      //       value={item[key]}
                      //       onSelect={(item: selectOptionsType) =>
                      //         targetScoreSelectHandler(item, index)
                      //       }
                      //       options={scoreData}
                      //     />
                      //   ) : (
                      //     item[key]
                      //   );
                      // }

                      if (key === "note") {
                        return categoryData ? (
                          <Input
                            value={item[key]}
                            onChange={(value) => inputHandler(value, index)}
                          />
                        ) : (
                          item[key]
                        );
                      }

                      return item[key];
                    })()}
                  </td>
                ))}
                {showActions && (
                  <td className={style.actionsTd}>
                    <div className={style.actionsArea}>
                      <button type="button">
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                      <ul>
                        {actionComponents.map((ActionComponent, idx) => (
                          <li key={idx}>
                            <ActionComponent item={item} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginationCount > 1 && (
        <div className={style.paginationArea}>
          <button onClick={handlePreviousPage} disabled={pagination === 0}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          {Array.from({ length: paginationCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageSelect(index)}
              className={pagination === index ? style.active : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={pagination === paginationCount - 1}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleTable;
