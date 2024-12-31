import Heading from "@/components/Dashboard/Heading";
import Layouts from "@/layouts";
import routes from "@/routes";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Col, Row} from "react-bootstrap";
import TaskSideBar from "@/popups/TaskSideBar";
import {useContext, useState} from "react";
import TaskTable from "@/tables/TaskTable";
import {MainContext} from "@/context";
import Table from 'react-bootstrap/Table';
import ReportChart from "../../components/chart/RerpotChart";

const Dashboard = () => {
  const context = useContext(MainContext);

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

  return (
    <Layouts type="dashboard" pageName="Dashboard">
      <Heading {...heading} />
      {/* <div className={'report-sheet'}>
            <Row>
                <Col lg={12}>
                    <div className={'section-1'}>
                        <div className={'content-sec'}>
                            <div className={'heading'}>
                                <h3>Report generation</h3>
                                <p>The results displayed are based on the filters you have applied. Adjust the filters to refine your search and find the specific data you're looking for.</p>
                            </div>
                            <div className={'tags'}>
                                <span>Framework function: Identify and Respond</span>
                                <span>Category: Asset Management- ID.AM and  Incident Analysis - RS.AN</span>
                                <span>Participant: Romail Ahmed, Harjot Singh and Wasi Ahmed</span>
                                <span>Status: All status</span>
                            </div>
                            <div className={'info-list'}>
                                <ul>
                                    <li>
                                        <h5>300</h5>
                                        <p>Total Task</p>
                                    </li>
                                    <li>
                                        <h5>42</h5>
                                        <p>Participants</p>
                                    </li>
                                    <li>
                                        <h5>4</h5>
                                        <p>Framework functions</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={'chart-sec'}>
                            <ReportChart/>
                        </div>
                    </div>
                </Col>
            </Row>
           <Row>
               <Col md={12}>
                   <div className={'report-table'}>
                       <h3 className={'heading-f'}>Asset Management (ID.AM)</h3>
                       <div className={'table-sec'}>
                           <Table responsive bordered>
                               <thead>
                               <tr>
                                   <th style={{ width: '10px' }}>S.No</th>
                                   <th style={{ width: '300px' }}>Item</th>
                                   <th style={{ width: '150px' }}>Participant</th>
                                   <th style={{ width: '150px' }}>Due Date</th>
                                   <th style={{ width: '150px' }}>Status</th>
                               </tr>
                               </thead>
                               <tbody>
                               <tr>
                                   <td>1</td>
                                   <td>Lorem Ipsum is simply dummy text of the printing </td>
                                   <td>Romail</td>
                                   <td>15 April</td>
                                   <td className={'status'}>In Progress</td>
                               </tr>
                               <tr>
                                   <td>2</td>
                                   <td>Lorem Ipsum is simply dummy text of the printing </td>
                                   <td>Romail</td>
                                   <td>15 April</td>
                                   <td className={'status'}>In Progress</td>
                               </tr>
                               <tr>
                                   <td>3</td>
                                   <td>Lorem Ipsum is simply dummy text of the printing </td>
                                   <td>Romail</td>
                                   <td>15 April</td>
                                   <td className={'status'}>In Progress</td>
                               </tr>
                               </tbody>
                           </Table>
                       </div>

                   </div>
               </Col>
               <Col md={12}>
                   <div className={'report-table'}>
                       <h3 className={'heading-s'}>Incident Analysis (RS.AN)</h3>
                       <div className={'table-sec'}>
                           <Table responsive bordered>
                               <thead>
                               <tr>
                                   <th style={{ width: '10px' }}>S.No</th>
                                   <th style={{ width: '300px' }}>Item</th>
                                   <th style={{ width: '150px' }}>Participant</th>
                                   <th style={{ width: '150px' }}>Due Date</th>
                                   <th style={{ width: '150px' }}>Status</th>
                               </tr>
                               </thead>
                               <tbody>
                               <tr>
                                   <td>1</td>
                                   <td>Lorem Ipsum is simply dummy text of the printing </td>
                                   <td>Romail</td>
                                   <td>15 April</td>
                                   <td className={'status'}>In Progress</td>
                               </tr>
                               <tr>
                                   <td>2</td>
                                   <td>Lorem Ipsum is simply dummy text of the printing </td>
                                   <td>Romail</td>
                                   <td>15 April</td>
                                   <td className={'status'}>In Progress</td>
                               </tr>
                               <tr>
                                   <td>3</td>
                                   <td>Lorem Ipsum is simply dummy text of the printing </td>
                                   <td>Romail</td>
                                   <td>15 April</td>
                                   <td className={'status'}>In Progress</td>
                               </tr>
                               </tbody>
                           </Table>
                       </div>

                   </div>
               </Col>
           </Row>
       </div> */}
      <Row className="rowGap3">
        {context?.userDashboard.data?.categories.map((catItem, catIndex) => (
          <Col xs={12} key={catIndex}>
            <Row className="rowGap3">
              {catItem.subCategory.map((subCatItem, subCatIndex) => (
                <Col xs={12} key={subCatIndex}>
                  <TaskTable
                    {...subCatItem}
                    color={catItem.colorCode}
                    toggleTasksBar={toggleTaskVisibility}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        ))}
      </Row>
      <TaskSideBar
        taskId={sideBarTaskId}
        visibility={taskPopupVisible}
        toggleVisibility={toggleTaskVisibility}
        isSubtask={subTaskOpened}
      />
    </Layouts>
  );
};

export default Dashboard;
