import Button from "@/elements/Button";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import style from "@/styles/onboarding.module.css";
import routes from "@/routes";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons/faTrashAlt";
import Input from "@/elements/Input";
import { SketchPicker } from "react-color";
import { useEffect, useState, useContext } from "react";
import { MainContext } from "@/context";
import CategoryTypeBox from "@/components/Onboarding/CategoryTypeBox";
import { useSearchParams } from "next/navigation";
import { createCategoryAPI } from "@/pages/api/category";
import BackWarningPopup from "@/popups/BackWarningPopup";

const CustomFramework = () => {
  const context = useContext(MainContext);
  const searchParams = useSearchParams();

  const [backWarningVisibility, setBackWarningVisibility] =
    useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleAddCategory = () => {
    if (categoryName.trim() !== "") {
      const framework = searchParams.get("framework");

      const code = `${categoryName.charAt(0).toUpperCase()}${categoryName
        .charAt(categoryName.length - 1)
        .toUpperCase()}`;

      if (framework) {
        createCategoryAPI(
          {
            framework: framework,
            code: code,
            colorCode: selectedColor,
            name: categoryName,
            status: "active",
            isCustom: true,
          },
          (category) => {
            if (context) {
              context.customCategory.add(category);
              setCategoryName("");
            }
          },
          (err) => {
            console.error(err);
          }
        );
      }
    }
  };

  const handleremoveCategory = (index: number) => {
    if (context) {
      context.customCategory.remove(index);
    }
  };

  return (
    <Layouts type="onboarding" pageName="Custom Framework Function">
      <Row className="rowGap6">
        <Col xs={12}>
          <Row className="align-items-center">
            <Col md={3}></Col>
            <Col md={6}>
              <AuthHeading
                heading="Custom Framework Function"
                text="These categories are part of a broader framework that also includes various subcategories"
                isCenter
              />
            </Col>
            <Col md={3}></Col>
          </Row>
        </Col>

        <Col xs={12}>
          <Row className="justify-content-center align-items-end">
            <Col md={5}>
              <Input
                label="Framework Function"
                placeholder="Framework Function Name"
                value={categoryName}
                setValue={setCategoryName}
              />
            </Col>
            <Col md={1}>
              <div className={style.colorPickerArea}>
                <div
                  className={style.colorArea}
                  style={{ background: selectedColor }}
                ></div>
                <div className={style.colorPickerDropDown}>
                  {!loading && (
                    <SketchPicker
                      color={selectedColor}
                      onChange={(color) => setSelectedColor(color.hex)}
                      disableAlpha
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        <Col
          xs={12}
          className="text-center d-flex justify-content-center gap-3"
        >
          {context && context.customCategory.value.length ? null : (
            <Button
              theme="primary-outlined-thin"
              onClick={() => setBackWarningVisibility(true)}
            >
              Back
            </Button>
          )}
          <Button onClick={handleAddCategory}>Add</Button>
        </Col>

        {context && context.customCategory.value.length ? (
          <>
            <Col xs={12}>
              <Row className="justify-content-center">
                {context.customCategory.value.map((category, categoryIndex) => (
                  <Col md={3} key={categoryIndex}>
                    <div className={style.customFrameworkBox}>
                      <CategoryTypeBox {...category} />
                      <button
                        type="button"
                        onClick={() => handleremoveCategory(categoryIndex)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>

            <Col xs={12}>
              <Row className="rowGap">
                <Col xs={12} className="text-center">
                  <div className={style.infoArea}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <span>You can select more than one Category</span>
                  </div>
                </Col>
                <Col
                  xs={12}
                  className="text-center d-flex justify-content-center gap-3"
                >
                  <Button
                    theme="primary-outlined-thin"
                    onClick={() => setBackWarningVisibility(true)}
                  >
                    Back
                  </Button>
                  <Button
                    href={`${
                      routes.onBoarding.organization.customFrameworkCategory
                    }?organization=${searchParams.get("organization")}`}
                  >
                    Next
                  </Button>
                </Col>
              </Row>
            </Col>
          </>
        ) : null}
      </Row>
      <BackWarningPopup
        visibility={backWarningVisibility}
        toggleVisibility={() => setBackWarningVisibility(false)}
      />
    </Layouts>
  );
};

export default CustomFramework;
