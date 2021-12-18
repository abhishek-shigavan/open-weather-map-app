import React, { useState } from "react";
import Navbar from "./Navbar";
import { makeStyles, Typography, Box } from "@material-ui/core";
import moment from "moment";
import { Card, CardContent } from "@mui/material";

const useStyles = makeStyles({
    customCard: {
        position: "relative",
        top: 50,
        left: 230,
        width: 300,
        height: 260,
        border: "none"
    },
    customCardContent: {
        display: "flex",
        height: 220,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start"
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

function Home() {

    const classes = useStyles();
    const [cityData, setCityData] = useState(null);
    const dateTime = moment().format("MMM D[, ] hh[:]mm a");

    const getSearchCityData = (data) => {
        setCityData(data);
    }

    const openCityData = Boolean(cityData);
    return(
        <>
            <Navbar searchCityData={getSearchCityData} />
            {openCityData && (
                <Card className={classes.customCard}>
                    <CardContent className={classes.customCardContent}>
                        <div>
                            <Typography className={classes.typographyDateTime}>{dateTime}</Typography>
                            <Typography className={classes.typographyCityName}>{cityData.name+", "+cityData.sys.country}</Typography>
                        </div>
                        <div>
                            <Typography className={classes.typographyTemperature}>{~~(cityData.main.temp - 273.15)+ "\u00B0C"}</Typography>
                            <Typography className={classes.typographyWeather}>{"Feels like "+~~(cityData.main.temp - 273.15)+"\u00B0C. "+cityData.weather[0].description+". "+cityData.weather[0].main}</Typography>
                    
                            <Box className={classes.customBoxForWeatherDetails}>
                                <Typography className={classes.typographyWeatherDetails}>{cityData.wind.speed+"m/s E"+cityData.main.pressure +" hPa"}</Typography>
                                <Typography className={classes.typographyWeatherDetails}>{"Humidity: "+cityData.main.humidity+"% UV: 0"}</Typography>
                                <Typography className={classes.typographyWeatherDetails}>{"Dew point: 4\u00B0C" +"    "+"Visibility: 0.6km"}</Typography>
                            </Box>
                        </div> 
                    </CardContent>
                </Card> 
            )}
        </>
    );
}

export default Home;