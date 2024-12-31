import Heading from "@/components/Dashboard/Heading";
import Layouts from "@/layouts";
import routes from "@/routes";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { getSelfAssessmentByOrgIdAPI } from "../api/self-assessment";
import { MainContext } from "@/context";
import SelfAssessmentTable from "./_partials/SelfAssessmentTable";

const SelfAssessment = () => {
  const context = useContext(MainContext);

  const [list, setList] = useState<selfAssessmentResponseType[]>([]);

  const heading: DashhboardHeadingType = {
    heading: "NIST Self Assessment",
    rightLink: {
      title: "Add New",
      icon: faPlus,
      link: routes.users.selfAssessment.add,
    },
  };

  const getSelfAssessments = () => {
    if (context?.organizationData.value) {
      getSelfAssessmentByOrgIdAPI(
        context?.organizationData.value._id,
        (data) => {
          setList(data);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  useEffect(() => {
    getSelfAssessments();
  }, [context?.organizationData.value]);

  return (
    <Layouts type="dashboard" pageName="Self Assessment">
      <Heading {...heading} />
      <SelfAssessmentTable list={list} getData={getSelfAssessments} />
    </Layouts>
  );
};

export default SelfAssessment;
