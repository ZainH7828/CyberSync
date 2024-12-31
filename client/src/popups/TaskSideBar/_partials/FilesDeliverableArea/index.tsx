import FileIcon from "@/components/FileIcon";
import style from "./FilesDeliverableArea.module.css";
import { DownloadIcon } from "@/icons/sideBar";
import { DeleteIcon } from "@/icons";
import { useContext } from "react";
import { MainContext } from "@/context";
import { deleteTaskFileAPI } from "@/pages/api/task";

type FilesDeliverableAreaType = {
  taskId?: string;
  isSubtask: boolean;
  type?: "files" | "deliver";
  files:
    | {
        name: string;
        path: string;
        destination: string;
      }[]
    | undefined;
  onSuccess: () => void;
};

const FilesDeliverableArea: React.FC<FilesDeliverableAreaType> = ({
  files = [],
  type = "files",
  taskId,
  isSubtask,
  onSuccess,
}) => {
  const context = useContext(MainContext);

  const deleteHandler = (fileName: string) => {
    if (taskId) {
      deleteTaskFileAPI(
        taskId,
        fileName,
        type,
        isSubtask,
        () => {
          onSuccess();
        },
        () => {}
      );
    }
  };

  const downloadHandler = (filePath: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {files.length > 0 ? (
        <div className={style.fileDeliverableArea}>
          <h3>{type === "files" ? "Attached Files" : "Deliverables"}</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <div className={style.detailArea}>
                  <FileIcon file={file.name} />
                </div>
                <div className={style.controlsArea}>
                  <button
                    type="button"
                    onClick={() => downloadHandler(file.path, file.name)}
                  >
                    <DownloadIcon />
                  </button>
                  {context?.userData.value?.rights.task?.edit && (
                    <button
                      type="button"
                      className={style.danger}
                      onClick={() => deleteHandler(file.name)}
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default FilesDeliverableArea;
