import Heading from "@/components/Dashboard/Heading";
import Layouts from "@/layouts";
import routes from "@/routes";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "@/context";
import { getTargetScoreByOrgIdAPI } from "@/pages/api/self-assessment";
import { Col, Row } from "react-bootstrap";
import SimpleTable from "@/tables/SimpleTable";

const SelfAssessment = () => {
  const context = useContext(MainContext);

  const [list, setList] = useState<categoryTableType[]>([]);

  const heading: DashhboardHeadingType = {
    heading: "NIST Self Assessment Target Score",
    rightLink: {
      title: `${list.length ? "Update" : "Add New"}`,
      icon: faPlus,
      link: routes.users.targetScore.update,
    },
  };

  const tableHead = [
    "Function",
    "Function Id",
    "Category",
    "Category Id",
    "Target Score",
  ];

  const tableKeys = ["master", "code", "subCat", "subCatCode", "score"];

  const getSelfAssessments = () => {
    if (context?.organizationData.value) {
      getTargetScoreByOrgIdAPI(
        context?.organizationData.value._id,
        (data) => {
          const tempData: categoryTableType[] = data.map((item) => ({
            masterId: item.subCategory.category._id,
            master: item.subCategory.category.name,
            code: item.subCategory.category.code,
            subCatId: item.subCategory._id,
            subCat: item.subCategory.name,
            subCatCode: `${item.subCategory.category.code}.${item.subCategory.subCatCode}`,
            targetScore: 0,
            prevScore: 0,
            score: item.score,
            note: "",
          }));
          setList(tempData);
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
    <Layouts type="dashboard" pageName="Self Assessment Target Score">
      <Heading {...heading} />

      <Row className="rowGap2">
        {list.length > 0 && (
          <Col xs={12}>
            <SimpleTable
              headings={tableHead}
              keys={tableKeys}
              data={list}
              showSno
              overflowVisible
            />
          </Col>
        )}
      </Row>
    </Layouts>
  );
};

export default SelfAssessment;
