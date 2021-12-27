import React from "react";
import { Group } from '@visx/group';
import { scaleLinear, scaleBand, scaleOrdinal } from '@visx/scale';
import { makeStyles, Box } from "@material-ui/core";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { BarGroup } from '@visx/shape';
import { LinearGradient } from "@visx/gradient";

const useStyles = makeStyles({
    customBoxForGraph: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 600,
        height: 600,
        border: "1px solid #E8E8E8"
    },
    ['@media(max-width: 1366px) and (min-width: 1300px)']: {
        graphDimension: {
            width: 800
        }
    },
    ['@media(max-width: 1299px) and (min-width: 1250px)']: {
        graphDimension: {
            width: 700
        }
    },
    ['@media(max-width: 1249px) and (min-width: 1100px)']: {
        graphDimension: {
            width: 620
        }
    },
});



function TemperatureGroupBarChart(props) {
  const styles = useStyles();
  const data = props.GraphDataset;
  
  const keys = Object.keys(data[0]).filter((d) => d !== 'date');
  // console.log("Keys : ",keys);
  const margin = { top: 40, right: 0, bottom: 40, left: 45 }
  const width = 800;
  const height = 400;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  // accessors
  const getDate = (d) => d.date;
  // scales
  const dateScale = scaleBand({
      domain: data.map(getDate),
      padding: 0.2,
  });
  const cityScale = scaleBand({
      domain: keys,
      padding: 0.1,
  });
  const tempScale = scaleLinear({
      range: [yMax, margin.bottom],
      domain: [Math.min(...data.map((d) => Math.min(...keys.map((key) => Number(d[key]))))) - 1, Math.max(...data.map((d) => Math.max(...keys.map((key) => Number(d[key]))))) + 1],
  });
  const colorScale = scaleOrdinal({
      domain: keys,
      range: [ "#30e3f7", "#07bace", "#058593",  "#2393B2", "#054063"],
      // range: ["#807e7e", "#676464", "#4d4b4b", "#333232", "#191919"]
  });

  dateScale.rangeRound([margin.left, xMax]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <LinearGradient from="#EAEAEA" to="#A2A2A2" id="custom"/>
      <rect x={0} y={0} width={width} height={height} fill="url(#custom)" rx={14} />
      <AxisLeft 
          left={margin.left} 
          top={margin.top}
          scale={tempScale} 
          stroke={"#000000"}
          hideTicks={true}
      />
      <Group top={margin.top} left={0}>
        <BarGroup
          data={data}
          keys={keys}
          height={yMax}
          x0={getDate}
          x0Scale={dateScale}
          x1Scale={cityScale}
          yScale={tempScale}
          color={colorScale}
        >
          {(barGroups) =>
            barGroups.map((barGroup) => (
              <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                {barGroup.bars.map((bar) => (
                  <rect
                    key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    rx={4}
                  />
                ))}
              </Group>
            ))
          }
        </BarGroup>
      </Group>
      <AxisBottom
        top={yMax + margin.top}
        scale={dateScale}
        stroke={"#000000"}
        hideTicks={true}
      />
    </svg>
  );
}

export default TemperatureGroupBarChart;