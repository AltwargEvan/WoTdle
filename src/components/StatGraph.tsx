import { SolidApexCharts } from "solid-apexcharts";
import { Component } from "solid-js";
import { render } from "solid-js/web";

type timeslice = number;
type value = number;

const StatGraph: Component<{ data: Array<[timeslice, value]> }> = ({
  data,
}) => {
  return (
    <SolidApexCharts
      type="area"
      options={{
        chart: {
          type: "area",
          stacked: false,
          height: 350,
          zoom: {
            type: "x",
            enabled: false,
            autoScaleYaxis: true,
          },
          toolbar: {
            show: false,
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
          type: "datetime",
        },
      }}
      series={[
        {
          name: "Guesses",
          data: data,
        },
      ]}
    />
  );
};

export default StatGraph;
