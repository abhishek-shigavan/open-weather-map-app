import React, { useState } from "react";
import "../sass/Navbar.scss";
import { TextField, Button, makeStyles, InputAdornment, Box, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { ListItemButton, Popper, Snackbar, Alert, ClickAwayListener } from "@mui/material";
import { getDataByCityName } from "../service/WeatherDataService";

const useStyles = makeStyles({
    customTextfield: {
        width: 500,
        height: 32,
        paddingLeft: 10,
        border: '1px solid lightgray',
        backgroundColor: 'white',
        borderRadius: 3
    },
    customButton: {
        height: 33,
        width: 80,   
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
        width: 429,
        backgroundColor: "white",
        border: "1px solid lightgrey",
        borderTop: 0,
        borderRadius: '0px 0px 3px 3px',
        left: -431
    },
    customSnackBar: {
        marginTop: 100,
        width: 400
    },
    customList: {
        border: "0px 1px 1px 1px solid black",
        borderRadius: '0px 0px 3px 3px'
    },
    customListItem: {
        paddingBottom: 0,
        paddingTop: 0
    },
    customTypographyLatLon: {
        fontSize: 11,
        color: "grey"
    },
})

function Navbar() {
    const classes = useStyles();
    const vertical = "top";
    const horizontal = "center";
    const [anchorEl, setAnchorEl] = useState(null);
    const [inputCityName, setInputCityName] = useState();
    const [searchCityResult, setSearchCityResult] = useState([]);
    const [cityNotFound, setCityNotFound] = useState(false);

    const handleUserInput = (event) => {
        setInputCityName(event.target.value);
    }

    const handleSearchClick = (event) => {
        getDataByCityName(inputCityName).then((res) => {
            console.log(res);
            setSearchCityResult([res.data]);
        }).catch((err) =>{
            setCityNotFound(true);
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

    let open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return(
        <>
            <div className="navbar-outer-container">
                <TextField
                    placeholder={"Search city"}
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
                                <ListItemButton>
                                    <ListItemText>
                                    <div className="dropdown-menu-option">
                                        <Typography>{city.name+", "+city.sys.country}</Typography>
                                        <Typography>{~~(city.main.temp - 273.15)+ " C"}</Typography> 
                                        <Typography className={classes.customTypographyLatLon}>{city.coord.lat+", "+city.coord.lon}</Typography> 
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