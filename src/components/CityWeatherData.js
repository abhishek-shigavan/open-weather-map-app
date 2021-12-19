import React, { useState, useEffect } from "react";
import { makeStyles, Typography, Box } from "@material-ui/core";
import moment from "moment";
import { Card, CardContent } from "@mui/material";
import { getDataByCityId, getDataByLatLon } from "../service/WeatherDataService";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import {ArrowDownwardOutlined, ExploreOutlined } from '@mui/icons-material';

const useStyles = makeStyles({
    customCard: {
        position: "relative",
        top: 50,
        left: 230,
        width: 300,
        height: 260,
        border: "none",
       
    },
    customCardContent: {
        display: "flex",
        height: 220,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        background: "#E8E8E8"
    },
    typographyDateTime: {
        textAlign: "left",
        fontSize: 14,
        color: "red"
    },
    typographyCityName: {
        textAlign: "left",
        fontSize: 24,
        fontWeight: 700
    },
    typographyTemperature: {
        textAlign: "left",
        fontSize: 30,
        fontWeight: 600
    },
    typographyWeather: {
        textAlign: "left",
        fontSize: 14,
        fontWeight: 700,
        paddingBottom: 5   
    },
    typographyWeatherDetailsWithIcon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        height: 20,
        textAlign: "left",
        fontSize: 14,
        width: 120
    },
    typographyWeatherDetails: {
        textAlign: "left",
        fontSize: 14,
        width: 120
    },
    customBoxForWeatherDetails: {
        borderLeft: '1px solid #ED7B5B',
        paddingLeft: 15
    },
    customBoxForTypography: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        height: 20,
    }
})

function CityWeatherData(props) {
    const {CityName , CityID } = useParams();
    const classes = useStyles();
    const [cityData, setCityData] = useState(null);

    useEffect(()=> {
        getCityDataById();
    },[CityName, CityID])

    const getCityDataById = () => {
        getDataByCityId(CityID.substring(1)).then(res => {
            getWeatherDataByLatitudeLongitude(res.data.coord.lat, res.data.coord.lon, res.data.sys.country);
            console.log("rendering");
        })
    }

    const getWeatherDataByLatitudeLongitude = (latitude, longitude, country) => {
        getDataByLatLon(latitude, longitude).then(res => {
            setCityData({
                cityName: CityName.substring(1),
                country: country,
                weatherData: res.data.current
            });
            console.log(res.data.current)
        })
    }

    const openCityWeatherData = Boolean(cityData);

    return(
        <>
        <Navbar />
        {openCityWeatherData && (
            <Card className={classes.customCard}>
                <CardContent className={classes.customCardContent}>
                    <div>
                        <Typography className={classes.typographyDateTime}>{moment().format("MMM D[, ] hh[:]mm a")}</Typography>
                        <Typography className={classes.typographyCityName}>{cityData.cityName+", "+cityData.country}</Typography>
                    </div>
                    <div>
                        <Typography className={classes.typographyTemperature}>{~~(cityData.weatherData.temp)+ "\u00B0C"}</Typography>
                        <Typography className={classes.typographyWeather}>{"Feels like "+~~(cityData.weatherData.feels_like)+"\u00B0C. "+cityData.weatherData.weather[0].description+". "+cityData.weatherData.weather[0].main}</Typography>

                        <Box className={classes.customBoxForWeatherDetails}>
                            <Box className={classes.customBoxForTypography}>
                                <Typography className={classes.typographyWeatherDetailsWithIcon}>
                                    <ArrowDownwardOutlined sx={{height: 18, width: 18}} /> {cityData.weatherData.wind_speed+" m/s E"}
                                </Typography>
                                <Typography className={classes.typographyWeatherDetailsWithIcon}>
                                    <ExploreOutlined sx={{height: 18 , width: 18}} /> {cityData.weatherData.pressure +" hPa"}
                                </Typography>
                            </Box>
                            <Box className={classes.customBoxForTypography}>
                                <Typography className={classes.typographyWeatherDetails}> {"Humidity: "+cityData.weatherData.humidity+"%"} </Typography>
                                <Typography className={classes.typographyWeatherDetails}> {"UV: "+cityData.weatherData.uvi} </Typography>
                            </Box>           
                            <Box className={classes.customBoxForTypography}>
                                <Typography className={classes.typographyWeatherDetails}> {"Dew point: "+ ~~(cityData.weatherData.dew_point) +"\u00B0C"} </Typography>
                                <Typography className={classes.typographyWeatherDetails}> {"Visibility: " + (cityData.weatherData.visibility/1000)+ "km"} </Typography>
                            </Box>
                        </Box>
                    </div> 
                </CardContent>
            </Card>
        )}
        </> 
    );
}

export default CityWeatherData;