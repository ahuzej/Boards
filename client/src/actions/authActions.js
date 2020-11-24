import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../api/AuthAPI";
import UserAPI from '../api/UserAPI';

export const loginAction = createAsyncThunk('auth/login', async (args, { dispatch }) => {
    const { username, password } = args;
    try {
        const response = await loginUser(username, password);
        return response;
    } catch (err) {
        if(err.response) {
            const { statusCode } = err.response.data;
            if (statusCode && statusCode === - 100) {
                dispatch(logoutAction());
            }
        } else if(err.request) {

        } else {

        }
    }
});

export const registerAction = createAsyncThunk('auth/register', async (args, { dispatch }) => {
    const { username, password, email } = args;
    try {
        const response = await loginUser(username, password);
        return response;
    } catch (err) {
        if(err.response) {
            const { statusCode } = err.response.data;
            if (statusCode && statusCode === - 100) {
                dispatch(logoutAction());
            }
        } else if(err.request) {

        } else {

        }
    }
});


export const getContacts = createAsyncThunk('auth/contacts', async (args, { dispatch, getState}) => {
    try {
        const { auth } = getState();
        const response = await UserAPI.getContacts(auth.token, auth.id);
        return response;
    } catch (err) {
        if(err.response) {
            const { statusCode } = err.response.data;
            if (statusCode && statusCode === - 100) {
                dispatch(logoutAction());
            }
        } else if(err.request) {

        } else {

        }
    }
});

export const logoutAction = createAction('auth/logout');