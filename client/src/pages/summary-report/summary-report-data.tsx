import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import styles from "./summary.module.css";
import SideBar from "@/layouts/DashboardLayout/_partials/SideBar";

const SummaryData = ({ data }: any) => {
  const [keyOperationalActivities, setKeyOperationalActivities] = useState([]);

  const [topPriorities, setTopPriorities] = useState([]);

  const [projectTimeline, setProjectTimeline] = useState([]);

  const [milestoneDetails, setMilestoneDetails] = useState([]);

  const [risks, setRisks] = useState([]);

  const getFormattedData = (date: string) => {
    const newData = new Date(date);

 
    const day = newData.getUTCDate(); 
    const month = newData.toLocaleString("en-US", { month: "short" }); 

    return `${day} ${month}`;
  };

  useEffect(() => {
    if (data) {
      if (data.activityTask?.length) {
        setKeyOperationalActivities(
          data.activityTask.map((task: any) => {
            return {
              task: task.name,
              dueDate: getFormattedData(task.due_date),
            };
          })
        );
      }
      if (data?.risktask.length) {
        setRisks(
          data.risktask.map((task: any) => {
            return {
              task: task.name,
              dueDate: getFormattedData(task.due_date),
            };
          })
        );
      }
      //   setTopPriorities(data.topPriorities);
      if ((data?.priorityTask) && data?.priorityTask.length) {
        setTopPriorities(data?.priorityTask);
      }
      setProjectTimeline(data?.summarytask.map((task: any) => task.name));
      if (data?.milestonetask?.length) {
        setMilestoneDetails(
          data.milestonetask.map((task: any) => {
            return {
              task: task.category_name,
              progress: `${task.donePercentage.toFixed(2)}%`,
            };
          })
        );
      }
    }
  }, [data]);

  return (
    <div className={styles.dashboardOverview}>
      <Row className="mb-4">
        <Col md={4} className={styles.milestoneDetails}>
          <div className="">
            <h5 className={`card-title ${styles.cardTitle}`}>
              Key Operational Activities
            </h5>
            <Table>
              <thead>
                <tr className="border">
                  <th>Task</th>
                  <th className={styles.partitionColumn}></th>
                  <th className="text-center border">Due Date</th>
                </tr>
              </thead>
              {keyOperationalActivities.length ? (
                <tbody className="border">
                  {keyOperationalActivities
                    .slice(0, 5)
                    .map((activity: any, index) => (
                      <tr key={index}>
                        <td>{activity.task}</td>
                        <td className={styles.partitionColumn}></td>
                        <td className="text-center">{activity.dueDate}</td>
                      </tr>
                    ))}
                </tbody>
              ) : (
                ""
              )}
            </Table>
          </div>
        </Col>

        <Col md={8} className={styles.projectTimeline}>
          <div>
            <div className="card">
              <h5 className={`card-title ${styles.cardTitle}`}>
                Project Timeline
              </h5>
              {/* <div className={styles.timeline}>
                {projectTimeline.slice(0, 6).map((task, index) => (
                  <div className={styles.timelineItem} key={index}>
                  <h6>{task}</h6>
                    <span className={styles.timelineNumber}>{index + 1}</span>
                    
                  </div>
                ))}
              </div> */}
               <div className={styles.timeline}>
                {projectTimeline.slice(0, 6).map((task, index) => (
                  <div className={styles.timelineItem} key={index}>
                    <div className={styles.timelineNumber}>{index + 1}</div>
                    <div className={styles.timelineLabel}><h6>{task}</h6></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4} className={styles.topPriorities}>
          
            <h5 className={`card-title ${styles.cardTitle}`}>
              Top 5 Priorities
            </h5>
            <Table>
              <thead className="border">
                <tr>
                  <th>Rank</th>
                  <th className={styles.partitionColumn}></th>
                  <th>Task</th>
                </tr>
              </thead>
              {topPriorities.length ? (
                <tbody className="border">
                  {topPriorities.slice(0, 5).map((priority: any, index) => (
                    <tr key={index}>
                        <td>#{index + 1}</td>
                      <td className={styles.partitionColumn}></td>
                      <td>{priority?.name}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                ""
              )}
            </Table>
          
        </Col>

        <Col md={4} className={styles.milestoneDetails}>
          
            <h5 className={`card-title ${styles.cardTitle}`}>
              Milestone Details
            </h5>
            
            <Table>
              <thead className="border">
                <tr>
                  <th>Task</th>
                  <th className={styles.partitionColumn}></th>
                  <th className="text-center">%</th>
                
                </tr>
              </thead>
              <tbody className="border">
           
  {milestoneDetails
    .slice(0, 5)
    .map((milestone: any, index: any) => (
      <tr key={index}>
       
        <td>{milestone.task}</td>
          <th className={styles.partitionColumn}></th>
        <td className="text-center">
          {milestone.progress !== undefined && !isNaN(parseFloat(milestone.progress))
            ? Math.round(parseFloat(milestone.progress))+ "%"
            : 0 }
        </td>
      </tr>
    ))}
</tbody>

            </Table>
          
        </Col>
      
        <Col md={4} className={styles.risks}>
          {risks.length ? (
          
              <><h5 className={`card-title ${styles.cardTitle}`}>Risks</h5><Table>
              <thead className="border">
                <tr>
                  <th>Task</th>
                  <th className={styles.partitionColumn}></th>
                  <th className="text-center">Due Date</th>
                </tr>
              </thead>
              <tbody className="border">
                {risks.slice(0, 5).map((risk: any, index) => (
                  <tr key={index}>
                    <td>{risk.task}</td>
                    <td className={styles.partitionColumn}></td>
                    <td>{risk.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </Table></>
            
           
          
          ) : (
            ""
          )}
          
        </Col>
      </Row>
    </div>
    
  );
};

export default SummaryData;
