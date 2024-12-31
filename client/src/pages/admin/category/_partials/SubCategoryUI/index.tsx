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
import {
  createSubCategoryAPI,
  getSubCategoryByIdAPI,
  updateSubCategoryAPI,
} from "@/pages/api/sub-category";
import { getCategoryAPI } from "@/pages/api/category";

type OrganizationUIType = { id?: string; isEdit?: boolean };

const SubCategoryUI: React.FC<OrganizationUIType> = ({
  id = "",
  isEdit = false,
}) => {
  const heading: DashhboardHeadingType = {
    heading: `${isEdit ? "Update" : "Add"} Category`,
    ...(isEdit
      ? {
          rightLink: {
            link: routes.admin.subCategory.add,
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
  const [subCatCode, setSubCatCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [allCategory, setAllCategory] = useState<categoryDataType[]>([]);

  const [categoryOptions, setCategoryOptions] = useState<selectOptionsType[]>([
    {
      label: "Choose Category",
      value: "_",
      hidden: true,
    },
  ]);

  const [category, setCategory] = useState<selectOptionsType>(
    categoryOptions[0]
  );
  const [categoryCode, setCategoryCode] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (id) {
      getSubCategoryByIdAPI(
        id,
        (res) => {
          setName(res.name);
          setStatus({ value: res.status, label: res.status });
          setCategory({ value: res.category, label: "" });
          setSubCatCode(res.subCatCode ? res.subCatCode : "");
          setDescription(res.description ? res.description : "");
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

    if (category.value === "_") {
      setError("Please select a category");
      return;
    }

    if (category.disabled) {
      setError("Selected category not available");
      return;
    }

    setError("");

    const payload: createSubCategoryAPIDataType = {
      name: name,
      status: status.value,
      category: category.value,
      code: categoryCode,
      subCatCode: subCatCode,
      description: description,
    };

    if (id) {
      updateSubCategoryAPI(
        id,
        payload,
        () => {
          router.push(routes.admin.subCategory.list);
        },
        (err: string) => {
          console.error(err);
        }
      );
    } else {
      createSubCategoryAPI(
        payload,
        () => {
          router.push(routes.admin.subCategory.list);
        },
        (err: string) => {
          setError(err);
        }
      );
    }
  };

  useEffect(() => {
    getCategoryAPI(
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
        setCategoryOptions(tempOptions);
        setAllCategory(categories);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  useEffect(() => {
    if (allCategory.length) {
      const selectedCategory = allCategory.find(
        (cat) => cat._id === category.value
      );
      if (selectedCategory) {
        setCategoryCode(selectedCategory.code || "");
      }
    }
  }, [category, categoryOptions]);

  return (
    <Layouts type="dashboard" pageName={heading.heading}>
      <Heading {...heading} />
      <Card>
        <form onSubmit={submitHandler}>
          <Row className="rowGap2">
            <Col md={6}>
              <Input
                label="Category Name"
                value={name}
                setValue={setName}
                required
              />
            </Col>
            <Col md={6}>
              <Select
                title="Framework Function"
                options={categoryOptions}
                value={category.value}
                onSelect={setCategory}
              />
            </Col>
            <Col md={6}>
              <Input
                label="Category Code"
                value={subCatCode}
                setValue={setSubCatCode}
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
            <Col md={12}>
              <Input
                label="Description"
                value={description}
                setValue={setDescription}
                required
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

export default SubCategoryUI;
