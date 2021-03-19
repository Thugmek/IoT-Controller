import { ContactlessOutlined } from "@material-ui/icons";
import "./chart.css";

function Chart(props) {
  console.log(props.data);
  let lines = [];
  const timeOffset = Date.now() - 3000 * 1300 * 20;

  function map(f1, f2, t1, t2, v) {
    return ((v - f1) * (t2 - t1)) / (f2 - f1) + t1;
  }
  if (!props.data || props.data.length === 0) return "No data";
  let max = props.data[0].t1;
  let min = max;

  let dataIn = props.data.filter(
    (d, i) => d.t1 > 10 && d.t2 > 10 && !(i % 100)
  );

  console.log("dataIn", dataIn);

  for (let i = 1; i < dataIn.length; i++) {
    if (dataIn[i].t1 > max) max = dataIn[i].t1;
    if (dataIn[i].t1 < min) min = dataIn[i].t1;
  }

  for (let i = 0; i < dataIn.length; i++) {
    if (dataIn[i].t2 > max) max = dataIn[i].t2;
    if (dataIn[i].t2 < min) min = dataIn[i].t2;
  }

  console.log("min", min);
  console.log("max", max);

  const data = dataIn.map((d) => {
    return {
      v: map(min, max, 480, 20, d.t1),
      v2: map(min, max, 480, 20, d.t2),
      time: (d.time - timeOffset) * props.timeScale,
    };
  });

  console.log("data", data);

  for (let i = 1; i < data.length; i++) {
    lines.push(
      <>
        <line
          x1={data[i - 1].time}
          x2={data[i].time}
          y1={data[i - 1].v}
          y2={data[i].v}
        ></line>
        <circle
          className="chartPoint"
          cx={data[i].time}
          cy={data[i].v}
          r="4"
        ></circle>

        <line
          x1={data[i - 1].time}
          x2={data[i].time}
          y1={data[i - 1].v2}
          y2={data[i].v2}
        ></line>
        <circle
          className="chartPoint"
          cx={data[i].time}
          cy={data[i].v2}
          r="4"
        ></circle>
      </>
    );
    /*
    lines.push(
      <>
        <line
          x1={(props.data[i - 1].time - timeOffset) * props.timeScale}
          x2={(props.data[i].time - timeOffset) * props.timeScale}
          y1={props.data[i - 1]["t1"] * props.scale}
          y2={props.data[i]["t1"] * props.scale}
        ></line>
        <circle
          className="chartPoint"
          cx={(props.data[i - 1].time - timeOffset) * props.timeScale}
          cy={props.data[i - 1]["t1"] * props.scale}
          r="4"
        ></circle>
      </>
    );
     */
  }

  return (
    <svg className="chart">
      <g>
        <line x1="90" x2="90" y1="0" y2="480"></line>
      </g>
      <g>
        <line x1="90" x2="705" y1="480" y2="480"></line>
      </g>
      <g
        style={{
          stroke: "blue",
        }}
      >
        {lines}
      </g>
    </svg>
  );
}

export default Chart;
