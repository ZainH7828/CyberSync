import Button from "@/elements/Button";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import style from "@/styles/onboarding.module.css";
import Card from "@/components/Card";
import routes from "@/routes";
import Input from "@/elements/Input";
import Select from "@/elements/Select";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "@/context";
import CategoryTypeBox from "@/components/Onboarding/CategoryTypeBox";
// import SelectedCategoryArea from "../SelectedCategoryArea";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { createSubCategoryAPI } from "@/pages/api/sub-category";
import {
  addSubCategoriesToOrgAPI,
  updateOrganizationAPI,
} from "@/pages/api/organization";
import SelectedCategoryIdsArea from "../SelectedCategoryIdsArea";
import { createSubCategoryIDAPI } from "@/pages/api/sub-category-ids";
import Error from "@/elements/Error";

const CustomCategoryUI: React.FC<CustomCategoryUIType> = ({
  isFrameWorkCustom = false,
  isPopup = false,
  onSuccess,
}) => {
  const context = useContext(MainContext);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [categoryName, setCategoryName] = useState<string>("");
  const [categoriesOptions, setCategoriesOptions] = useState<
    selectOptionsType[]
  >([
    {
      label: "Select Framework Function",
      value: "_",
      hidden: true,
    },
  ]);
  const [selectedCategoryType, setSelectedCategoryType] =
    useState<selectOptionsType>(categoriesOptions[0]);

  const [error, setError] = useState<string>("");

  const [categoryAdded, setCategoryAdded] = useState<boolean>(false);
  const [subCategoryName, setSubCategoryName] = useState<string>("");
  const [subCategoryDescription, setSubCategoryDescription] =
    useState<string>("");
  const [categoryFilled, setCategoryFilled] = useState<
    subCategoryDataType | undefined
  >(undefined);

  useEffect(() => {
    const categoriesData =
      isFrameWorkCustom && context && context.customCategory.value.length
        ? context.customCategory.value
        : context?.masterCategories;

    const customCategories =
      categoriesData &&
      categoriesData.map((category) => ({
        label: category.name,
        value: category.code,
      }));

    const categoryTemp: selectOptionsType[] = [
      {
        label: "Select Framework Function",
        value: "_",
        hidden: true,
      },
      ...(customCategories ? customCategories : []),
    ];

    setCategoriesOptions(categoryTemp);
  }, [context, isFrameWorkCustom]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategoryType.value || selectedCategoryType.value === "_") {
      setError("Please select a category");
      return;
    }

    if (context && categoryName && selectedCategoryType.value !== "_") {
      setError("");
      const categoriesData =
        isFrameWorkCustom && context && context.customCategory.value.length
          ? context.customCategory.value
          : context?.masterCategories;

      const matchingCategory = categoriesData.find(
        (cat) => cat.code === selectedCategoryType.value
      );

      const organization = searchParams.get("organization")
        ? searchParams.get("organization")
        : context?.userData.value?.organization;
      if (matchingCategory && organization) {
        if (!categoryAdded) {
          createSubCategoryAPI(
            {
              name: categoryName,
              category: matchingCategory._id,
              code: matchingCategory.code,
              organization: organization,
              isCustom: true,
              status: "active",
            },
            (subCat) => {
              context.selectedSubCategory.add(subCat);
              setCategoryAdded(true);
              setCategoryFilled(subCat);
              if (isPopup) {
                addSubCategoriesToOrgAPI(
                  organization,
                  subCat._id,
                  () => { },
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
        } else {
          if (categoryFilled) {
            const payload: createSubCategoryIdAPIDataType = {
              name: subCategoryName,
              status: "active",
              subCategory: categoryFilled._id,
              subCode: categoryFilled.code,
              description: subCategoryDescription,
              isCustom: true,
            };

            createSubCategoryIDAPI(
              payload,
              (data) => {
                context.selectedSubCategoryIds.add({
                  _id: data._id,
                  name: data.name,
                  category: matchingCategory._id,
                  subCategory: data.subCategory,
                  status: "active",
                  code: "",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
                setCategoryAdded(false);
                setCategoryFilled(undefined);
                setCategoryName("");
                setSubCategoryName("");
                setSubCategoryDescription("");
                setSelectedCategoryType(categoriesOptions[0]);
              },
              (err: string) => { }
            );
          }
        }
      }
    }
  };

  const nextBtnHandler = () => {
    const organization = searchParams.get("organization");
    if (organization) {
      if (pathname.startsWith(routes.onBoarding.organization.customCategory)) {
        router.push(
          `${routes.onBoarding.organization.selectCategory}?organization=${organization}`
        );
      } else {
        const organization = searchParams.get("organization")
          ? searchParams.get("organization")
          : context?.userData.value?.organization;
        if (
          organization &&
          context &&
          context?.selectedSubCategory.value.length > 0
        ) {
          const categoryIds = context.selectedSubCategory.value.map(
            (selected) => selected._id
          );

          const subCategoryIds = Array.from(
            new Set(
              context.selectedSubCategoryIds.value.map(
                (selected) => selected._id
              )
            )
          );

          const masterCategoryIds = context.customCategory.value
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
              if (isPopup && onSuccess) {
                onSuccess();
              } else {
                router.push(
                  `${routes.onBoarding.organization.inviteTeamMembers}?organization=${organization}`
                );
              }
            },
            (err) => {
              console.error(err);
            }
          );
        }
      }
    } else {
      if (isPopup && onSuccess) {
        onSuccess();
      }
    }
  };

  return (
      //Add scrollable container
      <div className={style.popupScrollableContent}>
        <Layouts type="onboarding" pageName="Custom Category">
          <Row className="rowGap6">
            <Col xs={12}>
              <Row className="align-items-center">
                <Col md={3}></Col>
                <Col md={6}>
                  <AuthHeading
                    heading="Custom Category"
                    text="These categories are part of a broader framework that also includes various subcategories"
                    isCenter
                  />
                </Col>
                <Col md={3} className="text-right"></Col>
              </Row>
            </Col>
            {isFrameWorkCustom && context && context.customCategory.value.length ? (
              <Col xs={12}>
                <Row className="justify-content-center">
                  <h2 className="text-center fs-1_25rem mb-4">
                    Framework Functions
                  </h2>
                  {context.customCategory.value.map((category, categoryIndex) => (
                    <Col md={3} key={categoryIndex}>
                      <CategoryTypeBox {...category} />
                    </Col>
                  ))}
                </Row>
              </Col>
            ) : null}

            <Col xs={12}>
              <Card>
                <Row className={style.cardArea}>
                  <Col md={5}>
                    <form onSubmit={handleAddCategory}>
                      <Row className="rowGap">
                        <Col xs={12}>
                          <Select
                            title="Framework Functions"
                            options={categoriesOptions}
                            value={selectedCategoryType.value}
                            onSelect={setSelectedCategoryType}
                          />
                        </Col>
                        <Col xs={12}>
                          <Input
                            label="Category Name"
                            placeholder="Enter Category Name"
                            value={categoryName}
                            setValue={setCategoryName}
                            required
                          />
                        </Col>
                        {categoryAdded && (
                          <>
                            <Col xs={12}>
                              <Input
                                label="Sub Category Name"
                                placeholder="Enter Sub Category Name"
                                value={subCategoryName}
                                setValue={setSubCategoryName}
                                required
                              />
                            </Col>
                            <Col xs={12}>
                              <Input
                                label="Description"
                                placeholder="Enter Sub Category Description"
                                value={subCategoryDescription}
                                setValue={setSubCategoryDescription}
                                required
                              />
                            </Col>
                          </>
                        )}
                        {error ? <Error error={error} /> : null}
                        <Col xs={12}>
                          <div className="submitArea m-0">
                            <Button type="submit" isFullWitdh>
                              <span>Add</span>
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </form>
                  </Col>
                  <Col
                    md={{
                      offset: 1,
                      span: 6,
                    }}
                  >
                    <SelectedCategoryIdsArea isInPopup={isPopup} />
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={12}>
              <Row className="rowGap">
                <Col xs={12} className="text-center">
                  <div className={style.infoArea}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <span>You can add more than one Category</span>
                  </div>
                </Col>
                <Col xs={12} className="text-center">
                  {!isPopup && (
                    <Button
                      theme="primary-light"
                      onClick={() => router.back()}
                      className="me-3"
                    >
                      <span>Back</span>
                    </Button>
                  )}
                  <Button onClick={nextBtnHandler}>Next</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Layouts>
      </div>
  );
};

export default CustomCategoryUI;
