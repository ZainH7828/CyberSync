import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Col, Row } from "react-bootstrap";
import Card from "@/components/Card";
import Heading from "@/components/Dashboard/Heading";
import Button from "@/elements/Button";
import Input from "@/elements/Input";
import Select from "@/elements/Select";
import Layouts from "@/layouts";
import {
  createOrganizationAPI,
  getOrganizationByIdAPI,
  updateOrganizationAPI,
} from "@/pages/api/organization";
import routes from "@/routes";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Error from "@/elements/Error";
import { validateEmail } from "@/functions";
import calculateLicenseEndDate from "@/helpers/DateTime";

type OrganizationUIType = { id?: string; isEdit?: boolean };

const OrganizationUI: React.FC<OrganizationUIType> = ({
  id = "",
  isEdit = false,
}) => {
  const heading: DashhboardHeadingType = {
    heading: `${isEdit ? "Update" : "Add"} Organization`,
    ...(isEdit
      ? {
          rightLink: {
            link: routes.admin.organization.add,
            title: "Add New",
            icon: faPlus,
          },
        }
      : {}),
  };

  const statuses: selectOptionsType[] = [
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

  const licensePeriods: selectOptionsType[] = [
    {
      label: "Choose License Period",
      value: "_",
      hidden: true,
    },
    {
      label: "1 week",
      value: "1 week",
    },
    {
      label: "1 month",
      value: "1 month",
    },
    {
      label: "2 month",
      value: "2 month",
    },
    {
      label: "1 year",
      value: "1 year",
    },
    {
      label: "Custom",
      value: "custom",
    },
  ];

  // States
  const [status, setStatus] = useState<selectOptionsType>(statuses[0]);
  const [licensePeriod, setLicensePeriod] = useState<selectOptionsType>(
    licensePeriods[0]
  );
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (id) {
      getOrganizationByIdAPI(
        id,
        (res) => {
          setName(res.name);
          setEmail(res.email);
          setStatus({ value: res.status, label: res.status });
          setLicensePeriod({
            value: res.licensePeriod || "",
            label: res?.licensePeriod || "",
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

    if (licensePeriod.value === "_") {
      setError("Please Select License Period");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email");
      return;
    }

    const licenseEndDate = calculateLicenseEndDate(licensePeriod.value);

    if (!licenseEndDate && licensePeriod.value !== "custom") {
      setError("License period is invalid");
      return;
    }

    setError("");

    const data = {
      email: email.toLowerCase().trim(),
      name: name,
      status: status.value,
      licensePeriod: licensePeriod.value,
      licenseEndDate: licenseEndDate,
    };

    if (id) {
      updateOrganizationAPI(
        id,
        data,
        () => {
          router.push(routes.admin.dashboard);
        },
        (err: string) => {
          console.error(err);
        }
      );
    } else {
      createOrganizationAPI(
        data,
        () => {
          router.push(routes.admin.dashboard);
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
            {/* {isEdit ? (
              <Col
                md={{
                  span: 6,
                  order: 0,
                }}
              >
                <Input label="Id" value={id} disabled />
              </Col>
            ) : null} */}
            <Col md={6}>
              <Input
                label="Organization Name"
                value={name}
                setValue={setName}
                required
              />
            </Col>
            <Col md={6}>
              <Select
                title="Status"
                options={statuses}
                value={status.value}
                onSelect={setStatus}
              />
            </Col>
            <Col md={6}>
              <Select
                title="License Period"
                options={licensePeriods}
                value={licensePeriod.value}
                onSelect={setLicensePeriod}
              />
            </Col>
            <Col md={6}>
              <Input
                label="Organization Email"
                type="email"
                value={email}
                disabled={isEdit}
                setValue={setEmail}
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

export default OrganizationUI;
