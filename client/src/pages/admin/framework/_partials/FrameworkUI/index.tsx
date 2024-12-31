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
  createFrameworkAPI,
  getFrameworkByIdAPI,
  updateFrameworkAPI,
} from "@/pages/api/framework";
import { getModuleAPI } from "@/pages/api/modules";

type OrganizationUIType = { id?: string; isEdit?: boolean };

const FrameworkUI: React.FC<OrganizationUIType> = ({
  id = "",
  isEdit = false,
}) => {
  const heading: DashhboardHeadingType = {
    heading: `${isEdit ? "Update" : "Add"} Framework`,
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

  const isCustomOptions: selectOptionsType[] = [
    {
      label: "Yes",
      value: "true",
    },
    {
      label: "No",
      value: "false",
    },
  ];

  // States
  const [status, setStatus] = useState<selectOptionsType>(options[0]);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [moduleOptions, setModuleOptions] = useState<selectOptionsType[]>([
    {
      label: "Choose Module",
      value: "_",
      hidden: true,
    },
  ]);

  const [module, setModule] = useState<selectOptionsType>(moduleOptions[0]);
  const [custom, setCustom] = useState<selectOptionsType>(isCustomOptions[1]);

  const router = useRouter();

  useEffect(() => {
    if (id) {
      getFrameworkByIdAPI(
        id,
        (res) => {
          setName(res.name);
          setStatus({ value: res.status, label: res.status });
          setModule({ value: res.module, label: "" });
          setCustom({
            value: res.isCustom.toString(),
            label: "",
          });
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

    if (module.value === "_") {
      setError("Please select a module");
      return;
    }

    if (module.disabled) {
      setError("Selected module not available");
      return;
    }

    setError("");

    const data = {
      name: name,
      status: status.value,
      module: module.value,
      isCustom: custom.value === "true",
    };

    if (id) {
      updateFrameworkAPI(
        id,
        data,
        () => {
          router.push(routes.admin.framework.list);
        },
        (err: string) => {
          console.error(err);
        }
      );
    } else {
      createFrameworkAPI(
        data,
        () => {
          router.push(routes.admin.framework.list);
        },
        (err: string) => {
          setError(err);
        }
      );
    }
  };

  useEffect(() => {
    getModuleAPI(
      (modules) => {
        const tempOptions: selectOptionsType[] = modules.map((module) => ({
          label: `${module.name}${
            module.status !== "active" ? " (Coming Soon)" : ""
          }`,
          value: module._id,
          disabled: module.status !== "active",
        }));
        tempOptions.unshift({
          label: "Choose Module",
          value: "_",
          hidden: true,
        });
        setModuleOptions(tempOptions);
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
                label="Framework Name"
                value={name}
                setValue={setName}
                required
              />
            </Col>
            <Col md={6}>
              <Select
                title="Select Module"
                options={moduleOptions}
                value={module.value}
                onSelect={setModule}
              />
            </Col>
            <Col md={6}>
              <Select
                title="Is Custom"
                options={isCustomOptions}
                value={custom.value}
                onSelect={setCustom}
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

export default FrameworkUI;
