import constants from "@/constants";
import Meta from "@/elements/Meta";
import { LoadingIcon } from "@/icons";
import style from "@/styles/loading.module.css";
import { Container } from "react-bootstrap";

const Loader = () => {
  return (
    <>
      <Meta pageName="Loading" />
      <section className={style.loadingSection}>
        <Container className={style.loadingContainer}>
          <div className={style.loadingArea}>
            <img
              src={constants.appSettings.logo}
              alt={constants.appSettings.appName}
            />
            <div className="spin">
              <LoadingIcon />
            </div>
            <h1>Loading...</h1>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Loader;
