import React, { useState, useEffect } from "react";
import { makeStyles, Typography, Box, IconButton } from "@material-ui/core";
import { Card, CardContent } from "@mui/material";
import { getDataByCityId, getDataByLatLon } from "../service/WeatherDataService";
import { ArrowDownwardOutlined, ExploreOutlined } from '@mui/icons-material';
import moment from "moment-timezone";
import clearSky from "../assets/clearSky.png";
import overcastCloud from "../assets/overcastClouds.png";
import sunCloud from "../assets/sunCloud.png";
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles({
    customBoxForCard: {
        display: "flex",
        flex: "0 0 33.333333%",
        justifyContent: "center"
    },
    customCard: {
        width: 300,
        height: 260,
        border: "none",
        marginBottom: 50
       
    },
    customCardContent: {
        display: "flex",
        height: 220,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        background: "#E8E8E8"
    },
    customBoxDateCloseIcon: {
        display: "flex",
        flexDirection: "row",
        width: 268,
        justifyContent: "space-between",
        alignItems: "center"
    },
    customIconButton: {
        padding: "5px 5px 5px 5px"
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
    },
    customBoxForLoader: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 300,
        height: 260,
        border: "1px solid #E8E8E8",
        borderRadius: 3,
        marginBottom: 50
    }
})

function WeatherDataCard({ position, CityID, removeCityCard }) {
    const classes = useStyles();
    const [cityData, setCityData] = useState();
    const [weatherIcon, setWeatherIcon] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=> {
        getCityDataById();
    },[CityID])

    const getCityDataById = () => {
        getDataByCityId(CityID).then(res => {
            getWeatherDataByLatitudeLongitude(res.data.coord.lat, res.data.coord.lon, res.data.name, res.data.sys.country);
        })
    }

    const getWeatherDataByLatitudeLongitude = (latitude, longitude, city, country) => {
        setIsLoading(true);
        getDataByLatLon(latitude, longitude).then(res => {
            setCityData({
                cityName: city,
                country: country,
                weatherData: res.data.current,
                timeZone: res.data.timezone
            });

            res.data.current.weather[0].main === "Clear" ? setWeatherIcon(clearSky)
                : res.data.current.weather[0].main === "Clouds" ? setWeatherIcon(overcastCloud)
                : setWeatherIcon(sunCloud);
            setIsLoading(false);    
        })
    }

    const openCityWeatherData = Boolean(cityData);

    return isLoading ? (
        <Box className={classes.customBoxForCard}>
            <Box className={classes.customBoxForLoader} >
                <CircularProgress />
            </Box>
        </Box>
    ) : (
        <>
        {openCityWeatherData && (
            <Box className={classes.customBoxForCard}>
                <Card className={classes.customCard}>
                    <CardContent className={classes.customCardContent}>
                        <div>
                            <Box className={classes.customBoxDateCloseIcon}>
                                <Typography className={classes.typographyDateTime}>{moment().tz(cityData.timeZone).format("MMM D[, ] hh[:]mm a")}</Typography>
                                <IconButton className={classes.customIconButton} onClick={() => removeCityCard(position)}> <CancelIcon /> </IconButton>
                            </Box>
                            <Typography className={classes.typographyCityName}>{cityData.cityName+", "+cityData.country}</Typography>
                        </div>
                        <div>
                            <Typography className={classes.typographyTemperature}>
                                <img src={weatherIcon} alt="" style={{paddingRight: 10, width: 28, height: 28}}/>
                                {~~(cityData.weatherData.temp)+ "\u00B0C"}
                            </Typography>
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
            </Box>
        )}
        </>
    ) 
}

export default WeatherDataCard;