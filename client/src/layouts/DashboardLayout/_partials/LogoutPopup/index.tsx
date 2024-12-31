import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Button from "@/elements/Button";
import style from "./LogoutPopup.module.css";
import { logoutAPI } from "@/pages/api/auth";
import routes from "@/routes";
import { usePathname } from "next/navigation";
import { MainContext } from "@/context";

const LogoutPopup: React.FC<logoutPopupType> = ({
  visibility,
  toggleVisibility,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const context = useContext(MainContext);

  const logoutAreaRef = useRef<HTMLDivElement>(null);

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

  const closeSelectDrop = (e: MouseEvent) => {
    if (
      visibility &&
      logoutAreaRef.current &&
      !logoutAreaRef.current.contains(e.target as Node)
    ) {
      toggleVisibility();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSelectDrop);

    return () => {
      document.removeEventListener("mousedown", closeSelectDrop);
    };
  }, [visibility]);

  return (
    <div className={style.logoutArea} ref={logoutAreaRef}>
      <h3>Are you sure you want to logout?</h3>
      <div className={style.logoutBtn}>
        <Button theme="primary-light" onClick={toggleVisibility}>
          Cancel
        </Button>
        <Button theme="danger" onClick={logoutHandler}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default LogoutPopup;
