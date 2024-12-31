import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import { Col, Row } from "react-bootstrap";
import Button from "@/elements/Button";
import routes from "@/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import style from "@/styles/onboarding.module.css";
import { useSearchParams } from "next/navigation";
import { getFrameworkAPI } from "@/pages/api/framework";
import { useEffect, useState } from "react";
import { updateOrganizationAPI } from "@/pages/api/organization";
import { useRouter } from "next/router";

const SelectFramework = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allFrameworkData, setAllFrameworkData] = useState<frameworkDataType[]>(
    []
  );

  const getAllFramework = () => {
    getFrameworkAPI(
      (response) => {
        setAllFrameworkData(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    getAllFramework();
  }, []);

  const onClickHandler = (item: frameworkDataType) => {
    const organization = searchParams.get("organization");
    if (organization) {
      updateOrganizationAPI(
        organization,
        { framework: item._id },
        () => {
          if (item.isCustom) {
            router.push(
              `${routes.onBoarding.organization.customFramework}?organization=${organization}&framework=${item._id}`
            );
          } else {
            router.push(
              `${routes.onBoarding.organization.selectCategory}?organization=${organization}&framework=${item._id}`
            );
          }
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  return (
    <Layouts type="auth" pageName="Select Framework">
      <form>
        <Row>
          <Col xs={12}>
            <AuthHeading
              heading="Select Framework"
              text="The NIST Cybersecurity Framework consists of five core categories that provide a high-level, strategic view of the lifecycle of an organization's management of cybersecurity risk."
            />
          </Col>
        </Row>
        <Row className="rowGap2">
          {allFrameworkData.map((framework, frameworkIndex) => (
            <Col
              xs={12}
              className={style.frameworkBtnArea}
              key={frameworkIndex}
            >
              <Button
                theme="primary-outlined"
                isFullWitdh
                onClick={() => onClickHandler(framework)}
              >
                <span>{framework.name}</span>
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
            </Col>
          ))}

          <Col
            xs={12}
          >
            <Button theme="primary-light" onClick={() => router.back()} isFullWitdh>
              <span>Back</span>
            </Button>
          </Col>
        </Row>
      </form>
    </Layouts>
  );
};

export default SelectFramework;
