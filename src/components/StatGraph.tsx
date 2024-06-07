import { SolidApexCharts } from "solid-apexcharts";
import { Component } from "solid-js";
import * as m from "@/paraglide/messages.js";

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
                return `<div class="font-bold">${val.toString()} ${m.stats_guesses()}</div>`;
            },
          },
        },
        xaxis: {
          title: {
            text: m.stats_num_games(),
            style: {
              color: "#d4d4d4",
            },
          },
          labels: {
            style: {
              colors: ["#d4d4d4"],
            },
          },
          stepSize: 1,
        },
        yaxis: {
          title: {
            text: m.stats_num_guesses(),
            style: {
              color: "#d4d4d4",
            },
          },
          labels: {
            style: {
              colors: ["#d4d4d4"],
            },
          },
        },
      }}
      series={[
        {
          name: m.stats_games(),
          data: series,
        },
      ]}
    />
  );
};

export default StatGraph;
