import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    IconButton,
    Toolbar,
    Typography,
    LinearProgress,
    CircularProgress
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";


import {AppRootState, useAppDispatch} from "./store";
import {TaskType} from "../api/todolists-api";
import {CustomizedSnackbars} from "../components/SnackBar/SnackBar";
import {useSelector} from "react-redux";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {HashRouter, Routes, Route} from "react-router-dom";
import {Login} from "../pages/Login/Login";
import {logoutTC} from "../pages/Login/auth-reducer";
import { TodolistList } from '../pages/Todolists/TodolistLists';

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const dispatch = useAppDispatch()
    const status = useSelector<AppRootState, RequestStatusType>(state=> state.app.status)
    const initialized = useSelector<AppRootState, boolean>(state=> state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)


    useEffect(()=> {
        dispatch(initializeAppTC())
    }, [])

    const logoutHandler = useCallback(()=>{
        dispatch(logoutTC())
    },[])

    if (!initialized) {
        return <div style={{position: 'fixed',width: '100%', top:'40%', textAlign: 'center'}}><CircularProgress /></div>
    }

    return (
        <HashRouter>
            <div className="App">
                <CustomizedSnackbars/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start"  color="inherit" aria-label="menu">
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" >
                            News
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress />}
                </AppBar>
                    <Routes>
                        <Route path={"/"} element={ <TodolistList demo={demo}/>} />
                        <Route path={"/login"} element={<Login/>} />
                        <Route path="*" element={<h1>404: PAGE NOT FOUND</h1>}/>
                    </Routes>
            </div>
        </HashRouter>
    );
}

export default App