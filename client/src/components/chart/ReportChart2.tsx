// components/ApexChart.tsx
import dynamic from "next/dynamic";
import { useState } from "react";

import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component to ensure it only loads on the client side
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartData {
  label: string;
  value: number;
}

// Define the types for `series` and `options` based on ApexCharts types
const ReportChart2: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([
    { label: "In Progress", value: 40 },
    { label: "Scheduled", value: 44 },
    { label: "Stuck", value: 5 },
    { label: "Done", value: 200 },
  ]);

  // Extract series and labels from the data
  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.label);

  const [options, setOptions] = useState<ApexOptions>({
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
          size: "80%", // Adjusts the size of the donut hole if needed
        },
        expandOnClick: true, // Controls whether segment expands on click
      },
    },
    labels: ["In Progress", "Scheduled", "Stuck", "Done"],
    stroke: {
      width: 1, // Sets the border width of each segment
      colors: ["#fff"], // Set border color (white in this case)
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
      height: 60,
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        width: 12,
        height: 12,
      } as any,
      // CSS will handle two-column styling
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
      formatter: (seriesName: string, opts: any) => {
        const index = opts.seriesIndex; // Get the index of the clicked series
        return `${labels[index]}: ${opts.w.globals.series[index]}`; // Return custom label
      },
    },
    colors: ["#FFAB40", "#3D85C6", "#A61C00", "#00C875"],
    // tooltip: {
    //     shared: true,
    //     formatter: function (val: number, { seriesIndex }: { seriesIndex: number }) {
    //         return `${labels[seriesIndex]}: ${val}`; // Custom tooltip formatting
    //     },
    // },
  });

  return (
    <div className={"report-chart"}>
      <div className="chart-wrap">
        <h4>Track Overall progress</h4>
        <div id="chart">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            width={380}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportChart2;
