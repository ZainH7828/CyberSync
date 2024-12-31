import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Col, Row } from "react-bootstrap";
import Card from "@/components/Card";
import Heading from "@/components/Dashboard/Heading";
import Button from "@/elements/Button";
import Input from "@/elements/Input";
import Select from "@/elements/Select";
import Layouts from "@/layouts";
import routes from "@/routes";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Error from "@/elements/Error";
import { getSubCategoryAPI } from "@/pages/api/sub-category";
import {
  createSubCategoryIDAPI,
  getSubCategoryIDByIdAPI,
  updateSubCategoryIDAPI,
} from "@/pages/api/sub-category-ids";

type OrganizationUIType = { id?: string; isEdit?: boolean };

const SubCategoryIdUI: React.FC<OrganizationUIType> = ({
  id = "",
  isEdit = false,
}) => {
  const heading: DashhboardHeadingType = {
    heading: `${isEdit ? "Update" : "Add"} Sub Category`,
    ...(isEdit
      ? {
          rightLink: {
            link: routes.admin.subCategoryIds.add,
            title: "Add New",
            icon: faPlus,
          },
        }
      : {}),
  };

  const options: selectOptionsType[] = [
    {
      label: "Choose Status",
      value: "_",
      hidden: true,
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

  // States
  const [status, setStatus] = useState<selectOptionsType>(options[0]);
  const [name, setName] = useState<string>("");
  const [subCatDescription, setSubCatDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [allSubCategory, setAllSubCategory] = useState<subCategoryDataType[]>(
    []
  );

  const [subCategoryOptions, setSubCategoryOptions] = useState<
    selectOptionsType[]
  >([
    {
      label: "Choose Category",
      value: "_",
      hidden: true,
    },
  ]);

  const [subCategory, setSubCategory] = useState<selectOptionsType>(
    subCategoryOptions[0]
  );
  const [categoryCode, setCategoryCode] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (id) {
      getSubCategoryIDByIdAPI(
        id,
        (res) => {
          setName(res.name);
          setStatus({ value: res.status, label: res.status });
          setSubCategory({ value: res.subCategory, label: "" });
          setSubCatDescription(res.description ? res.description : "");
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, [id]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.value === "_") {
      setError("Please Select Status");
      return;
    }

    if (subCategory.value === "_") {
      setError("Please select a category");
      return;
    }

    if (subCategory.disabled) {
      setError("Selected category not available");
      return;
    }

    setError("");

    const payload: createSubCategoryIdAPIDataType = {
      name: name,
      status: status.value,
      subCategory: subCategory.value,
      subCode: categoryCode,
      description: subCatDescription,
    };

    if (id) {
      updateSubCategoryIDAPI(
        id,
        payload,
        () => {
          router.push(routes.admin.subCategoryIds.list);
        },
        (err: string) => {
          console.error(err);
        }
      );
    } else {
      createSubCategoryIDAPI(
        payload,
        () => {
          router.push(routes.admin.subCategoryIds.list);
        },
        (err: string) => {
          setError(err);
        }
      );
    }
  };

  useEffect(() => {
    getSubCategoryAPI(
      (categories) => {
        const tempOptions: selectOptionsType[] = categories.map((category) => ({
          label: `${category.name}${
            category.status !== "active" ? " (Coming Soon)" : ""
          }`,
          value: category._id,
          code: category.code,
          disabled: category.status !== "active",
        }));
        tempOptions.unshift({
          label: "Choose Category",
          value: "_",
          hidden: true,
        });
        setSubCategoryOptions(tempOptions);
        setAllSubCategory(categories);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  useEffect(() => {
    if (allSubCategory.length) {
      const selectedCategory = allSubCategory.find(
        (cat) => cat._id === subCategory.value
      );
      if (selectedCategory) {
        setCategoryCode(selectedCategory.subCatCode || "");
      }
    }
  }, [subCategory, subCategoryOptions]);

  return (
    <Layouts type="dashboard" pageName={heading.heading}>
      <Heading {...heading} />
      <Card>
        <form onSubmit={submitHandler}>
          <Row className="rowGap2">
            <Col md={6}>
              <Input
                label="Sub Category"
                value={name}
                setValue={setName}
                required
              />
            </Col>
            <Col md={6}>
              <Select
                title="Sub Category"
                options={subCategoryOptions}
                value={subCategory.value}
                onSelect={setSubCategory}
              />
            </Col>
            <Col md={12}>
              <Input
                label="Sub Category Description"
                value={subCatDescription}
                setValue={setSubCatDescription}
                required
              />
            </Col>
            <Col md={6}>
              <Select
                title="Status"
                options={options}
                value={status.value}
                onSelect={setStatus}
              />
            </Col>
            {error ? (
              <Col xs={12} className="text-right">
                <Error error={error} />
              </Col>
            ) : null}
            <Col xs={12} className="text-right">
              <Button type="submit">{isEdit ? "Save Changes" : "Add"}</Button>
            </Col>
          </Row>
        </form>
      </Card>
    </Layouts>
  );
};

export default SubCategoryIdUI;
