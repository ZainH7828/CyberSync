import Button from "@/elements/Button";
import Popup from "..";
import style from "../Popup.module.css";
import { useContext } from "react";
import { MainContext } from "@/context";
import { useRouter } from "next/router";
import routes from "@/routes";

const BackWarningPopup: React.FC<recurringTaskPopupType> = ({
  visibility = false,
  toggleVisibility = () => null,
}) => {
  const router = useRouter();
  const context = useContext(MainContext);

  const popupData: PopupType = {
    visibility: visibility,
    toggleVisibility: toggleVisibility,
    className: style.reportPopup,
    heading: "Warning: Framework Data Loss",
    detail:
      "If you leave this page, all data will be lost, and nothing will be saved or assigned, Are you sure you want to leave?",
  };

  const onSuccess = () => {
    if (context) {
      const catLength = context.selectedSubCategory.value.length;
      for (let i = catLength - 1; i >= 0; i--) {
        context.selectedSubCategory.remove(i);
      }
      const customMasterCatLength = context.customCategory.value.length;
      for (let i = customMasterCatLength - 1; i >= 0; i--) {
        context.customCategory.remove(i);
      }
      const subCatIdLength = context.selectedSubCategoryIds.value.length;
      for (let i = subCatIdLength - 1; i >= 0; i--) {
        context.selectedSubCategoryIds.remove(i);
      }
    }

    const { organization } = router.query;
    router.push(
      `${routes.onBoarding.organization.selectFramework}?organization=${organization}`
    );
    toggleVisibility();
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

export default BackWarningPopup;
