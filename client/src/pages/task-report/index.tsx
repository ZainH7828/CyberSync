import Heading from "@/components/Dashboard/Heading";
import Layouts from "@/layouts";
import routes from "@/routes";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "react-bootstrap";
import TaskSideBar from "@/popups/TaskSideBar";
import { useContext, useEffect, useState } from "react";
import TaskTable from "@/tables/TaskTable";
import { MainContext } from "@/context";
import Table from "react-bootstrap/Table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReportChart from "../../components/chart/RerpotChart";
import { useRouter } from "next/router";
import { getReportInfoAPI, getReportDataAPI } from "../api/report";
import Button from "@/elements/Button";
import Loader from "@/components/Loader/Loader";

const Report = () => {
  const context = useContext(MainContext);
  const orgId: any = context?.organizationData?.value?._id;

  const router = useRouter();
  const [parsedData, setParsedData] = useState<any>({});
  const [reportInfo, setReportInfo] = useState<any>(null);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any>(null);
  const [reportShow, setReportShow] = useState<boolean>(false);

  const getReportInfo = () => {
    if (!orgId) return;
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

  const getReportData = (data: any) => {
    if (!orgId) return;
    getReportDataAPI(
      data,
      orgId,
      (response: any) => {
        setReportShow(true);
        setReportData(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const downloadPDF = async () => {
    const input = document.querySelector(".report-sheet"); // Add an ID to the element you want to convert to PDF
    if (input) {
      try {
        html2canvas(input as HTMLElement).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let position = 0;

          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          pdf.save("report.pdf");
          setIsDownloaded(true);
        });
      } catch (error) {
        console.log("errorrrr: ", error);
      }
    }
  };

  const formatDateToReadableString = (isoString: string): string => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" }); // e.g., "April"
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    if (router.isReady) {
      const {
        status,
        user,
        fromDate,
        toDate,
        subcategory,
        framework,
        reportType,
      }: any = router.query;
      const newParsedData = {
        framework: framework?.split(","),
        fromDate: fromDate || "",
        toDate: toDate || "",
        status: status?.split(","),
        user: user?.split(","),
        subcategory: subcategory?.split(","),
      };
      setParsedData(newParsedData);
      getReportInfo();
      getReportData(newParsedData);
    }
  }, [router.isReady, router.query]);

  const [taskPopupVisible, setTaskPopupVisible] = useState<boolean>(false);
  const [sideBarTaskId, setSideBarTaskId] = useState<string>("");
  const [subTaskOpened, setSubTaskOpened] = useState<boolean>(false);

  const toggleTaskVisibility = (taskId: string, isSubTask?: boolean) => {
    setTaskPopupVisible(!taskPopupVisible);
    setSideBarTaskId(taskId);
    setSubTaskOpened(isSubTask ? true : false);
  };

  const renderStatus = (status: string) => {
    let statusColor = "";
    let statusText = "";
    switch (status) {
      case "not-started":
        statusColor = "#bbb";
        statusText = "Not Started";
        break;
      case "in-progress":
        statusColor = "#fdab3d";
        statusText = "In Progress";
        break;
      case "needs-schedule":
        statusColor = "#DF2F4A";
        statusText = "Needs to Schedule";
        break;
      case "scheduled":
        statusColor = "#3D85C6";
        statusText = "Scheduled";
        break;
      case "stuck":
        statusColor = "#A61C00";
        statusText = "Stuck";
        break;
      // case "behind-schedule" or stuck
      case "behind-schedule":
      case "stuck":
        statusColor = "#A61C00";
        statusText = "Behind Schedule";
        break;
      case "on-hold":
        statusColor = "#9CD326";
        statusText = "On Hold";
        break;
      case "done":
        statusColor = "#00C875";
        statusText = "Done";
        break;
      default:
        statusColor = "#bbb";
        statusText = "";
    }

    return (
      <td
        className={"status"}
        style={{
          backgroundColor: statusColor,
        }}
      >
        {statusText || ""}
      </td>
    );
  };

  const heading = {
    heading: context?.organizationData.value?.name,
    ...(context?.userData.value?.rights.manageTeam && {
      rightLink: {
        link: routes.users.teamMembers,
        title: "Invite Users",
        icon: faPlus,
      },
    }),
  };

  if (reportData === null) {
    return <Loader />;
  }

  return (
    <Layouts type="dashboard" pageName="Report">
      <div className={"report-sheet"}>
        <Row>
          <Col lg={12}>
            <div className={"section-1"}>
              <div className={"content-sec"}>
                <div className={"heading"}>
                  <h3>Task-level Report</h3>
                  <p>
                    The results displayed are based on the filters you have
                    applied. Adjust the filters to refine your search and find
                    the specific data you are looking for.
                  </p>
                </div>
                {/* <div className={"tags"}>
                  <span>
                    Framework function:{" "}
                    {reportInfo?.framework
                      .filter((item: any) =>
                        parsedData?.framework?.includes(item._id)
                      )
                      ?.map((item: any) => item.name)
                      ?.join(", ") || ""}
                  </span>
                  <span>
                    Category:{" "}
                    {reportInfo?.category
                      .filter((item: any) =>
                        parsedData?.subcategory?.includes(item._id)
                      )
                      ?.map((item: any) => item.name)
                      ?.join(", ") || ""}
                  </span>
                  <span>
                    Participant:{" "}
                    {reportInfo?.user
                      .filter((item: any) =>
                        parsedData?.user?.includes(item._id)
                      )
                      ?.map((item: any) => item.name)
                      ?.join(", ") || ""}
                  </span>
                  <span>Status: {parsedData?.status?.join(", ") || ""}</span>
                  <span>
                    Date: {formatDateToReadableString(parsedData?.fromDate)} -{" "}
                    {formatDateToReadableString(parsedData?.toDate)}{" "}
                  </span>
                </div> */}
                <div className={"info-list"}>
                  <ul>
                    <li>
                      <h5>{reportData?.reportdata?.tasksCount || 0}</h5>
                      <p>Total Task</p>
                    </li>
                    <li>
                      <h5>{reportData?.reportdata?.usersCount || 0}</h5>
                      <p>Participants</p>
                    </li>
                    <li>
                      <h5>{reportData?.reportdata?.framworkCount || 0}</h5>
                      <p>Framework functions</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={"chart-sec"}>
                {/* {console.log("transformedStatus", reportData?.reportdata)} */}
                {reportShow &&
                reportData?.reportdata?.transformedStatus?.length ? (
                  <ReportChart
                    data={reportData?.reportdata?.transformedStatus}
                  />
                ) : (
                  ""
                )}
                {/* <ReportChart data={reportData?.reportdata?.transformedStatus} /> */}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          {reportData?.tasks?.length
            ? reportData?.tasks.map((task: any, index: number) => (
                <Col md={12} key={index}>
                  <div className={"report-table"}>
                    <h3 className={"heading-f"}>{task?.CategoryName}</h3>
                    <div className={"table-sec"}>
                      <Table responsive bordered>
                        <thead>
                          <tr>
                            <th style={{ width: "10px" }}>S.No</th>
                            <th style={{ width: "300px" }}>Item</th>
                            <th style={{ width: "150px" }}>Participant</th>
                            <th style={{ width: "150px" }}>Due Date</th>
                            <th style={{ width: "150px" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {task?.tasks.map(
                            (taskItem: any, taskIndex: number) => (
                              <tr key={taskIndex}>
                                <td>{taskIndex + 1}</td>
                                <td>{taskItem?.item || ""} </td>
                                <td>{taskItem?.participant || ""}</td>
                                <td>
                                  {formatDateToReadableString(
                                    taskItem?.dueDate
                                  ) || ""}
                                </td>

                                {renderStatus(taskItem?.status)}
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Col>
              ))
            : ""}
        </Row>
      </div>
      <Col xs={12} className="text-center">
        <Button theme="primary-outlined" onClick={downloadPDF}>
          <span>Download Report</span>
        </Button>
      </Col>
      <TaskSideBar
        taskId={sideBarTaskId}
        visibility={taskPopupVisible}
        toggleVisibility={toggleTaskVisibility}
        isSubtask={subTaskOpened}
      />
    </Layouts>
  );
};

export default Report;