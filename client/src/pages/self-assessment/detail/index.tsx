import Heading from "@/components/Dashboard/Heading";
import Button from "@/elements/Button";
import Layouts from "@/layouts";
import {
  dowloadSelfAssessmentAPI,
  getSelfAssessmentById,
} from "@/pages/api/self-assessment";
import SimpleTable from "@/tables/SimpleTable";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const SelfAssessmentDetail = () => {
  const heading: DashhboardHeadingType = {
    heading: "NIST Self Assessment",
  };

  const searchParams = useSearchParams();

  const [selectedCategoryData, setSelectedCategoryData] = useState<
    categoryTableType[]
  >([]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      getSelfAssessmentById(
        id,
        (data) => {
          const tempData: categoryTableType[] = data.report.map((item) => ({
            masterId: item.category._id,
            master: item.category.name,
            code: item.category.code,
            subCatId: item.subCategory._id,
            subCat: item.subCategory.name,
            subCatCode: `${item.category.code}.${item.subCategory.subCatCode}`,
            targetScore: item.targetScore,
            prevScore: item.prevScore > 0 ? item.prevScore : "NA",
            score: item.score,
            note: item.note,
          }));

          setSelectedCategoryData(tempData);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, [searchParams]);

  const tableHead = [
    "Function",
    "Function Id",
    "Category",
    "Category Id",
    "Target Score",
    "Policy Score",
    "Practice Score",
    "Notes",
  ];

  const tableKeys = [
    "master",
    "code",
    "subCat",
    "subCatCode",
    "targetScore",
    "prevScore",
    "score",
    "note",
  ];

  const downloadHandler = () => {
    const id = searchParams.get("id");
    if (id) {
      dowloadSelfAssessmentAPI(
        id,
        () => {},
        (err) => {
          console.log(err);
        }
      );
    }
  };

  return (
    <Layouts type="dashboard" pageName="Self Assessment">
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
                setScoreState={setSelectedCategoryData}
                overflowVisible
              />
            </Col>

            <Col xs={12} className="text-center">
              <Button theme="primary-outlined" onClick={downloadHandler}>
                <span>Download Report</span>
              </Button>
            </Col>
          </>
        )}
      </Row>
    </Layouts>
  );
};

export default SelfAssessmentDetail;
