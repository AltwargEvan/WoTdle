import { t } from "@/i18n";
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
                return `<div class="font-bold">${val.toString()} ${t(
                  "statistics.guesses"
                )}</div>`;
            },
          },
        },
        xaxis: {
          title: {
            text: t("statistics.numGames"),
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
            text: t("statistics.numGuesses"),
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
          name: t("statistics.games"),
          data: series,
        },
      ]}
    />
  );
};

export default StatGraph;
