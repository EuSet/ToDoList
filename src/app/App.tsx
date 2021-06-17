import React, {useEffect} from 'react';
import './App.css';
import {CircularProgress, Container, LinearProgress} from "@material-ui/core";
import {ToDoListsList} from "../todolistsList/ToDoListsList";
import {Header} from "../components/Header";
import {useDispatch, useSelector} from "react-redux";
import {StateType} from "../state/store";
import {RequestStatusType} from "../state/app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackBar";
import {Login} from "../login/login";
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {initializeMeThunk} from "../state/auth-reducer";


function App() {
    const status = useSelector<StateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<StateType, boolean>(state => state.app.isInitialized)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeMeThunk())
    }, [])
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <BrowserRouter>
                <ErrorSnackbar/>
                <Header/>
                {status === 'loading' && <LinearProgress style={{position: 'absolute', width: '1380px'}}/>}
                <Container fixed>
                    <Switch>
                        <Route path={'/login'} render={() => <Login/>}/>
                        <Route exact path={'/'} render={() => <ToDoListsList/>}/>
                        <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                        <Redirect from={'*'} to={'/404'}/>
                    </Switch>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;

