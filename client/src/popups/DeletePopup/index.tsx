import Button from "@/elements/Button";
import Popup from "../";
import style from "../Popup.module.css";

const DeletePopup: React.FC<deletePopupType> = ({
  data,
  visibility = false,
  toggleVisibility = () => null,
  onSuccess = () => null,
}) => {
  const popupData: PopupType = {
    visibility: visibility,
    toggleVisibility: toggleVisibility,
    className: style.deletePopup,
    heading: `Are you sure you want to delete ${
      data ? data.name : "this item"
    }?`,
    detail: `If you delete it, you will remove access to this ${
      data && data.deleteType ? data.deleteType.toLowerCase() : "item"
    }`,
  };

  return (
    <Popup {...popupData}>
      <div className={style.popupBtns}>
        <Button theme="primary-light" onClick={toggleVisibility}>
          No
        </Button>
        <Button onClick={onSuccess}>Yes</Button>
      </div>
    </Popup>
  );
};

export default DeletePopup;
