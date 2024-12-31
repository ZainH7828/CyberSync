import Meta from "@/elements/Meta";
import { Container } from "react-bootstrap";
import style from "@/styles/loading.module.css";
import constants from "@/constants";
import { useRouter } from "next/router";
import routes from "@/routes";
import { logoutAPI } from "../api/auth";
import { useContext } from "react";
import { MainContext } from "@/context";
import Button from "@/elements/Button";

const OrganizatinInActive = () => {
  const context = useContext(MainContext);

  const router = useRouter();
  const { pathname } = router;

  const logoutHandler = () => {
    const pathIsAdminPath = pathname.startsWith(routes.admin.main);
    logoutAPI(() => {
      if (context && context.userData) {
        context.userData.set(undefined);
        context.organizationData.set(undefined);
        context.userDashboard.set(undefined);
        context.selectedSubCategory.set([]);
      }
      router.replace(
        pathIsAdminPath ? routes.auth.admin.login : routes.auth.users.login
      );
    });
  };

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
            <h1>Organization Inactive</h1>
            <p>Please contact MICT Admin to activate your organization</p>

            <Button theme="primary" onClick={logoutHandler}>
              Logout
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
};

export default OrganizatinInActive;
