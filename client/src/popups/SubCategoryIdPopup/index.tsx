import { Col, Row } from "react-bootstrap";
import Popup from "..";
import style from "./SubCategoryIdPopup.module.css";
import { useState } from "react";
import Button from "@/elements/Button";

const SubCategoryIdPopup: React.FC<subCategoryIdPopupType> = ({
  heading,
  onSuccess,
  visibility,
  toggleVisibility,
  code,
  color,
  subCatIds = [],
}) => {
  const [selectedId, setSelectedId] = useState<subCategoryIdDataType>();

  const popupData: PopupType = {
    visibility: visibility,
    toggleVisibility: toggleVisibility,
    className: style.subCategoryPopup,
    heading: "Choose Sub Category",
  };

  const handelSelection = (data: subCategoryIdDataType) => {
    setSelectedId(data);
  };

  const handleSuccess = () => {
    if (onSuccess) {
      if (selectedId) {
        onSuccess(selectedId);
      }
    }
    toggleVisibility();
  };

  return (
    <Popup {...popupData}>
      <div className={style.body}>
        <Row className="rowGap2">
          {subCatIds.length > 0 ? (
            <>
              {subCatIds.map((option, index) => {
                const codeName = `${code}.${option.subCode} ${option.name}`;
                return (
                  <Col md={3} xs={6} key={index}>
                    <label className={style.labelArea}>
                      <input
                        type="radio"
                        name="subCategoryId"
                        value={option._id}
                        checked={selectedId?._id === option._id}
                        onChange={() => handelSelection(option)}
                      />
                      <span>{option.name}</span>
                    </label>
                  </Col>
                );
              })}
            </>
          ) : (
            <p className="opaque">No Sub Category Assigned</p>
          )}
        </Row>
      </div>
      {subCatIds.length > 0 ? (
        <div className={style.foot}>
          <Button theme="primary" isFullWitdh onClick={handleSuccess}>
            <span>Create Task</span>
          </Button>
        </div>
      ) : null}
    </Popup>
  );
};

export default SubCategoryIdPopup;
