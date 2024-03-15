import { SolidApexCharts } from "solid-apexcharts";
import { Component } from "solid-js";

const StatGraph: Component<{
  data: { series: Array<{ x: string; y: number }>; maxY: number };
}> = ({ data: { series, maxY } }) => {
  return (
    <SolidApexCharts
      type="area"
      options={{
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: false,
          },
        },
        grid: {
          show: false,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        tooltip: {
          shared: false,
          theme: "dark",
          x: {
            formatter(val, _opts) {
              if (val == 1) return `<div class="font-bold">1 Guess</div>`;
              else
                return `<div class="font-bold">${val.toString()} Guesses</div>`;
            },
          },
        },
        xaxis: {
          title: {
            text: "Number of Games",
          },
          stepSize: 1,
        },
        yaxis: {
          title: {
            text: "Number of Guesses",
          },
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
