import Heading from "@/components/Dashboard/Heading";
import { MainContext } from "@/context";
import Button from "@/elements/Button";
import Layouts from "@/layouts";
import { updateOrganizationAPI } from "@/pages/api/organization";
import { getTargetScoreByOrgIdAPI } from "@/pages/api/self-assessment";
import routes from "@/routes";
import SimpleTable from "@/tables/SimpleTable";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const SelfAssessmentScoreUpdate = () => {
  const heading: DashhboardHeadingType = {
    heading: "NIST Self Assessment Target Score",
  };

  const router = useRouter();
  const context = useContext(MainContext);

  const [selectedCategoryData, setSelectedCategoryData] = useState<
    categoryTableType[]
  >([]);

  useEffect(() => {
    if (
      context &&
      context.userDashboard &&
      context.userDashboard.data &&
      context?.organizationData.value
    ) {
      getTargetScoreByOrgIdAPI(
        context?.organizationData.value._id,
        (data) => {
          if (data && data.length) {
            const tempData: categoryTableType[] = data.map((item) => ({
              masterId: item.subCategory.category._id,
              master: item.subCategory.category.name,
              code: item.subCategory.category.code,
              subCatId: item.subCategory._id,
              subCat: item.subCategory.name,
              subCatCode: `${item.subCategory.category.code}.${item.subCategory.subCatCode}`,
              targetScore: 1,
              score: item.score,
              note: "",
            }));
            setSelectedCategoryData(tempData);
          } else {
            const updatedCategoryData: categoryTableType[] = [];

            context.userDashboard.data?.categories.forEach((category) => {
              const categoryData = category.subCategory.map((subCat) => ({
                masterId: category._id,
                master: category.name,
                code: category.code,
                subCatId: subCat._id,
                subCat: subCat.name,
                subCatCode: `${category.code}.${subCat.subCatCode}`,
                targetScore: 1,
                score: 1,
                note: "",
              }));

              updatedCategoryData.push(...categoryData);
            });

            setSelectedCategoryData(updatedCategoryData);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, []);

  const onSubmitHandler = () => {
    if (context && context.organizationData && context.organizationData.value) {
      const dataToSend = {
        targetScore: selectedCategoryData.map((item) => ({
          subCategory: item.subCatId,
          score: item.score,
        })),
      };

      updateOrganizationAPI(
        context.organizationData.value._id,
        dataToSend,
        () => router.push(routes.users.targetScore.main),
        (err) => console.error(err)
      );
    }
  };

  const tableHead = [
    "Function",
    "Function Id",
    "Category",
    "Category Id",
    "Target Score",
  ];

  const tableKeys = ["master", "code", "subCat", "subCatCode", "score"];

  return (
    <Layouts type="dashboard" pageName="Self Assessment Target Score">
      <Heading {...heading} />
      <Row className="rowGap2">
        {selectedCategoryData.length > 0 && (
          <>
            <Col xs={12}>
              <SimpleTable
                headings={tableHead}
                keys={tableKeys}
                data={selectedCategoryData}
                showSno
                categoryData={selectedCategoryData}
                setScoreState={setSelectedCategoryData}
                overflowVisible
              />
            </Col>

            <Col xs={12} className="text-center">
              <Button type="submit" onClick={onSubmitHandler}>
                <span>Submit</span>
              </Button>
            </Col>
          </>
        )}
      </Row>
    </Layouts>
  );
};

export default SelfAssessmentScoreUpdate;
