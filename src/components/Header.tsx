import {AppBar, Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Menu} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {StateType} from "../state/store";
import {logOutThunk} from "../state/auth-reducer";

export const Header = () => {
    const isLoggedIn = useSelector<StateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()
    return   <AppBar position="static">
        <Toolbar style={{justifyContent:'space-between'}}>
            <IconButton edge="start" color="inherit" aria-label="menu">
                <Menu/>
            </IconButton>
            <Typography variant="h6">
                ToDoLists
            </Typography>
            {isLoggedIn &&  <Button
                onClick={() => dispatch(logOutThunk())}
                variant={'outlined'} color="inherit">Log out</Button>}
        </Toolbar>

    </AppBar>
}
