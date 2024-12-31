import { useContext, useState, useEffect } from "react";
import style from "../../TaskTable.module.css";
import DateTd from "../DateTd";
import StatusTd from "../StatusTd";
import { MainContext } from "@/context";
import { CreateSubTaskAPI, UpdateSubTaskAPI } from "@/pages/api/sub-task";
import AssigneesTd from "../AssigneesTd";
import { ExpandIcon } from "@/icons";

const SubTaskTr: React.FC<SubTaskTrProps> = ({
  subTask,
  color,
  taskId,
  subCategoryId,
  toggleTasksBar,
  isEditable = false,
}) => {
  const context = useContext(MainContext);

  const [subTaskName, setSubTaskName] = useState<string>(subTask.name);
  const [dueDate, setDueDate] = useState<Date>(new Date(subTask.due_date));
  const [status, setStatus] = useState(subTask.status);

  const onSave = () => {
    if (context) {
      context.userDashboard.get();
    }
  };

  const handleSubTaskSave = () => {
    if (subTaskName) {
      if (subTask._id) {
        UpdateSubTaskAPI(
          subTask._id,
          {
            taskId: taskId,
            name: subTaskName,
            due_date: dueDate,
            status: status,
            createdBy: context?.userData.value
              ? context?.userData.value?._id
              : "",
          },
          onSave,
          (err) => {
            console.log(err);
          }
        );
      } else {
        CreateSubTaskAPI(
          {
            taskId: taskId,
            name: subTaskName,
            due_date: dueDate,
            status: status,
            createdBy: context?.userData.value
              ? context?.userData.value?._id
              : "",
          },
          onSave,
          (err) => console.log(err)
        );
      }
    }
  };

  useEffect(() => {
    if (subTask._id) {
      handleSubTaskSave();
    }
  }, [status, dueDate]);

  return (
    <tr>
      <td style={{ borderLeftColor: color }}>
        <input type="checkbox" />
      </td>
      <td>
        <div className={style.taskDetailTDArea}>
          <input
            placeholder="Add subitem"
            type="text"
            value={subTaskName}
            onChange={(e) => setSubTaskName(e.target.value)}
            onBlur={
              context?.userData.value?.rights.task?.edit ||
              context?.userData.value?.rights.task?.add
                ? handleSubTaskSave
                : () => null
            }
            readOnly={!context?.userData.value?.rights.task?.edit || isEditable}
          />
          {subTask._id && !isEditable ? (
            <div
              className={style.openArea}
              onClick={() => toggleTasksBar(subTask._id, true)}
            >
              <ExpandIcon />
              <span>Open</span>
            </div>
          ) : null}
        </div>
      </td>
      <AssigneesTd
        assignees={subTask.assignees}
        subCategoryId={subCategoryId}
        taskId={subTask.taskId}
        subTaskId={subTask._id}
      />
      <DateTd date={dueDate} setDate={setDueDate} />
      <StatusTd status={status} setStatus={setStatus} />
      <td>
        {subTask.deliverables.length > 0 ? (
          <span>
            {subTask.deliverables.length} Deliverable
            {subTask.deliverables.length > 1 ? "s" : ""}
          </span>
        ) : null}
      </td>
    </tr>
  );
};

export default SubTaskTr;
