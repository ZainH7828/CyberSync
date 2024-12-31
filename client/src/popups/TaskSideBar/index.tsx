import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faTimes,
  faUsers,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Button from "@/elements/Button";
import { DashboardIcon } from "@/icons/sideBar";
import RecurringTaskPopup from "../RecurringTaskPopup";
import style from "./TaskSideBar.module.css";
import routes from "@/routes";
import { GetTaskByIdAPI, UpdateTaskAPI } from "@/pages/api/task";
import Input from "@/elements/Input";
import { MainContext } from "@/context";
import { getTaskActivityAPI } from "@/pages/api/activity-log";
import { formatDistanceToNow } from "date-fns";
import { getUserInitials } from "@/functions";
import { createCommentAPI, getCommentsByTaskId } from "@/pages/api/comments";
import { GetSubTaskByIdAPI, UpdateSubTaskAPI } from "@/pages/api/sub-task";
import UploadPopup from "../UploadPopup";
import FilesDeliverableArea from "./_partials/FilesDeliverableArea";

type selectedTabType = "detail" | "activity";

interface TaskSideBarType {
  taskId: string;
  visibility: boolean;
  toggleVisibility: (taskId: string) => void;
  isSubtask?: boolean;
}

const TaskSideBar: React.FC<TaskSideBarType> = ({
  taskId = "",
  visibility = false,
  toggleVisibility = (taskId: string) => null,
  isSubtask = false,
}) => {
  const context = useContext(MainContext);

  const [tabSelected, setTabSelected] = useState<selectedTabType>("detail");
  const [taskData, setTaskData] = useState<dashboardApiTaskDataType>();
  const [subTaskData, setSubTaskData] = useState<subTaskApiResponseType>();
  const [recurringTaskVisibility, setRecurringTaskVisibility] =
    useState<boolean>(false);
  const [isRecurringTask, setIsRecurringTask] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [taskDesc, setTaskDesc] = useState<string>("");

  const recurringTaskVisibilityToggle = () =>
    setRecurringTaskVisibility((prev) => !prev);

  const handleRecurringTaskChange = () => {
    if (!isRecurringTask) {
      setRecurringTaskVisibility(true);
    } else {
      setIsRecurringTask(false);
    }
  };

  const recurringTaskHandler = () => {
    setIsRecurringTask(true);
    setRecurringTaskVisibility(false);
  };

  const onTaskCloseHandler = () => {
    setTaskName("");
    setTaskDesc("");
    toggleVisibility("");
    setAllComments([]);
    setUserMessage("");
    setActityLog([]);
    if (isSubtask) {
      setSubTaskData(undefined);
    } else {
      setTaskData(undefined);
    }
  };

  const getTaskData = () => {
    if (isSubtask) {
      GetSubTaskByIdAPI(
        taskId,
        (task) => {
          setSubTaskData(task);
          setTaskName(task.name ? task.name : "");
          setTaskDesc(task.desc ? task.desc : "");
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      GetTaskByIdAPI(
        taskId,
        (task) => {
          setTaskData(task);
          setTaskName(task.name ? task.name : "");
          setTaskDesc(task.desc ? task.desc : "");
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskData();
    }
  }, [taskId, isSubtask]);

  const onUpdateHandler = () => {
    if (taskName) {
      if (subTaskData && isSubtask) {
        UpdateSubTaskAPI(
          subTaskData._id,
          {
            taskId: subTaskData.taskId,
            name: taskName,
            desc: taskDesc,
          },
          () => {
            if (context) {
              context.userDashboard.get();
            }
            onTaskCloseHandler();
          },
          (err) => {
            console.log(err);
          }
        );
      } else if (taskData) {
        UpdateTaskAPI(
          taskData._id,
          {
            name: taskName,
            desc: taskDesc,
          },
          () => {
            if (context) {
              context.userDashboard.get();
            }
            onTaskCloseHandler();
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
  };

  const [activityLog, setActityLog] = useState<ActivityLogResponseType[]>([]);

  useEffect(() => {
    if (tabSelected === "activity" && taskId) {
      getTaskActivityAPI(
        taskId,
        (activity) => {
          setActityLog(activity);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, [tabSelected, taskId]);

  const [userMessage, setUserMessage] = useState<string>("");
  const [allComments, setAllComments] = useState<taskCommentResponseType[]>([]);

  const getComments = () => {
    if (taskId) {
      getCommentsByTaskId(
        taskId,
        (comments) => {
          setAllComments(comments);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      setAllComments([]);
    }
  };

  useEffect(() => {
    getComments();
  }, [taskId]);

  const [commentSubmiting, setCommentSubmitting] = useState<boolean>(false);

  const onCommentSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentSubmitting(true);

    if (context && context.userData.value) {
      const user = context.userData.value;
      createCommentAPI(
        {
          taskID: taskId,
          createdBy: user._id,
          comment: userMessage,
        },
        () => {
          getComments();
          if (userMessage) {
            setUserMessage("");
          }
          setCommentSubmitting(false);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  const [uploadFileVisibility, setUploadFileVisibility] =
    useState<boolean>(false);
  const [uploadFileType, setUploadFileType] = useState<"files" | "deliver">(
    "files"
  );

  const uploadPopupHandler = (isDeliver?: boolean) => {
    setUploadFileVisibility(true);
    setUploadFileType(isDeliver ? "deliver" : "files");
  };

  const refetchDataHandler = () => {
    if (context) {
      context.userDashboard.get();
    }
    getTaskData();
  };

  return (
    <>
      <div
        className={`${style.sideBarBg} ${visibility ? style.show : ""}`}
        onClick={onTaskCloseHandler}
      ></div>
      <div className={`${style.sideBarArea} ${visibility ? style.show : ""}`}>
        <div className={style.closeArea}>
          <button type="button" onClick={onTaskCloseHandler}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={style.body}>
          <div className={style.tabArea}>
            <button
              type="button"
              onClick={() => setTabSelected("detail")}
              className={tabSelected === "detail" ? style.active : ""}
            >
              <DashboardIcon />
              <span>Updates</span>
            </button>
            <button
              type="button"
              onClick={() => setTabSelected("activity")}
              className={tabSelected === "activity" ? style.active : ""}
            >
              <FontAwesomeIcon icon={faClock} />
              <span>Activity Log</span>
            </button>

            {context?.userData.value?.rights.manageTeam && (
              <div className={style.linkArea}>
                <Link href={routes.users.teamMembers}>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>Invite Users</span>
                </Link>
              </div>
            )}
          </div>
          {tabSelected === "detail" && (
            <div className={style.detailArea}>
              <Input
                placeholder="Task Name"
                value={taskName}
                setValue={setTaskName}
                disabled={!context?.userData.value?.rights.task?.edit}
                required
              />
              <textarea
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Task Description"
                disabled={!context?.userData.value?.rights.task?.edit}
              ></textarea>
              {context?.userData.value?.rights.task?.edit && (
                <>
                  {!isSubtask && (
                    <div
                      className={style.recurringTaskArea}
                      onClick={handleRecurringTaskChange}
                    >
                      <p>Recurring Task</p>
                      <label className={style.switch}>
                        <input
                          type="checkbox"
                          checked={isRecurringTask}
                          onChange={handleRecurringTaskChange}
                        />
                        <span className={style.slider}></span>
                      </label>
                    </div>
                  )}
                  <div className={style.btnArea}>
                    <Button
                      theme="primary-outlined-thin"
                      onClick={uploadPopupHandler}
                    >
                      <FontAwesomeIcon icon={faPaperclip} />
                      <span>Attach Files</span>
                    </Button>
                    <div className={style.btnGroup}>
                      <Button
                        theme="primary-outlined-thin"
                        onClick={() => uploadPopupHandler(true)}
                      >
                        <span>Attach Deliverable</span>
                      </Button>
                      <Button theme="primary" onClick={onUpdateHandler}>
                        <span>Update</span>
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {taskData?.files || subTaskData?.files ? (
                <FilesDeliverableArea
                  taskId={!isSubtask ? taskId : subTaskData?._id}
                  files={!isSubtask ? taskData?.files : subTaskData?.files}
                  isSubtask={isSubtask}
                  onSuccess={refetchDataHandler}
                />
              ) : null}
              {taskData?.deliverables || subTaskData?.deliverables ? (
                <FilesDeliverableArea
                  taskId={!isSubtask ? taskId : subTaskData?._id}
                  files={
                    !isSubtask
                      ? taskData?.deliverables
                      : subTaskData?.deliverables
                  }
                  type="deliver"
                  isSubtask={isSubtask}
                  onSuccess={refetchDataHandler}
                />
              ) : null}
            </div>
          )}
          {tabSelected === "activity" && (
            <div className={style.activityArea}>
              <table>
                <tbody>
                  {activityLog.map((activity, index) => (
                    <tr key={index}>
                      <td>
                        <div className={style.activityTd}>
                          <FontAwesomeIcon icon={faClock} />
                          <span>
                            {formatDistanceToNow(new Date(activity.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={style.activityTd}>
                          {/* <img
                            src="/assets/images/users/default.jpg"
                            alt="user"
                          /> */}
                          <div className={style.imgArea}>
                            <span title={activity.createdBy.name}>
                              {getUserInitials(activity.createdBy.name)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span>{activity.type}</span>
                      </td>
                      <td>
                        <span>{activity.activity}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {tabSelected === "detail" && (
          <div className={style.foot}>
            {allComments.length > 0 ? (
              <div className={style.allCommentArea}>
                {allComments.map((comment, index) => (
                  <div className={style.singleComment} key={index}>
                    <div className={style.head}>
                      <div className={style.userDetail}>
                        <div className={style.imgArea}>
                          <span>{getUserInitials(comment.createdBy.name)}</span>
                        </div>
                        <span>{comment.createdBy.name}</span>
                      </div>
                      <span>
                        {formatDistanceToNow(comment.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className={style.body}>
                      <span>{comment.comment}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <form
              className={style.commentArea}
              onSubmit={onCommentSubmitHandler}
            >
              <div className={style.imgArea}>
                <span>{getUserInitials(context?.userData.value?.name)}</span>
              </div>
              <input
                type="text"
                placeholder="Send Your Message"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={commentSubmiting || userMessage === ""}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        )}
      </div>
      <UploadPopup
        visibility={uploadFileVisibility}
        toggleVisibility={() => setUploadFileVisibility(false)}
        heading={
          uploadFileType === "deliver" ? "Upload Deliverable" : "Upload File"
        }
        uploadType={uploadFileType}
        taskId={!isSubtask ? taskId : subTaskData?._id}
        onSuccess={refetchDataHandler}
        isSubtask={isSubtask}
      />
      <RecurringTaskPopup
        visibility={recurringTaskVisibility}
        toggleVisibility={recurringTaskVisibilityToggle}
        onSuccess={recurringTaskHandler}
        overflowAuto
      />
    </>
  );
};

export default TaskSideBar;
