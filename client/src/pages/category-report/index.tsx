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
import { getReportInfoAPI, getCategoryReportDataAPI } from "../api/report";
import ReportChart2 from "@/components/chart/ReportChart2";
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
    getCategoryReportDataAPI(
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

  const formatDateToReadableString = (isoString: string): string => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" }); // e.g., "April"
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
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

  useEffect(() => {
    if (router.isReady) {
      const { fromDate, toDate, framework, reportType }: any = router.query;
      const newParsedData = {
        fromDate: fromDate || "",
        toDate: toDate || "",
        framework: framework?.split(","),
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
                  <h3>Category Report generation</h3>
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
                  <span>Category: All Categories</span>
                  <span>Participant: All Participants</span>
                  <span>Status: All Statuses</span>
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
            </div>
            <div className="container-inline">
              {reportShow &&
                reportData?.tasks?.map((task: any, index: number) => (
                  <div key={index}>
                    <h3 className={"heading-f"} id="heading-b">
                      {task?.CategoryName || ""}
                    </h3>
                    {task?.transformedStatus.length && (
                      <ReportChart data={task.transformedStatus} />
                    )}
                    {/* <ReportChart2 /> */}
                  </div>
                ))}
              {/* <div>
                <h3 className={"heading-f"} id="heading-b">
                  Asset Management (ID.AM)
                </h3>
                <ReportChart2 />
              </div>
              <div>
                <h3 className={"heading-f"} id="heading-b">
                  Asset Management (ID.AM)
                </h3>
                <ReportChart2 />
              </div> */}
            </div>
            {/* <div className="container-inline" id="container-inline-2">
              <div>
                <h3 className={"heading-f"} id="heading-b">
                  Asset Management (ID.AM)
                </h3>
                <ReportChart2 />
              </div>
              <div>
                <h3 className={"heading-f"} id="heading-b">
                  Asset Management (ID.AM)
                </h3>
                <ReportChart2 />
              </div>
              <div>
                <h3 className={"heading-f"} id="heading-b">
                  Asset Management (ID.AM)
                </h3>
                <ReportChart2 />
              </div>
            </div> */}
          </Col>
        </Row>
      </div>
      <TaskSideBar
        taskId={sideBarTaskId}
        visibility={taskPopupVisible}
        toggleVisibility={toggleTaskVisibility}
        isSubtask={subTaskOpened}
      />

      <Col xs={12} className="text-center">
        <Button theme="primary-outlined" onClick={downloadPDF}>
          <span>Download Report</span>
        </Button>
      </Col>
    </Layouts>
  );
};

export default Report;
