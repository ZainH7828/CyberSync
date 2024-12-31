import { Roboto } from "next/font/google";
import AuthLayout from "./AuthLayout";
import DashboardLayout from "./DashboardLayout";
import Meta from "@/elements/Meta";
import OnboardingLayout from "./OnboardingLayout";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const Layouts: React.FC<LayoutsType> = ({
  type,
  pageName,
  description,
  children,
}) => {
  const getLayout = () => {
    switch (type) {
      case "auth":
        return AuthLayout;
      case "dashboard":
        return DashboardLayout;
      case "onboarding":
        return OnboardingLayout;
      default:
        return AuthLayout;
    }
  };

  const Layout = getLayout();

  return (
    <>
      <Meta pageName={pageName} description={description} />
      <main className={roboto.className}>
        <Layout>{children}</Layout>
      </main>
    </>
  );
};

export default Layouts;
