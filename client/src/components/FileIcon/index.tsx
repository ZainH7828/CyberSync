import {
  faFileCircleXmark,
  faFileImage,
  faFilePdf,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileIcon: React.FC<{ file: string; fileSize?: number }> = ({
  file,
  fileSize = 0,
}) => {
  const fileExt = file ? file.split(".").pop() : "";

  let icon;
  let message;

  switch (fileExt) {
    case "pdf":
      icon = faFilePdf;
      break;
    case "docx":
    case "doc":
      icon = faFileWord;
      break;
    case "jpg":
    case "png":
    case "jpeg":
    case "gif":
      icon = faFileImage;
      break;
    default:
      icon = faFileCircleXmark;
      message = `${fileExt} not supported`;
      break;
  }

  // Convert file size to a readable format
  const formatFileSize = (size: number) => {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${
      ["B", "KB", "MB", "GB", "TB"][i]
    }`;
  };

  return (
    <>
      <FontAwesomeIcon icon={icon} />
      <h3 className="mt-3">{message ? message : file}</h3>
      {fileSize ? <p className="mt-1">{formatFileSize(fileSize)}</p> : null}
    </>
  );
};

export default FileIcon;
