import constants from "@/constants";
import { MainContext } from "@/context";
import Meta from "@/elements/Meta";
import { LoadingIcon } from "@/icons";
import style from "@/styles/loading.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { getUserData, logoutAPI } from "../api/auth";
import { rolesKeys } from "@/pageData/roles";
import routes from "@/routes";
import { useRouter } from "next/router";
import { getOrganizationByIdAPI } from "../api/organization";

const Loading = () => {
  const context = useContext(MainContext);
  const router = useRouter();
  const isLoading = useRef<boolean>(true);

  useEffect(() => {
    if (!context) return;

    getUserData(
      (userData) => {
        context.userData.set(userData);
      },
      (err) => {
        logoutAPI(() => {
          if (context) {
            context.userData.set(undefined);
            context.organizationData.set(undefined);
          }
          setTimeout(() => {
            router.push(routes.auth.users.login);
          }, 500);
        });
      }
    );
  }, [context]);

  const initializePage = (
    userData: userResponseDataType,
    organizationData?: organizationsDataType
  ) => {
    if (!userData) return;

    const { from } = router.query;

    if (userData.role !== rolesKeys.superAdmin && organizationData) {
      if (organizationData.status !== "active") {
        router.push(routes.organizationInActive);
        return;
      }
    }

    if (!userData.isPasswordChanged) {
      router.push(routes.auth.users.updatePassword);
    } else if (
      !userData.orgSetupCompleted &&
      userData.role === rolesKeys.companyAdmin &&
      userData.organization
    ) {
      router.push(
        `${routes.onBoarding.organization.selectModule}?organization=${userData.organization}`
      );
    } else if (
      !userData.orgSetupCompleted &&
      userData.role !== rolesKeys.superAdmin &&
      userData.role !== rolesKeys.companyAdmin &&
      userData.organization
    ) {
      router.push(routes.organizationNotSetup);
    } else {
      if (typeof from === "string" && from.startsWith("/")) {
        const isFromAdminPath = from.startsWith(routes.admin.main);
        if (
          from.startsWith(routes.admin.main) &&
          userData.role !== rolesKeys.superAdmin
        ) {
          router.push(routes.users.dashboard);
        } else if (userData.role === rolesKeys.superAdmin && !isFromAdminPath) {
          router.push(routes.admin.dashboard);
        } else {
          router.push(from);
        }
      } else {
        if (userData.role !== rolesKeys.superAdmin) {
          router.push(routes.users.dashboard);
        } else {
          router.push(routes.admin.dashboard);
        }
      }
    }
  };

  useEffect(() => {
    if (!context || !context.userData.value) return;

    const userData = context.userData.value;
    if (isLoading.current) {
      if (userData.role === rolesKeys.superAdmin) {
        isLoading.current = false;
        initializePage(userData);
      } else if (userData.organization) {
        isLoading.current = false;
        getOrganizationByIdAPI(
          userData.organization,
          (organizationData) => {
            context.organizationData.set(organizationData);
            initializePage(userData, organizationData);
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
  }, [context?.userData.value]);

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

export default Loading;
