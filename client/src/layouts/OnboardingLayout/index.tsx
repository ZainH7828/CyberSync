import { Col, Container, Row } from "react-bootstrap";
import authStyle from "../AuthLayout/AuthLayout.module.css";
import constants from "@/constants";

const OnboardingLayout: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <section className={authStyle.authArea}>
      <header className={authStyle.authHeader}>
        <Container fluid>
          <Row>
            <Col md={12}>
              <div className={authStyle.logo}>
                <img
                  src={constants.appSettings.logo}
                  alt={constants.appSettings.appName}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      <section className={`${authStyle.authBody} ${authStyle.onBoardingBody}`}>
        <Container>{children}</Container>
      </section>
    </section>
  );
};

export default OnboardingLayout;
