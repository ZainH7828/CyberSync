import Heading from "@/components/Dashboard/Heading";
import Layouts from "@/layouts";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import TaskTable from "@/tables/TaskTable";
import { CategoryIcon } from "@/icons/sideBar";
import { MainContext } from "@/context";
import SelectCategoryUI from "../onboarding/_partials/SelectCategoryUI";
import Popup from "@/popups";
import CustomCategoryUI from "../onboarding/_partials/CustomCategoryUI";
import popupStyle from "@/popups/Popup.module.css";
import { getFrameworkByIdAPI } from "../api/framework";
import CustomFrameworkUI from "../onboarding/_partials/CustomFrameworkUI";

const CategoriesTask = () => {
  const context = useContext(MainContext);

  const [taskPopupVisible, setTaskPopupVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [orgIdCustom, setOrgIsCustom] = useState<boolean>(false);

  const toggleTaskVisibility = () => {
    setTaskPopupVisible(!taskPopupVisible);
  };

  const addNewCatHandler = () => {
    if (
      context &&
      context.organizationData.value &&
      context.organizationData.value.framework
    ) {
      setLoading(true);
      getFrameworkByIdAPI(
        context.organizationData.value.framework,
        (framework) => {
          if (framework.isCustom) {
            setAddCustomMasterCategoryPopupVisibility(true);
            setOrgIsCustom(true);
          } else {
            setAddCategoryPopupVisibility(true);
            setOrgIsCustom(false);
          }

          setLoading(false);
        },
        (err) => {
          console.log(err);
          setLoading(false);
        }
      );
    }
  };

  const heading = {
    heading: "Categories & Task",
    icon: <CategoryIcon />,
    ...(context?.userData.value?.rights.category?.add && {
      rightLink: {
        title: "Add New Category",
        icon: faPlus,
        disabled: loading,
        onClick: addNewCatHandler,
      },
    }),
  };

  const [addCategoryPopupVisibility, setAddCategoryPopupVisibility] =
    useState(false);
  const [
    addCustomMasterCategoryPopupVisibility,
    setAddCustomMasterCategoryPopupVisibility,
  ] = useState(false);
  const [
    addCustomCategoryPopupVisibility,
    setAddCustomCategoryPopupVisibility,
  ] = useState(false);

  const onCategorySuccess = () => {
    if (context) {
      context.userDashboard.get();
    }
    setAddCategoryPopupVisibility(false);
  };

  const onCustomHandler = () => {
    setAddCustomCategoryPopupVisibility(true);
    if (orgIdCustom) {
      setAddCustomMasterCategoryPopupVisibility(false);
    } else {
      setAddCategoryPopupVisibility(false);
    }
  };

  const onCustomCategorySuccess = () => {
    setAddCustomCategoryPopupVisibility(false);
    if (orgIdCustom) {
      if (context) {
        context.userDashboard.get();
      }
    } else {
      setAddCategoryPopupVisibility(true);
    }
  };

  return (
    <Layouts type="dashboard" pageName="Categories & Task">
      <Heading {...heading} />
      <Row className="rowGap3">
        {context?.userDashboard.data?.categories.map((catItem, catIndex) => (
          <Col xs={12} key={catIndex}>
            <Row className="rowGap3">
              {catItem.subCategory.map((subCatItem, subCatIndex) => (
                <Col xs={12} key={subCatIndex}>
                  <TaskTable
                    {...subCatItem}
                    color={catItem.colorCode}
                    toggleTasksBar={toggleTaskVisibility}
                    isEditable={
                      context.userData.value?.rights.category?.edit &&
                      subCatItem.isCustom
                    }
                    isCategoryPage
                  />
                </Col>
              ))}
            </Row>
          </Col>
        ))}
      </Row>
      {addCategoryPopupVisibility && (
        <SelectCategoryUI
          visibility={addCategoryPopupVisibility}
          toggleVisibility={() => setAddCategoryPopupVisibility(false)}
          heading=""
          onSuccess={onCategorySuccess}
          onCustomCategory={onCustomHandler}
        />
      )}
      {addCustomMasterCategoryPopupVisibility && (
        <CustomFrameworkUI
          visibility={addCustomMasterCategoryPopupVisibility}
          toggleVisibility={() =>
            setAddCustomMasterCategoryPopupVisibility(false)
          }
          heading=""
          onSuccess={onCustomHandler}
        />
      )}
      <Popup
        visibility={addCustomCategoryPopupVisibility}
        toggleVisibility={onCustomCategorySuccess}
        heading=""
        className={popupStyle.fullWidthPopupArea}
      >
        <CustomCategoryUI
          isPopup
          onSuccess={onCustomCategorySuccess}
          isFrameWorkCustom={orgIdCustom}
        />
      </Popup>
    </Layouts>
  );
};

export default CategoriesTask;
