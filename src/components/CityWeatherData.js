import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import WeatherDataCard from "./WeatherDataCard";
import { makeStyles, Box, Typography } from "@material-ui/core";
import { getDataByCityId, getDataByLatLon } from "../service/WeatherDataService";
import CircularProgress from '@mui/material/CircularProgress';
import TemperatureBarChart from "./TemperatureBarChart";
import moment from "moment-timezone";
import TemperatureGroupBarChart from "./TemperatureGroupBarChart";

const useStyles = makeStyles({
    customBoxStyle: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignSelf: "center",
        paddingTop: 70,   
        ['@media(max-width: 1366px) and (min-width: 1050px)']  : {
            width: "90%",
            paddingLeft: "5%"
        },
        ['@media(max-width: 1049px) and (min-width: 768px)'] : {
            width: "88%",
            paddingLeft: "6%"
        },
        ['@media(max-width: 475px) and (min-width: 320px)'] : {
            width: "88%",
            paddingLeft: "6%"
        },
    },
    customBoxForTempGraph: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 42,
        paddingBottom: 42,
        marginBottom: 70,
        border: "1px solid #E8E8E8",
        ['@media(max-width: 1366px) and (min-width: 1300px)']: { 
            width: "66%",
            marginLeft: "17%"
        },
        ['@media(max-width: 1299px) and (min-width: 1250px)']: {
            width: "70%",
            marginLeft: "15%"
        },
        ['@media(max-width: 1249px) and (min-width: 1151px)']: {
            width: "76%",
            marginLeft: "12%"
        },
        ['@media(max-width: 1150px) and (min-width: 1050px)'] : {
            width: "84%",
            marginLeft: "8%",
        }
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
    const [dataLoading, setDataLoading] = useState(true);
    const [graphCityName, setGraphCityName] = useState([]);
    const [graphCityTimeZone, setGraphCityTimeZone] = useState("");
    
    const [multiCityDataSet, setMultiCityDataSet] = useState([]);
    const [cityWeeklyTempList, setCityWeeklyTempList] = useState([]);
    const [cityList, setCityList] = useState([]);

    useEffect(()=> {
        //resetting values
        setDataLoading(true);
        setCityList([]);
        setCityWeeklyTempList([]);
        setMultiCityDataSet([]);
        if(query.get("id") !== null) setCityIdList(query.get("id").split(',')); 
    },[query.get("id")])

    useEffect(() => {
        setDataLoading(true);
        setDataSetForGraph([]);
        console.log(cityList);
        console.log(cityWeeklyTempList);
        console.log(multiCityDataSet);
        console.log(cityIdList);

        if(cityIdList.length > 0)
            cityIdList.map( c_id => {
                getDataByCityId(c_id).then(res => {
                    setCityList(oldCity => [ ...oldCity, res.data.name]);
                    getDataByLatLon(res.data.coord.lat, res.data.coord.lon).then(result => {
                        setCityWeeklyTempList(oldData =>[...oldData, result.data.daily])
                    })
                })
            })
            
    },[cityIdList])

    // useEffect(() => {
    //     extractDataForMultiCityGraph();
    // },[cityWeeklyTempList])

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

    const extractDataForMultiCityGraph = () => {
        console.log("Name : ",cityList);
        console.log("Temp : ",cityWeeklyTempList);
        
        if(cityWeeklyTempList.length > 0 && cityIdList.length === cityWeeklyTempList.length) {  
            for(let dayNo = 0; dayNo < 8; dayNo++){
                let obj = {};
                obj.date = moment().add(Number(dayNo+1), 'days').format('MMM D').toString();
                cityList.map((cityName, position) => { 
                    const tempData = cityWeeklyTempList[position]
                    obj[cityName] = ~~(tempData[dayNo].temp.day) 
                })
                console.log(obj);
                multiCityDataSet.push(obj);
            }
            console.log(multiCityDataSet);
            setDataLoading(false);
        }    
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
                    {/* <Typography className={styles.customGraphCityName}>{graphCityName + " : Next 8 days temperature"}</Typography>
                    <TemperatureBarChart graphData={dataSetForGraph} /> */}
                    {/* <TemperatureGroupBarChart GraphDataset={multiCityDataSet} /> */}
                </Box>
            )}
        </> 
    )
}

export default CityWeatherData;