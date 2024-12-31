import { useContext, useEffect, useState } from "react";
import Popup from "..";
import style from "../Popup.module.css";
import Select from "@/elements/Select";
import Button from "@/elements/Button";
import { Col, Row } from "react-bootstrap";
import DateInput from "@/elements/Input/DateInput";
import { getReportInfoAPI } from "@/pages/api/report";
import { MainContext } from "@/context";
import { useRouter } from "next/router";
import MultiSelect from "@/elements/MultiSelect";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const ReportPopup: React.FC<recurringTaskPopupType> = ({
  visibility = false,
  toggleVisibility = () => null,
}) => {
  const popupData: PopupType = {
    visibility: visibility,
    toggleVisibility: toggleVisibility,
    className: style.reportPopup,
    heading: "Report Type",
    // overflowAuto: true,
  };

  const frameworkFunctions: selectOptionsType[] = [
    {
      label: "Choose Framework Function",
      value: "_",
      hidden: true,
    },
  ];

  const categories: selectOptionsType[] = [
    {
      label: "Choose Category",
      value: "_",
      hidden: true,
    },
  ];

  const participants: selectOptionsType[] = [
    {
      label: "Choose Participant",
      value: "_",
      hidden: true,
    },
  ];

  const statuses: selectOptionsType[] = [
    // {
    //   label: "Choose Status",
    //   value: "_",
    //   hidden: true,
    // },
    {
      label: "Not Started",
      value: "not-started",
    },
    {
      label: "In Progress",
      value: "in-progress",
    },
    // {
    //   label: "Needs to Schedule",
    //   value: "needs-schedule",
    // },
    // {
    //   label: "Scheduled",
    //   value: "scheduled",
    // },
    {
      label: "Behind Schedule",
      value: "behind-schedule",
    },
    // {
    //   label: "Stuck",
    //   value: "stuck",
    // },
    // {
    //   label: "On Hold",
    //   value: "on-hold",
    // },
    {
      label: "Done",
      value: "done",
    },
  ];

  const [reportType, setReportType] = useState("task");

  const context = useContext(MainContext);
  const router = useRouter();
  const orgId: any = context?.organizationData?.value?._id;

  const [reportInfo, setReportInfo] = useState<any>(null);

  const [selectedCategory, setSelectedCategory] = useState<any>(categories[0]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  const [selectedFrameworkFunction, setSelectedFrameworkFunction] =
    useState<any>(frameworkFunctions[0]);

  const [selectedFrameworkFunctions, setSelectedFrameworkFunctions] = useState<
    any[]
  >([]);

  const [selectedParticipant, setSelectedParticipant] = useState<any>(
    participants[0]
  );

  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<any>(statuses[0]);
  const [selectedStatuses, setSelectedStatuses] = useState<any[]>([]);

  const [fromDate, setFromDate] = useState<Value>(new Date());
  const [toDate, setToDate] = useState<Value>(new Date());

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const handleCalendarVisibility = (isVisible: boolean) => {
    setIsCalendarOpen(isVisible);
  };

  useEffect(() => {
    if (visibility) {
      getReportInfo();
    }
  }, [visibility]);

  const getReportInfo = () => {
    getReportInfoAPI(
      orgId,
      (response) => {
        setReportInfo(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  if (reportInfo) {
    reportInfo.framework.forEach((item: any) => {
      frameworkFunctions.push({
        label: item.name,
        value: item._id,
      });
    });
  }

  if (reportInfo) {
    reportInfo.category.forEach((item: any) => {
      if (selectedFrameworkFunctions.includes(item.category)) {
        categories.push({
          label: item.name,
          value: item._id,
        });
      }
    });
  }

  if (reportInfo) {
    reportInfo.user.forEach((item: any) => {
      participants.push({
        label: item.name,
        value: item._id,
      });
    });
  }

  const formatDate = (date: any): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateFields = () => {
    if (reportType === "task") {
      return (
        selectedCategories.length &&
        selectedFrameworkFunctions.length &&
        selectedParticipants.length &&
        selectedStatuses.length
      );
    } else if (reportType === "category") {
      return selectedFrameworkFunctions.length;
    } else if (reportType === "framework") {
      return true;
    }
  };

  const handleDownloadReport = () => {
    if (validateFields() && fromDate && toDate && fromDate <= toDate) {
      let redirectUrl = "/task-report";
      const data: any = {
        // framework: selectedFrameworkFunctions.join(","),
        // status: selectedStatuses.join(","),
        // user: selectedParticipants.join(","),
        // subcategory: selectedCategories.join(","),
        reportType,
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      };
      if (reportType === "task" || reportType === "category") {
        data["framework"] = selectedFrameworkFunctions
          .filter((item) => item !== "_")
          .join(",");
      }
      if (reportType === "task") {
        data["status"] = selectedStatuses
          .filter((item) => item !== "_")
          .join(",");
        data["user"] = selectedParticipants
          .filter((item) => item !== "_")
          .join(",");
        data["subcategory"] = selectedCategories.join(",");
      }

      if (reportType === "category") {
        redirectUrl = "/category-report";
      }

      if (reportType === "framework") {
        redirectUrl = "/framework-report";
      }

      router.push({
        pathname: redirectUrl,
        query: { ...data },
      });
      toggleVisibility();
    } else {
      alert(
        "Please select all fields and ensure that the 'From Date' is before the 'To Date'"
      );
    }
  };

  const clearFields = () => {
    setSelectedCategories([]);
    setSelectedFrameworkFunctions([]);
    setSelectedParticipants([]);
    setSelectedStatuses([]);
    setFromDate(new Date());
    setToDate(new Date());
  };

  useEffect(() => {
    if (!visibility) {
      setTimeout(() => {
        clearFields();
        setReportType("task");
      }, 350);
    }
  }, [visibility]);

  useEffect(() => {
    clearFields();
  }, [reportType]);

  return (
    <Popup {...popupData} overflowAuto={!isCalendarOpen}>
      <div className={style.inputContainer}>
        <div className={style.reportTypeCheckboxes}>
          <label>
            <input
              type="checkbox"
              checked={reportType === "task"}
              onChange={() => setReportType("task")}
            />
            Task Level
          </label>
          <label>
            <input
              type="checkbox"
              checked={reportType === "category"}
              onChange={() => setReportType("category")}
            />
            Category Level
          </label>
          <label>
            <input
              type="checkbox"
              checked={reportType === "framework"}
              onChange={() => setReportType("framework")}
            />
            Framework Level
          </label>
        </div>

        {/* <div className={style.inputArea}>
          <Select
            title="Select Framework Function"
            options={frameworkFunctions}
            value={selectedFrameworkFunction.value}
            onSelect={setSelectedFrameworkFunction}
          />
        </div> */}
        {(reportType === "task" || reportType === "category") && (
          <div>
            <MultiSelect
              title="Framework Functions"
              value={selectedFrameworkFunctions.filter((item) => item !== "_")}
              options={frameworkFunctions}
              onSelect={setSelectedFrameworkFunctions}
            />
          </div>
        )}
        {/* <div>
          <Select
            title="Select Categories"
            options={categories}
            value={selectedCategory.value}
            onSelect={setSelectedCategory}
          />
        </div> */}
        {reportType === "task" && (
          <div>
            <MultiSelect
              title="Categories"
              value={selectedCategories.filter((item) => item !== "_")}
              options={categories}
              onSelect={setSelectedCategories}
            />
          </div>
        )}
        {/* <div>
          <Select
            title="Participant"
            options={participants}
            value={selectedParticipant.value}
            onSelect={setSelectedParticipant}
          />
        </div> */}
        {reportType === "task" && (
          <div>
            <MultiSelect
              title="Participants"
              value={selectedParticipants.filter((item) => item !== "_")}
              options={participants}
              onSelect={setSelectedParticipants}
            />
          </div>
        )}
        {reportType === "task" && (
          <div>
            <MultiSelect
              title="Statuses"
              value={selectedStatuses}
              options={statuses}
              onSelect={setSelectedStatuses}
            />
          </div>
        )}
        {/* <div>
          <Select
            title="Select Status"
            options={statuses}
            value={selectedStatus.value}
            onSelect={setSelectedStatus}
          />
        </div> */}

        {validateFields() ? (
          <Row className="rowGap2">
            <Col md={6}>
              <DateInput
                label="From Date"
                value={fromDate}
                setValue={setFromDate}
                onCalendarOpen={handleCalendarVisibility}
              />
            </Col>
            <Col md={6}>
              <DateInput
                label="To Date"
                value={toDate}
                setValue={setToDate}
                onCalendarOpen={handleCalendarVisibility}
              />
            </Col>
          </Row>
        ) : null}
      </div>
      <div className={style.popupBtns}>
        <Button type="submit" onClick={handleDownloadReport}>
          <span>{fromDate && toDate ? "Download Report" : "Submit"}</span>
        </Button>
      </div>
    </Popup>
  );
};

export default ReportPopup;
