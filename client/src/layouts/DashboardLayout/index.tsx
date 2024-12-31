import style from "./DashboardLayout.module.css";
import SideBar from "./_partials/SideBar";

const DashboardLayout: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <section className={style.dashboardArea}>
      <SideBar />
      <section className={style.dashboardBody}>{children}</section>
    </section>
  );
};

export default DashboardLayout;
