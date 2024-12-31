import { Col, Container, Row } from "react-bootstrap";
import style from "./AuthLayout.module.css";
import constants from "@/constants";

const AuthLayout: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <section className={style.authArea}>
      <header className={style.authHeader}>
        <Container fluid>
          <Row>
            <Col md={12}>
              <div className={style.logo}>
                <img
                  src={constants.appSettings.logo}
                  alt={constants.appSettings.appName}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      <section className={style.authBody}>
        <Container>
          <Row>
            <Col md={6}>{children}</Col>
          </Row>
        </Container>
      </section>
      <img
        src="/assets/images/auth/side-img.jpg"
        alt=""
        className={style.rightImg}
      />
    </section>
  );
};

export default AuthLayout;
