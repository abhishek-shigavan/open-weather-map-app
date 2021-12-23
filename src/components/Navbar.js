import React, { useEffect, useState } from "react";
import "../sass/Navbar.scss";
import { TextField, Button, makeStyles, InputAdornment, Box, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { ListItemButton, Popper, Snackbar, Alert, ClickAwayListener } from "@mui/material";
import { getDataByCityName } from "../service/WeatherDataService";
import { useHistory, useLocation } from "react-router-dom";
import clearSky from "../assets/clearSky.png";
import overcastCloud from "../assets/overcastClouds.png";
import sunCloud from "../assets/sunCloud.png";

const useStyles = makeStyles({
    customTextfield: {
        width: 625,
        height: 32,
        paddingLeft: 10,
        border: '1px solid lightgray',
        backgroundColor: 'white',
        borderRadius: 3
    },
    customButton: {
        height: 33,
        width: 120,   
        backgroundColor: '#48484A',
        borderRadius: '0px 3px 3px 0px',
        color: 'white',
        textTransform: "none",
        '&:hover': {
            backgroundColor: '#252526',
        }
    },
    customInputAdornment: {
        margin: 0,
    },
    customBoxStyle: {
        position: "relative",
        width: 515,
        backgroundColor: "white",
        border: "1px solid lightgrey",
        borderTop: 0,
        borderRadius: '0px 0px 3px 3px',
        left: -119
    },
    customSnackBar: {
        marginTop: 100,
        width: 400
    },
    customList: {
        borderRadius: '0px 0px 3px 3px',
        padding: 0
    },
    customListItem: {
        padding: 0,
        height: 36
    },
    customListItemButton: {
        height: 36,
    },
    customTypographyCityCountry: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: 170
    },
    customTypographyTemperature: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: 83
    },
    customTypographyLatLon: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        width: 170,
        fontSize: 11,
        color: "grey"
    },
})

function useCityId() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Navbar() {
    const classes = useStyles();
    const history = useHistory();
    const cityInParams = useCityId();
    const vertical = "top";
    const horizontal = "center";
    const [anchorEl, setAnchorEl] = useState(null);
    const [inputCityName, setInputCityName] = useState("");
    const [searchCityResult, setSearchCityResult] = useState([]);
    const [cityNotFound, setCityNotFound] = useState(false);
    const [cityIdList, setCityIdList] = useState([]);
    const [renderingState, setRenderingState] = useState(false);

    useEffect(() => {
        if(cityInParams.get("id") !== null) setCityIdList(cityInParams.get("id").split(','));
    },[cityInParams])

    useEffect(() => {
       sendSearchCityData(cityIdList); 
    },[renderingState])

    const handleUserInput = (event) => {
        setInputCityName(event.target.value);
    }

    const handleSearchClick = (event) => {
        getDataByCityName(inputCityName).then((res) => {
            console.log(res);
            res.data.list.length ? setSearchCityResult(res.data.list) : setCityNotFound(true)
        }).catch((err) =>{
            setCityNotFound(true);
            setInputCityName("");
            console.log(err);
        })
        setAnchorEl(anchorEl ? null : event.currentTarget)
    }

    const handleClickAway = () =>  {
        setAnchorEl(null);
        setSearchCityResult([]);
    }
    
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setCityNotFound(false);
    };

    const sendSearchCityData = (cityIdList) => {
        let cityIdString ="";
        if(cityIdList.length > 0 && cityIdList.length <= 5) {
            cityIdString = getCityIdString();
            history.push(`/weather?id=${cityIdString}`);
        }
        else if (cityIdList.length > 5) {
            cityIdString = removeOldCityId();
            history.push(`/weather?id=${cityIdString}`);
        }    
    }

    const getCityIdString = () => {
        let cityIdString = "";
        cityIdList.forEach(cityId => { let temp = cityId;
            cityIdString = cityIdString + temp +","
        })
        return(cityIdString.slice(0, -1))
    }

    const removeOldCityId = () => {
        cityIdList.pop();
        const cityId =  getCityIdString();
        return cityId;
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return(
        <>
            <div className="navbar-outer-container">
                <TextField
                    placeholder={"Search city"}
                    value={inputCityName}
                    onChange={handleUserInput} 
                    className={classes.customTextfield}
                    InputProps={{disableUnderline: true,
                        endAdornment:(
                            <InputAdornment className={classes.customInputAdornment} position="end">
                                <Button aria-describedby={id} className={classes.customButton} onClick={handleSearchClick}>Search</Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <Popper id={id} open={open} anchorEl={anchorEl} placement={"bottom-start"}>
                <ClickAwayListener onClickAway={() => handleClickAway()}>
                <Box className={classes.customBoxStyle}>
                    {searchCityResult.map(city =>(
                        <List className={classes.customList}>
                            <ListItem className={classes.customListItem}>
                                <ListItemButton 
                                    className={classes.customListItemButton} 
                                    dense={true} 
                                    onClick={() => {
                                                setInputCityName(""); 
                                                setCityIdList(oldId => [city.id, ...oldId]);
                                                setRenderingState(!renderingState);    
                                                handleClickAway();
                                            }}
                                >
                                    <ListItemText>
                                    <div className="dropdown-menu-option">
                                        <Typography className={classes.customTypographyCityCountry}>{city.name+", "+city.sys.country}</Typography>
                                        <Typography className={classes.customTypographyTemperature}>{~~(city.main.temp - 273.15)+ "\u00B0 C"}</Typography>
                                        <img src={ city.weather[0].main === "Clear" ? clearSky
                                                    : city.weather[0].main === "Clouds" ? overcastCloud
                                                    : sunCloud} alt=""
                                        /> 
                                        <Typography className={classes.customTypographyLatLon}>{"lat "+city.coord.lat+", lon "+city.coord.lon}</Typography> 
                                    </div>
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    ))}
                </Box>
                </ClickAwayListener>
            </Popper>
            <Snackbar className={classes.customSnackBar} open={cityNotFound} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} variant="filled" severity="info" sx={{ width: '100%' }}>
                    No results for {inputCityName}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Navbar;