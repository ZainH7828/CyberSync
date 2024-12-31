import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Error.module.css";

const Error = ({ error = "" }) => {
  return (
    <div className={style.errorArea}>
      <FontAwesomeIcon icon={faInfoCircle} />
      <span>{error}</span>
    </div>
  );
};

export default Error;
