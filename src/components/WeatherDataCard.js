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
        justifyContent: "center",
        ['@media(max-width: 475px) and (min-width: 320px)'] : {
            flex: "0 0 100%",
        },
        ['@media(max-width: 1049px) and (min-width: 768px)'] : {
            flex: "0 0 50%",
        },
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            flex: "0 0 33.333333%",
        },
    },
    customCard: {
        border: "none",
        marginBottom: 50,
        height: 281,
        ['@media(max-width: 375px) and (min-width: 320px)'] : {
            width: 250,
        },
        ['@media(max-width: 475px) and (min-width: 376px)'] : {
            width: 280,
        },
        ['@media(max-width: 1049px) and (min-width: 768px)'] : {
            width: 272,
        },
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            width: 300,
            height: 260,
        },
    },
    customCardContent: {
        display: "flex",
        height: 241,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        background: "#E8E8E8",
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            height: 220,
        },
    },
    customBoxDateCloseIcon: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        ['@media(max-width: 375px) and (min-width: 320px)'] : {
            width: 216,
        },
        ['@media(max-width: 475px) and (min-width: 376px)'] : {
            width: 248,
        },
        ['@media(max-width: 1049px) and (min-width: 768px)'] : {
            width: 240,
        },
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            width: 268,
        },
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
        fontSize: 20,
        fontWeight: 700,
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            fontSize: 24,
        }
    },
    typographyTemperature: {
        textAlign: "left",
        fontSize: 24,
        fontWeight: 600,
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            fontSize: 30,
        }
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
        ['@media(max-width: 375px) and (min-width: 320px)'] : {
            width: 92,
        },
        ['@media(max-width: 475px) and (min-width: 376px)'] : {
            width: 116
        },
        ['@media(max-width: 1049px) and (min-width: 768px)'] : {
            width: 112
        },
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            width: 120
        },
    },
    typographyWeatherDetails: {
        textAlign: "left",
        fontSize: 14,
        width: 116,
        ['@media(max-width: 1366px) and (min-width: 768px)'] : {
            width: 120
        },
    },
    customBoxForWeatherDetails: {
        borderLeft: '1px solid #ED7B5B',
        paddingLeft: 15,
        ['@media(max-width: 1050px) and (min-width: 320px)'] : {
            height: 83,
            display: "flex",
            flexDirection: "column",
        },
    },
    customBoxForTypography: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        height: 20,
    },
    customBoxForDewVisibility: {
        display: 'flex',
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        height: 42,
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: 20,
        },
    },
    customBoxForLoader: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 281,
        border: "1px solid #E8E8E8",
        borderRadius: 3,
        marginBottom: 50,
        ['@media(max-width: 375px) and (min-width: 320px)'] : {
            width: 250,
        },
        ['@media(max-width: 475px) and (min-width: 376px)'] : {
            width: 280
        },
        ['@media(max-width: 1049px) and (min-width: 768px)'] : {
            width: 272
        },
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            width: 300,
            height: 260,
        },
    },
    customWeatherIcon: {
        paddingRight: 10, 
        width: 24, 
        height: 24,
        ['@media(max-width: 1366px) and (min-width: 1050px)'] : {
            width: 28,
            height: 28,
        },
    },
    customIconTempBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
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
                            <Box className={classes.customIconTempBox}>
                                <img src={weatherIcon} alt="" className={classes.customWeatherIcon}/>
                                <Typography className={classes.typographyTemperature}>
                                    {~~(cityData.weatherData.temp)+ "\u00B0C"}
                                </Typography>
                            </Box>
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
                                <Box className={classes.customBoxForDewVisibility}>
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