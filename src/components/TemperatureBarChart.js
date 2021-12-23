import React from "react";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import {GradientTealBlue, LinearGradient} from "@visx/gradient"

function TemperatureBarChart(props) {
 
    const data = props.graphData;
    const getXValue = d => d.Day;
    const getYValue = d => d.Temperature;

    const margin = 64;
    const width = 500;
    const height = 300;

    const innerWidth = width - margin;
    const innerHeight = height - margin;

    const xScale = scaleBand({
        range: [margin, innerWidth],
        round: true,
        domain: data.map(getXValue),
        padding: 0.4,
    });

    const yScale = scaleLinear({
        range: [innerHeight, margin],
        round: true,
        domain: [
            Math.min(...data.map(getYValue)) - 1,
            Math.max(...data.map(getYValue)) + 1,
        ],
    });

    return (
        <svg width={width} height={height}>
            <LinearGradient from="#EAEAEA" to="#A2A2A2" id="custom"/>
            <rect width={width} height={height} fill="url(#custom)" rx={14} />
            <Group>
                {data.map((d) => {
                    const xValue = getXValue(d);
                    const barWidth = xScale.bandwidth();
                    const barHeight = innerHeight - (yScale(getYValue(d)) ?? 0);
                    const barX = xScale(xValue);
                    const barY = innerHeight - barHeight;
                    return (
                        <Bar
                            key={`bar-${xValue}`}
                            x={barX}
                            y={barY}
                            width={barWidth}
                            height={barHeight}
                            fill="#747474"
                        />
                    )
                })}
            </Group>
            <Group>
                <AxisBottom top={innerHeight} scale={xScale} hideTicks={true} label={"Week Days"} labelProps={{fontSize: 14, fontWeight: 500, x: 215, y: 50}}/>
            </Group>
            <Group>
                <AxisLeft left={margin} scale={yScale} hideTicks={true} label={"Temperature In \u00B0C"} labelProps={{fontSize: 14, fontWeight: 500, x: -200}}/>
            </Group>
        </svg>
    );
}

export default TemperatureBarChart;