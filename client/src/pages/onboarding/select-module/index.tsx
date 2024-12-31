import { useEffect, useState } from "react";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import { Col, Row } from "react-bootstrap";
import Button from "@/elements/Button";
import routes from "@/routes";
import Select from "@/elements/Select";
import { useRouter } from "next/router";
import Error from "@/elements/Error";
import { getModuleAPI } from "@/pages/api/modules";
import { useSearchParams } from "next/navigation";
import { updateOrganizationAPI } from "@/pages/api/organization";

const SelectModule = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [options, setOptions] = useState<selectOptionsType[]>([
    {
      label: "Choose Module",
      value: "_",
      hidden: true,
    },
  ]);

  const [module, setModule] = useState<selectOptionsType>(options[0]);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (module.value === "_") {
      setError("Please select a module");
      return;
    }

    if (module.disabled) {
      setError("Selected module not available");
      return;
    }

    setError("");
    const organization = searchParams.get("organization");
    if (organization) {
      updateOrganizationAPI(
        organization,
        { module: module.value },
        () => {
          router.push(
            `${routes.onBoarding.organization.selectFramework}?organization=${organization}`
          );
        },
        (err) => {
          console.error(err);
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
        setOptions(tempOptions);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  return (
    <Layouts type="auth" pageName="Select Module">
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <AuthHeading
              heading="Select Module"
              text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy"
            />
          </Col>
        </Row>
        <Row className="rowGap2">
          <Col xs={12}>
            <Select
              title="Select Module"
              options={options}
              value={module.value}
              onSelect={setModule}
            />
          </Col>
          {error ? (
            <Col xs={12}>
              <Error error={error} />
            </Col>
          ) : null}
        </Row>
        <Row>
          <Col xs={12}>
            <div className="submitArea">
              <Button type="submit" isFullWitdh>
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </Layouts>
  );
};

export default SelectModule;
