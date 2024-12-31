import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  // faSearch,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";
import Card from "@/components/Card";
import Select from "@/elements/Select";
import MultiSelect from "@/elements/MultiSelect";
// import SelectedCategoryArea from "../_partials/SelectedCategoryArea";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import Button from "@/elements/Button";
import BackWarningPopup from "@/popups/BackWarningPopup";
import { getSubCategoryAPI } from "@/pages/api/sub-category";
import { updateOrganizationAPI } from "@/pages/api/organization";
import CategoryTypeBox from "@/components/Onboarding/CategoryTypeBox";
import routes from "@/routes";
import style from "@/styles/onboarding.module.css";
import { MainContext } from "@/context";
import { getSubCategoryIDAPI } from "@/pages/api/sub-category-ids";
import SelectedCategoryIdsArea from "../_partials/SelectedCategoryIdsArea";

const SelectCategory = () => {
  const context = useContext(MainContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat: selectOptionsType = {
    label: "Select Framwork Functions",
    value: "_",
    hidden: true,
  };

  const [backWarningVisibility, setBackWarningVisibility] =
    useState<boolean>(false);
  const [allSubCategories, setAllSubCategories] = useState<
    subCategoryDataType[]
  >([]);

  const [filteredCategories, setFilteredCategories] = useState<
    subCategoryDataType[]
  >([]);
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

  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<
    string[]
  >([]);

  const [filteredSubCategoryIds, setFilteredSubCategoryIds] = useState<
    subCategoryIdDataType[]
  >([]);

  const getSubCategoryIds = () => {
    getSubCategoryIDAPI(
      (response: subCategoryIdDataType[]) => {
        setSubCategoriesIds(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    if (selectedSubCategories.length > 0) {
      const filteredSubCategoryIds = subCategoriesIds.filter((subCategoryId) =>
        selectedSubCategories.includes(subCategoryId.subCategory)
      );

      setFilteredSubCategoryIds(filteredSubCategoryIds);
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
        console.log(err);
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
    }
  };

  const nextHandler = () => {
    const organization = searchParams.get("organization");
    if (
      organization &&
      context?.selectedSubCategory &&
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
          router.push(
            `${routes.onBoarding.organization.inviteTeamMembers}?organization=${organization}`
          );
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  return (
    <Layouts type="onboarding" pageName="Select Category">
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
              <Button
                href={`${
                  routes.onBoarding.organization.customCategory
                }?organization=${searchParams.get("organization")}`}
              >
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
                          label: category.name,
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
              <Col
                md={{
                  offset: 1,
                  span: 6,
                }}
              >
                <SelectedCategoryIdsArea />
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
                theme="primary-outlined-thin"
                onClick={() => setBackWarningVisibility(true)}
              >
                Back
              </Button>
              <Button
                onClick={nextHandler}
                disabled={
                  context && context.selectedSubCategoryIds.value.length
                    ? false
                    : true
                }
              >
                Next
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <BackWarningPopup
        visibility={backWarningVisibility}
        toggleVisibility={() => setBackWarningVisibility(false)}
      />
    </Layouts>
  );
};

export default SelectCategory;
