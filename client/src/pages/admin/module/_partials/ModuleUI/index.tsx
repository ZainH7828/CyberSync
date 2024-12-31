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
  createModuleAPI,
  getModuleByIdAPI,
  updateModuleAPI,
} from "@/pages/api/modules";

type OrganizationUIType = { id?: string; isEdit?: boolean };

const ModuleUI: React.FC<OrganizationUIType> = ({
  id = "",
  isEdit = false,
}) => {
  const heading: DashhboardHeadingType = {
    heading: `${isEdit ? "Update" : "Add"} Module`,
    ...(isEdit
      ? {
          rightLink: {
            link: routes.admin.module.add,
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
  const [error, setError] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (id) {
      getModuleByIdAPI(
        id,
        (res) => {
          setName(res.name);
          setStatus({ value: res.status, label: res.status });
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

    setError("");

    if (id) {
      updateModuleAPI(
        id,
        { name: name, status: status.value },
        () => {
          router.push(routes.admin.module.list);
        },
        (err: string) => {
          console.error(err);
        }
      );
    } else {
      createModuleAPI(
        { name: name, status: status.value },
        () => {
          router.push(routes.admin.module.list);
        },
        (err: string) => {
          setError(err);
        }
      );
    }
  };

  return (
    <Layouts type="dashboard" pageName={heading.heading}>
      <Heading {...heading} />
      <Card>
        <form onSubmit={submitHandler}>
          <Row className="rowGap2">
            <Col md={6}>
              <Input
                label="Module Name"
                value={name}
                setValue={setName}
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

export default ModuleUI;
