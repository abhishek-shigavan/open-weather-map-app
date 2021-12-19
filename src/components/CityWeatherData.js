import React, { useState, useEffect } from "react";
import { makeStyles, Typography, Box } from "@material-ui/core";
import moment from "moment";
import { Card, CardContent } from "@mui/material";
import { getDataByCityId, getDataByLatLon } from "../service/WeatherDataService";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

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
        fontWeight: 700   
    },
    typographyWeatherDetails: {
        textAlign: "left",
        fontSize: 14,
    },
    customBoxForWeatherDetails: {
        borderLeft: '1px solid #ED7B5B',
        paddingLeft: 15
    }
})

function CityWeatherData(props) {
    const {CityName , CityID } = useParams();
    const classes = useStyles();
    const dateTime = moment().format("MMM D[, ] hh[:]mm a");
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
                        <Typography className={classes.typographyDateTime}>{dateTime}</Typography>
                        <Typography className={classes.typographyCityName}>{cityData.cityName+", "+cityData.country}</Typography>
                    </div>
                    <div>
                        <Typography className={classes.typographyTemperature}>{~~(cityData.weatherData.temp)+ "\u00B0C"}</Typography>
                        <Typography className={classes.typographyWeather}>{"Feels like "+~~(cityData.weatherData.feels_like)+"\u00B0C. "+cityData.weatherData.weather[0].description+". "+cityData.weatherData.weather[0].main}</Typography>

                        <Box className={classes.customBoxForWeatherDetails}>
                            <Typography className={classes.typographyWeatherDetails}>
                                {cityData.weatherData.wind_speed+"m/s E" +cityData.weatherData.pressure +" hPa"}
                            </Typography>
                            <Typography className={classes.typographyWeatherDetails}>
                                {"Humidity: "+cityData.weatherData.humidity+"%" +  "UV: "+cityData.weatherData.uvi}
                            </Typography>
                            <Typography className={classes.typographyWeatherDetails}>
                                {"Dew point: "+ cityData.weatherData.dew_point +"\u00B0C" +"    "+"Visibility: " + (cityData.weatherData.visibility/1000)+ "km"}
                            </Typography>
                        </Box>
                    </div> 
                </CardContent>
            </Card>
        )}
        </> 
    );
}

export default CityWeatherData;