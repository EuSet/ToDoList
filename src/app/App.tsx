import React from 'react';
import './App.css';
import {Container, LinearProgress} from "@material-ui/core";
import {ToDoListsList} from "../todolistsList/ToDoListsList";
import {Header} from "../components/Header";
import {useSelector} from "react-redux";
import {StateType} from "../state/store";
import {RequestStatusType} from "../state/app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackBar";


function App() {
    const status = useSelector<StateType, RequestStatusType>(state => state.app.status)
    return (
        <div className="App">
            <ErrorSnackbar/>
          <Header/>
            {status === 'loading' &&  <LinearProgress style={{position:'absolute', width:'1380px'}} />}
            <Container fixed>
               <ToDoListsList/>
            </Container>
        </div>
    );
}

export default App;

