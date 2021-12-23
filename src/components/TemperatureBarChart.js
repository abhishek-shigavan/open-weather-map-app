import React from "react";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { makeStyles, Box } from "@material-ui/core";

const useStyles = makeStyles({
    customBoxForGraph: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 596,
        height: 364,
        paddingLeft: 32
    }
});

function TemperatureBarChart(props) {
    const classes = useStyles();

    const data = props.graphData;
    const getXValue = d => d.Day;
    const getYValue = d => d.Temperature;

    const margin = 32;
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
        <Box className={classes.customBoxForGraph}>
            <svg width={width} height={height}>
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
                                fill="#fc2e1c"
                            />
                        )
                    })}
                </Group>
                <Group>
                    <AxisBottom top={innerHeight} scale={xScale} />
                </Group>
                <Group>
                    <AxisLeft left={margin} scale={yScale} />
                </Group>
            </svg>
        </Box>
    );
}

export default TemperatureBarChart;