import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import WeatherDataCard from "./WeatherDataCard";
import { makeStyles, Box } from "@material-ui/core";

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
    }
}); 


function CityWeatherData(props) {
    const styles = useStyles();
    const navigate = useNavigate();
    const {CityName , CityID } = useParams();
    const [cityLatLonData, setCityLatLonData]  = useState([]);
    const [renderingState, setRenderingState] = useState(true);

    useEffect(()=> {
        const addNewCity = checkCitiesLimit();
        addNewCity ? setCityLatLonData(oldArray => [ {city_name: CityName.substring(1), city_id: CityID.substring(1)}, ...oldArray ])
        : removeOldAddNewCity() 
        
    },[CityName, CityID])

    const checkCitiesLimit = () => {
        return cityLatLonData.length < 5 ? true : false;
    }

    const removeOldAddNewCity = () => {
        cityLatLonData.pop();
        setCityLatLonData(oldArray => [ {city_name: CityName.substring(1), city_id: CityID.substring(1)}, ...oldArray ])
    }

    const removeCityByIndex = (position) => {
        cityLatLonData.splice(position,1);
        cityLatLonData.length > 0 ? setRenderingState(!renderingState) : navigate("/");
    }

    const openCityWeatherData = cityLatLonData.length >= 1 ? true : false;

    return(
        <>
            <Navbar />
            {openCityWeatherData && (
                <Box className={styles.customBoxStyle}>
                    {cityLatLonData.map((cityData, cityPositionInData) => (
                        <WeatherDataCard position={cityPositionInData} CityName={cityData.city_name} CityID={cityData.city_id} removeCityCard={removeCityByIndex}/>
                    ))}

                </Box>
            )}
        </> 
    );
}

export default CityWeatherData;