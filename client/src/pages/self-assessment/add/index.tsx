import Heading from "@/components/Dashboard/Heading";
import { MainContext } from "@/context";
import Button from "@/elements/Button";
import Layouts from "@/layouts";
import {
  createSelfAssesmentAPI,
  getLastSelfAssessmentScoreByOrgIdAPI,
  getTargetScoreByOrgIdAPI,
} from "@/pages/api/self-assessment";
import routes from "@/routes";
import SimpleTable from "@/tables/SimpleTable";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";

const SelfAssessmentAdd = () => {
  const heading: DashhboardHeadingType = {
    heading: "NIST Self Assessment",
  };

  const router = useRouter();
  const context = useContext(MainContext);

  const [selectedCategoryData, setSelectedCategoryData] = useState<
    categoryTableType[]
  >([]);
  const [lastScore, setLastScore] = useState<
    latestSelfAssessmentResponseType[]
  >([]);
  const [targetScore, setTargetScore] = useState<targetScoreResponseApiType[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const multiSelectRef = useRef<HTMLDivElement>(null);

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const getLastScore = (catId: string, subCat: string) => {
    if (lastScore.length < 1) {
      return "NA";
    }
    const filteredData = lastScore.filter(
      (item) => item.category === catId && item.subCategory === subCat
    );
    return filteredData.length > 0 ? filteredData[0].score : "NA";
  };

  const getTargetScore = (catId: string, subCat: string) => {
    if (targetScore.length < 1) {
      return 1;
    }
    const filteredData = targetScore.filter(
      (item) =>
        item.subCategory.category._id === catId &&
        item.subCategory._id === subCat
    );
    return filteredData.length > 0 ? filteredData[0].score : 1;
  };

  useEffect(() => {
    if (context && context.organizationData && context.organizationData.value) {
      getLastSelfAssessmentScoreByOrgIdAPI(
        context.organizationData.value._id,
        (data) => setLastScore(data),
        (err) => console.log(err)
      );
      getTargetScoreByOrgIdAPI(
        context?.organizationData.value._id,
        (data) => {
          setTargetScore(data);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, [context?.organizationData.value]);

  useEffect(() => {
    if (context && context.userDashboard && context.userDashboard.data) {
      const updatedCategoryData: categoryTableType[] = [];

      selectedCategories.forEach((categoryId) => {
        const category = context.userDashboard.data?.categories.find(
          (item) => item._id === categoryId
        );

        if (category) {
          const categoryData: categoryTableType[] = category.subCategory.map(
            (subCat) => ({
              masterId: category._id,
              master: category.name,
              code: category.code,
              subCatId: subCat._id,
              subCat: subCat.name,
              subCatCode: `${category.code}.${subCat.subCatCode}`,
              prevScore: getLastScore(category._id, subCat._id),
              targetScore: getTargetScore(category._id, subCat._id),
              score: 1,
              note: "",
            })
          );

          updatedCategoryData.push(...categoryData);
        }
      });

      setSelectedCategoryData(updatedCategoryData);
    }
  }, [selectedCategories, lastScore, targetScore]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        multiSelectRef.current &&
        !multiSelectRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmitHandler = () => {
    if (context && context.organizationData && context.organizationData.value) {
      const dataToSend = {
        organization: context.organizationData.value._id,
        report: selectedCategoryData.map((item) => ({
          category: item.masterId,
          subCategory: item.subCatId,
          prevScore:
            parseInt(item.prevScore as string) > 0
              ? parseInt(item.prevScore as string)
              : 0,
          targetScore: item.targetScore,
          score: item.score,
          note: item.note,
        })),
      };

      createSelfAssesmentAPI(
        dataToSend,
        () => router.push(routes.users.selfAssessment.main),
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

  const getSelectedCategoryNames = () => {
    if (!context?.userDashboard?.data?.categories)
      return "Select Framework Function";

    const selectedNames = selectedCategories
      .map((categoryId) => {
        const category = context.userDashboard.data?.categories.find(
          (cat) => cat._id === categoryId
        );
        return category ? category.name : null;
      })
      .filter(Boolean)
      .join(", ");

    return selectedNames.length > 0 ? selectedNames : "Select Framework Function";
  };

  return (
    <Layouts type="dashboard" pageName="Self Assessment">
      <Heading {...heading} />
      <Row className="rowGap2">
        <Col md={4}>
          <div className="multi-select" ref={multiSelectRef}>
            <span onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
              {getSelectedCategoryNames()}
            </span>
            {isDropdownVisible && (
              <ul>
                {context?.userDashboard?.data?.categories.map((category) => (
                  <li
                    key={category._id}
                    className={`${
                      selectedCategories.includes(category._id)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleCategorySelection(category._id)}
                  >
                    {category.name}
                    {selectedCategories.includes(category._id) ? (
                      <FontAwesomeIcon icon={faCheckSquare} />
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Col>
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

export default SelfAssessmentAdd;
