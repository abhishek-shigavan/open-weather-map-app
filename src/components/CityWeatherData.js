import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import WeatherDataCard from "./WeatherDataCard";
import { makeStyles, Box, Typography } from "@material-ui/core";
import { getDataByCityId, getDataByLatLon } from "../service/WeatherDataService";
import CircularProgress from '@mui/material/CircularProgress';
import TemperatureBarChart from "./TemperatureBarChart";
import moment from "moment-timezone";

const useStyles = makeStyles({
    customBoxStyle: {
        display: "flex",
        flexDirection: "row",
        width: "90%",
        flexWrap: "wrap",
        justifyContent: "center",
        alignSelf: "center",
        paddingTop: 70,
        paddingLeft: "5%"
    },
    customBoxForTempGraph: {
        display: "flex",
        flexDirection: "column",
        width: 596,
        marginLeft: 416,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 42,
        paddingBottom: 42,
        marginBottom: 70,
        border: "1px solid #E8E8E8"
    },
    customGraphCityName: {
        fontSize: 22,
        fontWeight: 700
    }
}); 

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function CityWeatherData() {
    const styles = useStyles();
    const navigate = useHistory();
    const query = useQuery();
    const [cityIdList, setCityIdList]  = useState([]);
    const [nextWeekData, setNextWeekData] = useState([]);
    const [dataSetForGraph, setDataSetForGraph] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [graphCityName, setGraphCityName] = useState("");
    const [graphCityTimeZone, setGraphCityTimeZone] = useState("");

    useEffect(()=> {
        if(query.get("id") !== null) setCityIdList(query.get("id").split(',')); 
    },[query.get("id")])

    useEffect(() => {
        setDataLoading(true);
        setDataSetForGraph([]);
        if(cityIdList.length > 0) 
            getDataByCityId(cityIdList[0]).then(res => {
                setGraphCityName(res.data.name);
                getDataByLatLon(res.data.coord.lat, res.data.coord.lon).then(result => {
                    setGraphCityTimeZone(result.data.timezone);
                    setNextWeekData(result.data.daily);
                })
        })
    },[cityIdList])

    useEffect(() => {
        extractDataForGraph();
    },[nextWeekData])

    const removeCityByIndex = (position) => {
        cityIdList.splice(position,1);
        if(cityIdList.length > 0) {
            let cityIdString = "";
            cityIdList.forEach(cityId => { let temp = cityId;
                cityIdString = cityIdString + temp +","
            })
            navigate.push(`/weather?id=${cityIdString.slice(0, -1)}`)
        }
        else if(cityIdList.length === 0) { 
            navigate.push("/");
        }     
    }

    const extractDataForGraph = () => {
        nextWeekData.map((data, dayNo) => {
            const dataOBJ = {
                Day: moment().tz(graphCityTimeZone).add(Number(dayNo+1), 'days').format('MMM D').toString(),
                Temperature: ~~(+data.temp.day)
            }
            dataSetForGraph.push(dataOBJ);
        })
        setDataLoading(false)
    }

    const openCityWeatherData = cityIdList.length > 0 ? true : false;

    return(
        <>
            <Navbar />
            {openCityWeatherData && (
                <Box className={styles.customBoxStyle}>
                    {cityIdList.map((cityId, cityPositionInData) => (
                        <WeatherDataCard position={cityPositionInData}  CityID={cityId} removeCityCard={removeCityByIndex}/>
                    ))}
                </Box>
            )}
            {dataLoading ? (
                <Box className={styles.customBoxForTempGraph}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box className={styles.customBoxForTempGraph}>
                    <Typography className={styles.customGraphCityName}>{graphCityName + " : Next 8 days temperature"}</Typography>
                    <TemperatureBarChart graphData={dataSetForGraph} />
                </Box>
            )}
        </> 
    )
}

export default CityWeatherData;