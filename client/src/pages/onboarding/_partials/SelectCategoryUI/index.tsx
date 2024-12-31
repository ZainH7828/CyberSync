import { MainContext } from "@/context";
import { faInfoCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import style from "@/styles/onboarding.module.css";
import Card from "@/components/Card";
import CategoryTypeBox from "@/components/Onboarding/CategoryTypeBox";
import SelectedCategoryArea from "../SelectedCategoryArea";
import { useSearchParams } from "next/navigation";
import { getSubCategoryAPI } from "@/pages/api/sub-category";
import {
  addSubCategoriesToOrgAPI,
  getSubCategoriesByOrgIdAPI,
  updateOrganizationAPI,
} from "@/pages/api/organization";
import { useRouter } from "next/router";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import Button from "@/elements/Button";
import BackWarningPopup from "@/popups/BackWarningPopup";
import Popup from "@/popups";
import popupStyle from "@/popups/Popup.module.css";
import { LoadingIcon } from "@/icons";
import {
  getSubCategoryIDAPI,
  getSubCategoryIdByOrganization,
} from "@/pages/api/sub-category-ids";
import Select from "@/elements/Select";
import MultiSelect from "@/elements/MultiSelect";
import SelectedCategoryIdsArea from "../SelectedCategoryIdsArea";

interface SelectCategoryUIType extends PopupType {
  onSuccess: () => void;
  onCustomCategory: () => void;
}

const SelectCategoryUI: React.FC<SelectCategoryUIType> = ({
  visibility = false,
  toggleVisibility = () => null,
  heading = "",
  onSuccess,
  onCustomCategory,
}) => {
  const context = useContext(MainContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = {
    label: "Select Framework Functions",
    value: "_",
    hidden: true,
  };

  const [backWarningVisibility, setBackWarningVisibility] =
    useState<boolean>(false);
  const [optionsVisibility, setOptionsVisibility] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allSubCategories, setAllSubCategories] = useState<
    subCategoryDataType[]
  >([]);
  const [filteredCategories, setFilteredCategories] = useState<
    subCategoryDataType[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingSubcategories, setIsLoadingSubcategories] =
    useState<boolean>(true);

  const [categories, setCategories] = useState<selectOptionsType[]>([
    initialCat,
  ]);
  const [selectedCategory, setSelectedCategory] =
    useState<selectOptionsType>(initialCat);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [subCategoriesIds, setSubCategoriesIds] = useState<
    subCategoryIdDataType[]
  >([]);
  const [filteredSubCategoryIds, setFilteredSubCategoryIds] = useState<
    subCategoryIdDataType[]
  >([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<
    string[]
  >([]);

  const getSubCategoryIds = () => {
    getSubCategoryIDAPI(
      (response: subCategoryIdDataType[]) => {
        setSubCategoriesIds(response);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    if (selectedSubCategories.length > 0) {
      const filteredIds = subCategoriesIds.filter((subCategoryId) =>
        selectedSubCategories.includes(subCategoryId.subCategory)
      );
      setFilteredSubCategoryIds(filteredIds);
    } else {
      setFilteredSubCategoryIds([]);
    }
  }, [selectedSubCategories, subCategoriesIds]);

  useEffect(() => {
    getSubCategoryAPI(
      (subCategories) => {
        setAllSubCategories(subCategories);
      },
      (err) => {
        console.error(err);
      }
    );
    getSubCategoryIds();
  }, []);

  useEffect(() => {
    if (context?.masterCategories) {
      const newCategories = context.masterCategories.map((category) => ({
        label: category.name,
        value: category._id,
        code: category.code,
        description: category.description,
      }));
      setCategories([initialCat, ...newCategories]);
    }
  }, [context?.masterCategories]);

  useEffect(() => {
    if (!context) return;

    if (context.organizationData.value) {
      getSubCategoriesByOrgIdAPI(
        context.organizationData.value._id,
        (subCategories) => {
          context.selectedSubCategory.set(subCategories);
          if (context?.organizationData.value) {
            getSubCategoryIdByOrganization(
              context.organizationData.value._id,
              (subCategoryIdRes) => {
                const tempData: subCategoryDataType[] = [];
                subCategoryIdRes.forEach((subCategoryId) => {
                  if (subCategoryId) {
                    console.log(subCategoryId);
                    tempData.push({
                      _id: subCategoryId._id,
                      name: subCategoryId.name,
                      category: subCategoryId.subCategory.category,
                      subCategory: subCategoryId.subCategory._id,
                      status: "active",
                      code: `${subCategoryId.subCategory.code}.${subCategoryId.subCode}`,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    });
                  }
                  context.selectedSubCategoryIds.set(tempData);
                });
                setIsLoadingSubcategories(false);
              },
              (err) => {
                console.error(err);
              }
            );
          }
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }, [context?.organizationData.value]);

  // useEffect(() => {
  //   setFilteredCategories(
  //     allSubCategories.filter(
  //       (category) =>
  //         !context?.selectedSubCategory.value.some(
  //           (selected) => selected._id === category._id
  //         )
  //     )
  //   );
  // }, [context?.selectedSubCategory.value]);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedSubCategories([]);
      setFilteredCategories(
        allSubCategories.filter(
          (subCategory) => subCategory.category === selectedCategory.value
        )
      );
    }
  }, [selectedCategory, allSubCategories]);

  useEffect(() => {
    setSelectedSubCategoryIds([]);
  }, [selectedSubCategories]);

  const selectCategoryHandler = (item: subCategoryDataType) => {
    const organization = context?.userData.value?.organization;
    if (organization) {
      addSubCategoriesToOrgAPI(
        organization,
        item._id,
        () => {
          context.selectedSubCategory.add(item);
          setSearchTerm("");
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  const addHandler = () => {
    if (context && selectedSubCategories.length > 0) {
      selectedSubCategories.forEach((subCategory) => {
        const selectedSubCategory = allSubCategories.find(
          (subCat) => subCat._id === subCategory
        );

        if (selectedSubCategory) {
          context.selectedSubCategory.add(selectedSubCategory);
        }
      });

      selectedSubCategoryIds.forEach((subCategoryId) => {
        const selectedSubCategory = subCategoriesIds.find(
          (subCat) => subCat._id === subCategoryId
        );

        if (selectedSubCategory) {
          context.selectedSubCategoryIds.add({
            _id: selectedSubCategory._id,
            name: selectedSubCategory.name,
            category: selectedCategory.value,
            subCategory: selectedSubCategory.subCategory,
            status: "active",
            code: `${selectedCategory.code}.${selectedSubCategory.subCode}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });

      setSelectedSubCategoryIds([]);
      setFilteredSubCategoryIds([]);
      setFilteredCategories([]);
      setSelectedCategory(initialCat);
      setSearchTerm("");
    }
  };

  const nextHandler = () => {
    const organization = searchParams.get("organization")
      ? searchParams.get("organization")
      : context?.userData.value?.organization;

    if (
      organization &&
      context?.selectedSubCategory.value &&
      context?.selectedSubCategory.value.length > 0
    ) {
      const categoryIds = Array.from(
        new Set(
          context.selectedSubCategory.value.map((selected) => selected._id)
        )
      );
      const subCategoryIds = Array.from(
        new Set(
          context.selectedSubCategoryIds.value.map((selected) => selected._id)
        )
      );
      const masterCategoryIds = context.masterCategories
        .filter((masterCategory) =>
          context.selectedSubCategory.value.some(
            (selectedCategory) =>
              selectedCategory.category === masterCategory._id
          )
        )
        .map((matchedCategory) => matchedCategory._id);

      updateOrganizationAPI(
        organization,
        {
          categories: masterCategoryIds,
          subCategories: categoryIds,
          subCategoriesId: subCategoryIds,
        },
        () => {
          if (onSuccess) onSuccess();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  const toggleVisibilityHandler = () => {
    nextHandler();
    toggleVisibility();
  };

  return (
    <>
    <Popup
      heading=""
      visibility={visibility}
      toggleVisibility={toggleVisibilityHandler}
      className={`${popupStyle.fullWidthPopupArea} ${
        isLoadingSubcategories ? "overflow-hidden" : ""
      }`}
    >
      {isLoadingSubcategories && (
        <div className={style.loadingArea}>
          <div className="spin">
            <LoadingIcon />
          </div>
          <p>Loading</p>
        </div>
      )}
      {/* Add scrollable container */}
      <div className={style.popupScrollableContent}>
      <Row className="rowGap6">
        <Col xs={12}>
          <Row className="align-items-center">
            <Col md={3}></Col>
            <Col md={6}>
              <AuthHeading
                heading="Select Category"
                text="These categories are part of a broader framework that also includes various subcategories"
                isCenter
              />
            </Col>
            <Col md={3} className="text-right">
              <Button onClick={onCustomCategory}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Custom Category</span>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row className="justify-content-center">
            <h2 className="text-center fs-1_25rem mb-4">Framework Functions</h2>
            {context &&
              context.masterCategories.map((category, categoryIndex) => (
                <Col md={2} key={categoryIndex}>
                  <CategoryTypeBox {...category} />
                </Col>
              ))}
          </Row>
        </Col>
        <Col xs={12}>
          <Card>
            <Row className={style.cardArea}>
              <Col md={5}>
                <Row className="rowGap">
                  <Col xs={12}>
                    <Select
                      title="Framework Functions"
                      value={selectedCategory?.value || ""}
                      options={categories}
                      onSelect={setSelectedCategory}
                    />
                  </Col>
                  {filteredCategories.length ? (
                    <Col xs={12}>
                      <MultiSelect
                        title="Categories"
                        value={selectedSubCategories}
                        options={filteredCategories.map((category) => ({
                          label: `${category.name} (${category.code}.${category.subCatCode})`,
                          value: category._id,
                          code: `${category.code}.${category.subCatCode}`,
                          description: category.description,
                        }))}
                        onSelect={setSelectedSubCategories}
                      />
                    </Col>
                  ) : null}
                  {selectedSubCategories.length ? (
                    <Col xs={12}>
                      <MultiSelect
                        title="Sub Categories"
                        value={selectedSubCategoryIds}
                        options={filteredSubCategoryIds.map((category) => ({
                          label: `${category.name} (${selectedCategory.code}.${category.subCode})`,
                          value: category._id,
                          description: category.description,
                        }))}
                        onSelect={setSelectedSubCategoryIds}
                      />
                    </Col>
                  ) : null}
                  <Col xs={12}>
                    <Button
                      onClick={addHandler}
                      isFullWitdh
                      disabled={!filteredSubCategoryIds.length}
                    >
                      <span>Add</span>
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col md={{ offset: 1, span: 6 }}>
                <SelectedCategoryIdsArea isInPopup />
              </Col>
            </Row>
          </Card>
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
                onClick={nextHandler}
                disabled={context?.selectedSubCategory.value.length === 0}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      </div>

      <BackWarningPopup
        visibility={backWarningVisibility}
        toggleVisibility={() => setBackWarningVisibility(false)}
      />
    </Popup>
    </>
  );
};

export default SelectCategoryUI;
