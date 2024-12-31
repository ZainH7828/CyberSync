import React, { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import Button from "@/elements/Button";
import Popup from "../";
import style from "../Popup.module.css";
import { WelldoneIcon } from "@/icons/dashboard";
import { PictureIcon } from "@/icons";
import { UploadTaskFileAPI } from "@/pages/api/task";
import FileIcon from "@/components/FileIcon";
import Error from "@/elements/Error";

const MAX_SIZE = 5242880;

const UploadPopup: React.FC<uploadPopupType> = ({
  visibility = false,
  toggleVisibility = () => null,
  onSuccess = () => null,
  overflowAuto = false,
  heading = "Upload File",
  uploadType = "files",
  taskId,
  isSubtask = false
}) => {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const popupData: PopupType = {
    visibility: visibility,
    toggleVisibility: toggleVisibility,
    className: style.deletePopup,
    heading: heading,
    overflowAuto: overflowAuto,
  };

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > MAX_SIZE) {
        setError("Max 5MB allowed");
      } else {
        if (error) {
          setError("");
        }
        setFile(selectedFile);
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "image/gif": [".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: MAX_SIZE,
  });

  const saveHandler = () => {
    if (file && taskId) {
      setLoading(true);
      UploadTaskFileAPI(
        taskId,
        file,
        uploadType,
        isSubtask,
        () => {
          onSuccess();
          toggleVisibility();
          setLoading(false);
        },
        (err) => {
          console.log(err);
          setLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    if (!visibility) {
      setTimeout(() => {
        setError("");
        setFile(null);
        setLoading(false);
      }, 300);
    }
  }, [visibility]);

  return (
    <Popup {...popupData}>
      <div className={style.welldoneArea}>
        {uploadType === "deliver" && (
          <>
            <WelldoneIcon />
            <h3>Welldone!</h3>
          </>
        )}
        <div className={style.uploadArea} {...getRootProps()}>
          <input {...getInputProps()} />
          {file ? (
            <FileIcon file={file.name} fileSize={file.size} />
          ) : (
            <>
              <PictureIcon />
              <h3>
                <span>Upload a file</span> or drag and drop
              </h3>
              <p>PNG, JPG, GIF, PDF, DOC, DOCX up to 5MB</p>
            </>
          )}
        </div>
        {error ? <Error error={error} /> : null}
      </div>
      <div className={style.popupBtns}>
        <Button onClick={saveHandler} disabled={!file || loading}>
          Upload
        </Button>
      </div>
    </Popup>
  );
};

export default UploadPopup;
