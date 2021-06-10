import {AppBar, Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Menu} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import React from "react";

export const Header = () => {
    return   <AppBar position="static">
        <Toolbar style={{justifyContent:'space-between'}}>
            <IconButton edge="start" color="inherit" aria-label="menu">
                <Menu/>
            </IconButton>
            <Typography variant="h6">
                ToDoLists
            </Typography>
            <Button variant={'outlined'} color="inherit">Login</Button>
        </Toolbar>

    </AppBar>
}
