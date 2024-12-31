import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Popup.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Popup: React.FC<PopupType> = ({
  visibility = false,
  toggleVisibility = () => null,
  children,
  className = "",
  heading,
  detail,
  overflowAuto = false,
}) => {
  return (
    <>
      <div
        className={`${style.popupBg} ${visibility ? style.show : ""}`}
        onClick={toggleVisibility}
      ></div>
      <div
        className={`${style.popupArea} ${
          visibility ? style.show : ""
        } ${className} ${overflowAuto ? style.overflowAuto : ""}`}
      >
        <div className={style.closeBtnArea}>
          <button type="button" onClick={toggleVisibility}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={style.detailArea}>
          {heading && <h3>{heading}</h3>}
          {detail ? <p>{detail}</p> : null}
          {children}
        </div>
      </div>
    </>
  );
};

export default Popup;
