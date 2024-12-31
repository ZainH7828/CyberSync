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
import style from "@/styles/onboarding.module.css";
import {
  createCategoryAPI,
  getCategoryByIdAPI,
  updateCategoryAPI,
} from "@/pages/api/category";
import { getFrameworkAPI } from "@/pages/api/framework";
import { SketchPicker } from "react-color";

type OrganizationUIType = { id?: string; isEdit?: boolean };

const CategoryUI: React.FC<OrganizationUIType> = ({
  id = "",
  isEdit = false,
}) => {
  const heading: DashhboardHeadingType = {
    heading: `${isEdit ? "Update" : "Add"} Framework Functions`,
    ...(isEdit
      ? {
          rightLink: {
            link: routes.admin.framework.add,
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
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [frameworkOptions, setFrameworkOptions] = useState<selectOptionsType[]>(
    [
      {
        label: "Choose Framework",
        value: "_",
        hidden: true,
      },
    ]
  );

  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  const [framework, setFramework] = useState<selectOptionsType>(
    frameworkOptions[0]
  );

  const router = useRouter();

  useEffect(() => {
    if (id) {
      getCategoryByIdAPI(
        id,
        (res) => {
          setName(res.name);
          setStatus({ value: res.status, label: res.status });
          setFramework({ value: res.framework, label: "" });
          setCode(res.code);
          setSelectedColor(res.colorCode);
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

    if (framework.value === "_") {
      setError("Please select a framework");
      return;
    }

    if (framework.disabled) {
      setError("Selected framework not available");
      return;
    }

    setError("");

    if (id) {
      updateCategoryAPI(
        id,
        {
          name: name,
          status: status.value,
          framework: framework.value,
          code: code.toUpperCase(),
          colorCode: selectedColor,
        },
        () => {
          router.push(routes.admin.category.list);
        },
        (err: string) => {
          console.error(err);
        }
      );
    } else {
      createCategoryAPI(
        {
          name: name,
          status: status.value,
          framework: framework.value,
          code: code.toUpperCase(),
          colorCode: selectedColor,
        },
        () => {
          router.push(routes.admin.category.list);
        },
        (err: string) => {
          setError(err);
        }
      );
    }
  };

  useEffect(() => {
    getFrameworkAPI(
      (framework) => {
        const tempOptions: selectOptionsType[] = framework.map((framework) => ({
          label: `${framework.name}${
            framework.status !== "active" ? " (Coming Soon)" : ""
          }`,
          value: framework._id,
          disabled: framework.status !== "active",
        }));
        tempOptions.unshift({
          label: "Choose Framework",
          value: "_",
          hidden: true,
        });
        setFrameworkOptions(tempOptions);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  return (
    <Layouts type="dashboard" pageName={heading.heading}>
      <Heading {...heading} />
      <Card>
        <form onSubmit={submitHandler}>
          <Row className="rowGap2">
            <Col md={6}>
              <Input
                label="Framework Functions Name"
                value={name}
                setValue={setName}
                required
              />
            </Col>
            <Col md={6}>
              <Input label="Code" value={code} setValue={setCode} required />
            </Col>
            <Col md={6}>
              <Select
                title="Select Framework"
                options={frameworkOptions}
                value={framework.value}
                onSelect={setFramework}
              />
            </Col>
            <Col md={6}>
              <div className={style.colorPickerArea}>
                <label>Color Code</label>
                <div
                  className={style.colorArea}
                  style={{ background: selectedColor }}
                ></div>
                <div className={style.colorPickerDropDown}>
                  <SketchPicker
                    color={selectedColor}
                    onChange={(color) => setSelectedColor(color.hex)}
                    disableAlpha
                  />
                </div>
              </div>
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

export default CategoryUI;
