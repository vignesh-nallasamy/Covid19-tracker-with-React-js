import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const casesTypeColors = {
  cases: {
    hex: "#0A79DF",
    rgb: "rgb(204,16,52)",
    half_op: "rgba()",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125,215,29)",
    half_op: "rgba(125,215,29,0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251,68,67)",
    half_op: "rgba(251,68,67,0.5)",
    multiplier: 2000,
  },
};

function LineGraph({ type }) {
  const [graphData, setGraphData] = useState([]);

  const generateGraphData = (data, type) => {
    const resultArray1 = [];
    const resultArray2 = [];
    let count = 0;
    let previous;
    for (let item in data[type]) {
      if ((count = 0)) {
        previous = data[type][item];
        count = 1;
      } else {
        resultArray1.push(item);
        resultArray2.push(data[type][item] - previous);
        previous = data[type][item];
      }
    }

    const output = {
      labels: resultArray1,
      data: resultArray2,
    };

    console.log(output);
    return output;
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
      .then((response) => response.json())
      .then(async (data) => {
        const processedData = await generateGraphData(data, type);
        setGraphData({
          labels: processedData["labels"],
          datasets: [
            {
              label: { type },
              fill: false,
              lineTension: 0.5,
              backgroundColor: casesTypeColors[type].hex,
              borderColor: casesTypeColors[type].hex,
              borderWidth: 2,
              data: processedData["data"],
            },
          ],
        });
      });
  }, [type]);

  return (
    <div style={{ marginTop: "20px" }}>
      <Line data={graphData} options={options} />
    </div>
  );
}

export default LineGraph;
