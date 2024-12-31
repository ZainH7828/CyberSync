import { getUserInitials } from "@/functions";
import style from "./AssigneesTd.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { MainContext } from "@/context";
import { fetchUserByOrganizationAndSubCatAPI } from "@/pages/api/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { UpdateTaskAPI } from "@/pages/api/task";
import { UpdateSubTaskAPI } from "@/pages/api/sub-task";

const AssigneesTd: React.FC<AssigneesTdType> = ({
  assignees = [],
  subCategoryId,
  taskId,
  subTaskId,
}) => {
  const context = useContext(MainContext);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedAssignees, setSelectedAssignees] =
    useState<{ _id: string; name: string }[]>(assignees);

  const [allUsersInSubCategory, setAllUsersInSubCategory] = useState<
    userResponseDataType[]
  >([]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [openedFirstTime, setOpenedFirstTime] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (context && context.organizationData.value && dropdownVisible) {
      fetchUserByOrganizationAndSubCatAPI(
        {
          organizationId: context.organizationData.value._id,
          subCategoryId: subCategoryId,
        },
        (users) => {
          setAllUsersInSubCategory(users);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, [subCategoryId, dropdownVisible]);

  useEffect(() => {
    if (!dropdownVisible && openedFirstTime) {
      updateTaskHandler();
    }
  }, [selectedAssignees, dropdownVisible, openedFirstTime]);

  const updateTaskHandler = () => {
    if (subTaskId) {
      UpdateSubTaskAPI(
        subTaskId,
        {
          taskId: taskId,
          assignees: selectedAssignees.map((assignee) => assignee._id),
        },
        () => {
          if (context) {
            context.userDashboard.get();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      UpdateTaskAPI(
        taskId,
        {
          assignees: selectedAssignees.map((assignee) => assignee._id),
        },
        () => {
          if (context) {
            context.userDashboard.get();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownVisible &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  const handleDropdownToggle = () => {
    if (
      context?.userData.value?.rights.task?.edit ||
      context?.userData.value?.rights.task?.add
    ) {
      setDropdownVisible((prev) => !prev);
      if (!openedFirstTime) {
        setOpenedFirstTime(true);
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleUserClick = (user: { _id: string; name: string }) => {
    setSelectedAssignees((prev) => [...prev, user]);
  };

  const handleRemoveAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.filter((assignee) => assignee._id !== userId)
    );
  };

  const filteredUsers = allUsersInSubCategory.filter((user) =>
    user.name.toLowerCase().includes(searchQuery)
  );

  const availableUsers = filteredUsers.filter(
    (user) => !selectedAssignees.some((assignee) => assignee._id === user._id)
  );

  return (
    <td>
      <div className={style.assigneesContainer}>
        <ul onClick={handleDropdownToggle}>
          {selectedAssignees.length > 0 ? (
            <>
              {selectedAssignees.slice(0, 2).map((item, index) => (
                <li key={index}>
                  <div className={style.imgArea}>
                    <span>{getUserInitials(item.name)}</span>
                  </div>
                </li>
              ))}
              {selectedAssignees.length > 2 && (
                <li key="more">
                  <div className={style.imgArea}>
                    <span>+{selectedAssignees.length - 2}</span>
                  </div>
                </li>
              )}
            </>
          ) : (
            <>
              <li key="more">
                <div className={style.imgArea}>
                  <span>+</span>
                </div>
              </li>
            </>
          )}
        </ul>
        {dropdownVisible && (
          <div className={style.assigneesDropdown} ref={dropdownRef}>
            {selectedAssignees.length > 0 && (
              <ul className={style.selectedAssigneesArea}>
                {selectedAssignees.map((item, index) => (
                  <li key={index}>
                    <div className={style.imgArea}>
                      <span>{getUserInitials(item.name)}</span>
                    </div>
                    <span>{item.name}</span>
                    <button
                      className={style.removeButton}
                      onClick={() => handleRemoveAssignee(item._id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className={style.searchArea}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className={style.suggestedUsers}>
              <ul>
                {availableUsers.length > 0 ? (
                  availableUsers.map((user, index) => (
                    <li key={index} onClick={() => handleUserClick(user)}>
                      <div className={style.imgArea}>
                        <span>{getUserInitials(user.name)}</span>
                      </div>
                      <span>{user.name}</span>
                    </li>
                  ))
                ) : (
                  <li>
                    <p>No user found</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </td>
  );
};

export default AssigneesTd;
