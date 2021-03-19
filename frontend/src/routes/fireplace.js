import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Calls from "../calls";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from "victory";
var dateformat = require("dateformat");

function Fireplace() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Calls.loadFireplace.call().then((e) => {
      if (Array.isArray(e)) {
        setData(e.filter((d, i) => d.t1 > 10 && d.t2 > 10 && !(i % 20)));
      }
    });
    setInterval(() => {
      Calls.loadFireplace.call().then((e) => {
        if (Array.isArray(e)) {
          setData(e.filter((d, i) => d.t1 > 10 && d.t2 > 10 && !(i % 20)));
        }
      });
    }, 10000);
  }, []);

  if (data.length === 0) return "No data";

  return (
    <Container>
      <h1>Kotel</h1>
      <VictoryChart
        theme={VictoryTheme.material}
        width={600}
        height={300}
        scale={{ x: "time", y: "linear" }}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiDimension="x"
            labels={(x) => {
              if (x.datum.t1)
                return `${dateformat(
                  new Date(parseInt(x.datum.time)),
                  "HH:MM:ss"
                )}\ninput: ${x.datum.t1}`;
              if (x.datum.t2) return `output: ${x.datum.t2}`;
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={3}
                flyoutStyle={{ fill: "white" }}
              />
            }
          />
        }
      >
        <VictoryAxis
          tickFormat={(x) => {
            let date = new Date(parseInt(x));
            return (
              date.getHours() +
              ":" +
              (date.getMinutes() < 10
                ? "0" + date.getMinutes()
                : date.getMinutes())
            );
          }}
          tickCount={7}
          invertAxis={true}
        />
        <VictoryAxis dependentAxis tickCount={7} />
        <VictoryLine
          style={{
            data: { stroke: "tomato" },
          }}
          data={data.map((d) => {
            return { t1: d.t1, time: d.time };
          })}
          x="time"
          y="t1"
        />
        <VictoryLine
          style={{
            data: { stroke: "blue" },
          }}
          data={data.map((d) => {
            return { t2: d.t2, time: d.time };
          })}
          x="time"
          y="t2"
        />
      </VictoryChart>
    </Container>
  );
}

export default Fireplace;
