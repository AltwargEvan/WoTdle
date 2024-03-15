import { SolidApexCharts } from "solid-apexcharts";
import { Component } from "solid-js";

type timeslice = number;
type value = number;

const StatGraph: Component<{
  data: { series: Array<[timeslice, value]>; maxY: number };
}> = ({ data: { series, maxY } }) => {
  return (
    <SolidApexCharts
      type="area"
      options={{
        chart: {
          type: "area",
          stacked: false,
          height: 350,
          toolbar: {
            show: false,
          },
          zoom: {
            type: "x",
            enabled: false,
            autoScaleYaxis: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },

        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100],
          },
        },
        theme: {},
        tooltip: {
          shared: false,
          theme: "dark",
        },
        xaxis: {
          title: {
            text: "Number of Guesses",
          },
        },
        yaxis: {
          title: {
            text: "Number of Games",
          },
          max: maxY + 1,
        },
      }}
      series={[
        {
          name: "Games",
          data: series,
        },
      ]}
    />
  );
};

export default StatGraph;
