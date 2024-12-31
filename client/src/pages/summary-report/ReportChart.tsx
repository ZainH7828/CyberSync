import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import SummaryData from "./summary-report-data";


const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartData {
    label: string;
    value: number;
    color?: string;
}

const ReportChart4: React.FC<any> = ({ chartData }: any) => {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (chartData) {
            setData(chartData);
        }
    }, [chartData]);

    const series = data.map((item) => item.value);
    const labels = data.map((item) => item.label);
    const colors = data.map((item) => item.color);



    const options : ApexOptions = {
        chart: {
            type: 'donut',
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        name: {
                            show: false, 
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#333',
                            formatter: () => '', 
                        },
                        // total: {
                        //     show: true,
                        //     label: 'Overall Progress', 
                        //     fontSize: '16px',
                        //     fontWeight: 'normal',
                        //     color: '#666',
                        //     formatter: () => '',
                        // },
                    },
                },
            },
        },
        labels,
        stroke: {
            width: 2,
            colors: ['#fff'],
        },
        legend: {
            show: false,
        },
        colors: colors,
    };

    return (
        <div className="dashboard">
            <div className="dashboardContent">
                <div className="chartContainer">
                    <h5 className="text"><b>Overall progress %</b></h5>
                    <ReactApexChart options={options} series={series} type="donut" width={250} />
                </div>
            </div>
            
        </div>
    );
};

export default ReportChart4;
