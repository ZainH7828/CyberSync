import { useContext, useEffect, useState } from "react";
import style from "../../TaskTable.module.css";
import DateTd from "../DateTd";
import ProcessTd from "../ProcessTd";
import StatusTd from "../StatusTd";
import { ExpandIcon } from "@/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { CreateTaskAPI, UpdateTaskAPI } from "@/pages/api/task";
import { MainContext } from "@/context";
import SubTaskTr from "../SubTaskTr";
import AssigneesTd from "../AssigneesTd";
import PriorityData from "../Priority";

const TaskRow: React.FC<TaskTdType> = ({
  code,
  isEditable = false,
  subCategoryId,
  rowCount = 0,
  color,
  task,
  checked = false,
  onCheck,
  toggleTasksBar,
  isCategoryPage = false,
}) => {
  const context = useContext(MainContext);
  const [selectedpriority, setSelectedPriority] = useState<number>(0);
  const [taskName, setTaskName] = useState<string>(task.name);
  const [subItems, setSubItems] = useState<subTaskApiResponseType[]>(
    task.subTasks
  );

  const [dateSelected, setDateSelected] = useState<Date>(
    new Date(task.due_date)
  );
  const [status, setStatus] = useState(task.status);

  const [subTaskVisibility, setSubTaskVisibility] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };
 

  const handleAddItem = () => {
    setSubItems([
      ...subItems,
      {
        _id: "",
        taskId: task._id,
        name: "",
        desc: "",
        files: [],
        deliverables: [],
        createdBy:
          context && context.userData.value ? context.userData.value?._id : "",
        due_date: new Date(),
        status: "",
        assignees: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  };

  const subItemTableHeadings = [
    "Subitem",
    "Participant",
    "Due Date",
    "Status",
    "Deliverable",
  ];

  const toggleSubTaskVisibility = () => {
    setSubTaskVisibility(!subTaskVisibility);
  };

  const taskUpdateHandler = () => {
    if (
      taskName &&
      (taskName !== task.name ||
        status !== task.status ||
        dateSelected !== task.due_date || selectedpriority !== task.priority)
    ) {
      UpdateTaskAPI(
        task._id,
        {
          subCategory: subCategoryId,
          name: taskName,
          createdBy: context?.userData.value
            ? context?.userData.value?._id
            : "",
          due_date: dateSelected,
          status: status,
          priority: selectedpriority,
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

  const taskAddHandler = () => {
    if (taskName && taskName !== task.name) {
      CreateTaskAPI(
        {
          subCategory: subCategoryId,
          name: taskName,
          subCategoriesId: task.subCategoriesId?._id,
          createdBy: context?.userData.value
            ? context?.userData.value?._id
            : "",
          due_date: dateSelected,
          status: status,
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

  const handleTaskSave = () => {
    if (task._id) {
      taskUpdateHandler();
    } else {
      taskAddHandler();
    }
  };

  const getProgress = () => {
    if (task.subTasks.length > 0) {
      let totalPecent = 0;
  //Starting Bubble Changes 
      for (let i = 0; i < task.subTasks.length; i++) {
        if (task.subTasks[i].status === "in-progress") {
          totalPecent += 50 / task.subTasks.length;
        } else if (task.subTasks[i].status === "done") {
          totalPecent += 100 / task.subTasks.length;
        } else if (task.subTasks[i].status === "behind-schedule"){  
          totalPecent += 30 / task.subTasks.length;
        } else if (task.subTasks[i].status === "not-started"){
          totalPecent = 0 / task.subTasks.length;
        }
      }
      return totalPecent;
    
    } else {
      if (task.status === "in-progress") {
        return 50;
      } else if (task.status === "done") {
        return 100;
      }
        else if(task.status === "behind-schedule"){
          return 30; 
        }
        else if(task.status === "not-started"){
          return 0; 
        }
        else{
          return 0;
        }
    }
    //End

    return 0;
  };

  useEffect(() => {
    if (task._id) {
      handleTaskSave();
    }
  }, [status, dateSelected, selectedpriority]);

  useEffect(() => {
    if (task.subTasks) {
      setSubItems(task.subTasks);
    }
  }, [task.subTasks]);

  const onTaskRowClickHandler = () => {
    if (context) {
      context.taskHoveredAt.set(task._id);
    }
  };

  return (
    <>
      <tr onClick={onTaskRowClickHandler}>
        <td style={{ borderLeftColor: color }}>
          <input type="checkbox" checked={checked} onChange={() => onCheck()} />
        </td>
        <td>
          <div className={style.taskDetailTDArea}>
            <button
              type="button"
              onClick={isCategoryPage ? () => null : toggleSubTaskVisibility}
              className={`${subTaskVisibility ? style.active : ""} ${subItems.length > 0 ? style.hasItems : ""
                } ${isCategoryPage && subItems.length < 1 ? style.hidden : ""}`}
            >
              <FontAwesomeIcon
                icon={
                  subItems.length > 0 || subTaskVisibility
                    ? faAngleRight
                    : faAdd
                }
              />
            </button>
            <input
              placeholder="Add item"
              type="text"
              value={taskName}
              onChange={handleInputChange}
              onBlur={
                context?.userData.value?.rights.task?.edit ||
                  context?.userData.value?.rights.task?.add
                  ? handleTaskSave
                  : () => null
              }
              readOnly={
                !context?.userData.value?.rights.task?.edit || isCategoryPage
              }
            />
           
            {subItems.length > 0 ? (
              <span className={style.subItemCount}>{subItems.length}</span>
            ) : null}
            {task.subCategoriesId ? (
              <div className={style.badgeArea}>{task.subCategoriesId.name}</div>
            ) : null}
            {task._id && !isEditable && !isCategoryPage ? (
              <div
              
                className={style.openArea}
                onClick={() => toggleTasksBar(task._id)}
              >
                <ExpandIcon />
                <span>Open</span>
              </div>
            ) : null}
          </div>


        </td>
        <AssigneesTd
          assignees={task.assignees}
          subCategoryId={subCategoryId}
          taskId={task._id}
        />
        <DateTd date={dateSelected} setDate={setDateSelected} />
        <StatusTd status={status} setStatus={setStatus} />
        <ProcessTd color={color} progress={getProgress()} />
       <PriorityData number={task?.priority} setNumber={setSelectedPriority} />
        

        <td className={style.deliverables}>
          {task.deliverables.length > 0 ? (
            <span>
              {task.deliverables.length} Deliverable
              {task.deliverables.length > 1 ? "s" : ""}
            </span>
          ) : null}
        </td>
      </tr>
      {subTaskVisibility ? (
        <tr>
          <td
            className={style.subItemTd}
            colSpan={rowCount}
            style={{ borderLeftColor: color }}
          >
            <table className={style.subItemTable}>
              <thead>
                <tr>
                  <th
                    style={{ borderLeftColor: color }}
                    className={style.smallTd}
                  >
                    <input type="checkbox" />
                  </th>
                  {subItemTableHeadings.map((tableHead, tableHeadIndex) => (
                    <th key={tableHeadIndex}>{tableHead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subItems.map((subItem, index) => (
                  <SubTaskTr
                    key={index}
                    subTask={subItem}
                    subCategoryId={subCategoryId}
                    color={color}
                    taskId={task._id}
                    toggleTasksBar={toggleTasksBar}
                    isEditable={isEditable || isCategoryPage}
                  />
                ))}
                {context?.userData.value?.rights.task?.add &&
                  !isCategoryPage && (
                    <tr>
                      <td
                        className={`${style.addTaskBtnTd} cusor-pointer`}
                        style={{ borderLeftColor: `${color}90` }}
                        colSpan={subItemTableHeadings.length + 1}
                        onClick={handleAddItem}
                      >
                        <button type="button" className={style.addTaskBtn}>
                          <FontAwesomeIcon icon={faAdd} />
                          <span>Add subitem</span>
                        </button>
                      </td>
                    </tr>
                  )}
                {(!context?.userData.value?.rights.task?.add ||
                  isCategoryPage) &&
                  subItems.length < 1 && (
                    <tr>
                      <td
                        className={`${style.addTaskBtnTd} cursor-pointer`}
                        style={{ borderLeftColor: `${color}90` }}
                        colSpan={subItemTableHeadings.length + 1}
                      >
                        <button type="button" className={style.addTaskBtn}>
                          <span>No subitem Added</span>
                        </button>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </td>
        </tr>
      ) : null}
    </>
  );
};

export default TaskRow;
