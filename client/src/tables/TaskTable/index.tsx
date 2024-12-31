import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faAngleDown,
  faAngleRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import style from "./TaskTable.module.css";
import { useContext, useEffect, useState } from "react";
import { EditIcon } from "@/icons";
import TaskRow from "./_partials/TaskRow";
import { MainContext } from "@/context";
import { updateSubCategoryAPI } from "@/pages/api/sub-category";
import SubCategoryIdPopup from "@/popups/SubCategoryIdPopup";
import { getSubCategoryIDBySubIdOrganizationAPI } from "@/pages/api/sub-category-ids";

interface TaskTableType extends dashboardApiSubCategoryDataType {
  color: string;
  toggleTasksBar: (taskId: string, isSubTask?: boolean) => void;
  isEditable?: boolean;
  isCategoryPage?: boolean;
}

const TaskTable: React.FC<TaskTableType> = ({
  _id,
  color,
  name,
  code,
  tasks = [],
  toggleTasksBar,
  isEditable = false,
  isCategoryPage = false,
}) => {
  const context = useContext(MainContext);

  const [allChecked, setAllChecked] = useState(false);
  const [taskList, setTaskList] = useState<dashboardApiTaskDataType[]>(tasks);
  const [taskChecks, setTaskChecks] = useState(tasks.map(() => false));
  const [tableVisibility, setTableVisibility] = useState<boolean>(true);

  const tableHeadings = [
    "Task Name",
    "Participant",
    "Due Date",
    "Status",
    "Progress",
    "Priority" , 
    "Deliverable",
  ];

  useEffect(() => {
    setAllChecked(taskChecks.every(Boolean));
  }, [taskChecks]);

  useEffect(() => {
    setTaskList(tasks);
    setTaskChecks(tasks.map(() => false));
  }, [tasks]);

  const handleHeaderCheckboxChange = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setTaskChecks(taskChecks.map(() => newCheckedState));
  };

  const handleTaskCheckboxChange = (index: number) => {
    const newTaskChecks = [...taskChecks];
    newTaskChecks[index] = !newTaskChecks[index];
    setTaskChecks(newTaskChecks);
  };

  const [showSubCatIdPopup, setShowSubCatIdPopup] = useState<boolean>(false);
  const [subCatIds, setSubCatIds] = useState<subCategoryIdDataType[]>([]);

  const handleAddTask = (data: subCategoryIdDataType) => {
    const newTask: dashboardApiTaskDataType = {
      subCategory: _id,
      _id: "",
      name: "",
      desc: "",
      assignees: [],
      createdBy: "",
      due_date: new Date(),
      priority: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "",
      subCategoriesId: data,
      files: [],
      deliverables: [],
      subTasks: [],
    };
    setTaskList([...taskList, newTask]);
    setTaskChecks([...taskChecks, false]);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");

  const UpdateCustomCategoryHandler = () => {
    updateSubCategoryAPI(
      _id,
      { code: code, name: editingName },
      () => {
        if (context) {
          context.userDashboard.get();
        }
        setIsEditing(false);
      },
      (err) => console.log(err)
    );
  };

  const editHandler = () => {
    if (isEditing) {
      UpdateCustomCategoryHandler();
    } else {
      setIsEditing(true);
      setEditingName(name);
    }
  };

  const onAddHandler = () => {
    if (context?.organizationData.value) {
      getSubCategoryIDBySubIdOrganizationAPI(
        _id,
        context.organizationData.value._id,
        (data) => {
          setSubCatIds(data);
          setShowSubCatIdPopup(true);
        },
        (err) => console.log(err)
      );
    }
  };

  return (
    <div className={style.catTableArea}>
      <div className={style.head} style={{ color: color }}>
        <FontAwesomeIcon
          icon={tableVisibility ? faAngleDown : faAngleRight}
          onClick={() => setTableVisibility(!tableVisibility)}
        />
        {!isEditing ? (
          <h3>{name}</h3>
        ) : (
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
        )}
        {isEditable ? (
          <button type="button" onClick={editHandler}>
            {isEditing ? <FontAwesomeIcon icon={faCheck} /> : <EditIcon />}
          </button>
        ) : null}
      </div>
      {tableVisibility && (
        <div className={style.body}>
          <table>
            <thead>
              <tr>
                <th
                  style={{ borderLeftColor: color }}
                  className={style.smallTd}
                >
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleHeaderCheckboxChange}
                  />
                </th>
                {tableHeadings.map((tableHead, tableHeadIndex) => (
                  <th key={tableHeadIndex}>{tableHead}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {taskList.map((taskData, taskIndex) => (
                <TaskRow
                  code={code}
                  subCategoryId={_id}
                  rowCount={tableHeadings.length + 1}
                  color={color}
                  task={taskData}
                  checked={taskChecks[taskIndex]}
                  onCheck={() => handleTaskCheckboxChange(taskIndex)}
                  toggleTasksBar={toggleTasksBar}
                  key={taskIndex}
                  isEditable={isEditable}
                  isCategoryPage={isCategoryPage}
                />
              ))}
              {context?.userData.value?.rights.task?.add && !isCategoryPage && (
                <tr>
                  <td
                    className={`${style.addTaskBtnTd} cursor-pointer`}
                    style={{ borderLeftColor: `${color}90` }}
                    colSpan={tableHeadings.length + 1}
                    onClick={onAddHandler}
                  >
                    <button type="button" className={style.addTaskBtn}>
                      <FontAwesomeIcon icon={faAdd} />
                      <span>Add Item</span>
                    </button>
                  </td>
                </tr>
              )}
              {(!context?.userData.value?.rights.task?.add || isCategoryPage) &&
                taskList.length < 1 && (
                  <tr>
                    <td
                      className={`${style.addTaskBtnTd} cursor-pointer`}
                      style={{ borderLeftColor: `${color}90` }}
                      colSpan={tableHeadings.length + 1}
                    >
                      <button type="button" className={style.addTaskBtn}>
                        <span>No Item Added</span>
                      </button>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      )}

      <SubCategoryIdPopup
        subCatIds={subCatIds}
        code={code}
        visibility={showSubCatIdPopup}
        toggleVisibility={() => setShowSubCatIdPopup(false)}
        color={color}
        onSuccess={handleAddTask}
      />
    </div>
  );
};

export default TaskTable;
