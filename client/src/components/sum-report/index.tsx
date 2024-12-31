import Layouts from "@/layouts";
import { format } from "date-fns"; 
import routes from "@/routes";
import { debounce } from "lodash";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "@/context";
import { useRouter } from "next/router";
import { getSummaryReportAPI } from "@/pages/api/report";
import ReportChart4 from "@/pages/summary-report/ReportChart";
import styles from "@/pages/summary-report/chart.module.css";
import { ApexOptions } from "apexcharts";
import SummaryData from "@/pages/summary-report/summary-report-data";
import Loader from "../Loader/Loader";
import Image from "next/image";
import date from "@/pages/api/date/index.js"
const Report = () => {
  const context = useContext(MainContext);
  const [currentDate, setCurrentDate] = useState("");
  const orgId: any = context?.organizationData?.value?._id;
  const router = useRouter();
  const [summaryReportInfo, setSummaryReportInfo] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);

  const getSummaryReport = debounce(() => {
    if (!orgId) return;
    getSummaryReportAPI(
      orgId,
      (response) => {
        setSummaryReportInfo(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }, 300);
  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await fetch("/api/date");
        const data = await response.json(); 
        setCurrentDate(data.currentDate); 
      } catch (error) {
        console.error("Error fetching date:", error);
      }
    };
    
    fetchDate(); 
  }, []); 
  useEffect(() => {
    getSummaryReport();
  }, []);

 
  const [taskPopupVisible, setTaskPopupVisible] = useState<boolean>(false);
  const [sideBarTaskId, setSideBarTaskId] = useState<string>("");
  const [subTaskOpened, setSubTaskOpened] = useState<boolean>(false);

  const toggleTaskVisibility = (taskId: string, isSubTask?: boolean) => {
    setTaskPopupVisible(!taskPopupVisible);
    setSideBarTaskId(taskId);
    setSubTaskOpened(isSubTask ? true : false);
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

  interface ChartData {
    label: string;
    value: number;
  }

  const [data, setData] = useState<ChartData[]>([
    { label: "In-Progress", value: 40 },
    { label: "Not started", value: 44 },
    { label: "Delayed", value: 5 },
    { label: "Done", value: 200 },
  ]);

  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.label);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      width: "100%",
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              formatter: () => "40",
            },
            total: {
              show: true,
              showAlways: true,
              label: "Overall Progress",
              fontSize: "16px",
              fontWeight: "normal",
              color: "#666",
              formatter: () => "40",
            },
          },
        },
        expandOnClick: false,
      },
    },
    labels,
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    legend: {
      position: "left",
      offsetY: 0,
      fontSize: "14px",
      markers: {
        size: 10,
      },
      itemMargin: {
        vertical: 8,
      },
    },
    colors: ["#FFAB40", "#3D85C6", "#A61C00", "#00C875"],
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  if (!summaryReportInfo) return <Loader />;

  return (
    <Layouts type="dashboard" pageName="Report">
      <div className={"report-sheet"}>
        <Row>
          <Col lg={12}>
            <div className={"section-1"}>
              <div className={"content-sec"}>
                <div className={"heading"}>
                  <h3>Dashboard Cybersecurity Status ({currentDate})</h3>
                  <div className="summary px-4">
                    The results displayed are based on the filters you have applied. Adjust the filters to refine your search <br />
                    and find the specific data you&#39;re looking for.
                    <div className={styles.chartTitle2}>
                      <div className={styles.chartFlex}>
                        <div className={styles.legend}>
                          <ul>
                            <h5 className={styles.chartTitle}>Track Overall progress</h5>
                            {summaryReportInfo?.overallstatus?.map((item: any, index: any) => (
                              <li key={index} className={styles.legendItem}>
                                <span
                                  className={styles.legendMarker}
                                  style={{ backgroundColor: item?.color }}
                                ></span>
                                {item.label}: {item.value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Image
                    src="/assets/images/logo.svg"
                    alt="Logo"
                    width={180}
                    height={180}
                    className="ImageSummary"
                  />
                  <div>
                    <SummaryData data={summaryReportInfo} />
                  </div>

                  <h5 className={`card-title ${styles.cardTitle}`}>
                    Framework Report Overall Progress
                  </h5>
                  <div className="summary2">
                    {Object.keys(summaryReportInfo?.transformedStatus).map((key, index) => (
                      <div className="justify-center mb-4" key={index}>
                        <h3 className={styles[key]}>{key}</h3>
                        <div className="card m-3 p-2 px-5">
                          <ReportChart4 chartData={summaryReportInfo?.transformedStatus[key]} />
                          <div className="legend-container">
                            <ul className="custom-grid custom-legend">
                              {summaryReportInfo?.transformedStatus[key]?.map((item: any, index: any) => (
                                <li key={index} className="custom-item">
                                  <span
                                    className="custom-marker"
                                    style={{ backgroundColor: item?.color }}
                                  ></span>
                                  {item.label}: {item.value}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Layouts>
  );
};

export default Report;

