// components/ApexChart.tsx
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component to ensure it only loads on the client side
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface ReportChartProps {
  data: any;
}

// Define the types for `series` and `options` based on ApexCharts types
const ReportChart: React.FC<ReportChartProps> = ({ data }: any) => {
  // Extract series and labels from the data
  // console.log("data", data);
  // const temp = [
  //   { label: "Completed", value: 10, color: "#00c3ff" },
  //   { label: "In Progress", value: 10, color: "#ffaa00" },
  //   { label: "Not Started", value: 34, color: "#ff0000" },
  //   { label: "Not Started", value: 76, color: "#ff0000" },
  //   { label: "Not Started", value: 54, color: "#ff0000" },
  //   { label: "Not Started", value: 43, color: "#ff0000" },
  // ];
  const series = data.map((item: any) => item.value);

  const [options, setOptions] = useState<ApexOptions | undefined>(undefined);

  useEffect(() => {
    if (data.length > 0) {
      // Extract series, labels, and colors from the data
      const labels = data.map((item: ChartData) => item.label);
      const colors = data.map((item: ChartData) => item.color || "#000"); // Default color if not provided

      setOptions({
        chart: {
          width: 380,
          type: "donut",
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            donut: {
              size: "80%",
            },
            expandOnClick: true,
          },
        },
        labels: labels,
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        responsive: [
          {
            breakpoint: 500,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                show: false,
              },
            },
          },
        ],
        legend: {
          position: "bottom",
          offsetY: 0,
          height: 100,
          horizontalAlign: "center",
          fontSize: "14px",
          markers: {
            size: 12,
          },
          itemMargin: {
            horizontal: 8,
          },
          onItemClick: {
            toggleDataSeries: true,
          },
          onItemHover: {
            highlightDataSeries: true,
          },
          formatter: (seriesName: string, opts: any) => {
            const index = opts.seriesIndex;
            return `<span>${seriesName} : ${opts.w.globals.series[index]}</span>`;
          },
        },
        colors: colors,
      });
    }
  }, [data]);

  return (
    <div className={"report-chart"}>
      <div className="chart-wrap">
        <h4>Track Overall progress</h4>
        <div id="chart">
          {options && series.length > 0 && (
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              width={380}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportChart;