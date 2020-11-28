import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../api/AuthAPI";
import UserAPI from "../api/UserAPI";

export const loginAction = createAsyncThunk('user/login', async (args, { dispatch }) => {
    const { username, password } = args;
    try {
        const response = await loginUser(username, password);
        console.log(response);
        return response;
    } catch (err) {
        if (err.response) {
            const { statusCode } = err.response.data;
            if (statusCode && statusCode === - 100) {
                dispatch(logoutAction());
            }
        } else if (err.request) {

        } else {

        }
    }
});

export const logoutAction = createAction('user/logout');

const initialState = {
    status: 'idle',
    data: {},
    error: null
};

export const getUserSelector = (state) => state.user.data ?? {};

export const user = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        signIn(state, action) {

        },
        signUp(state, action) {

        }
    },
    extraReducers: {
        [loginAction.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [loginAction.fulfilled]: (state, action) => {
            state.status = 'complete';
            state.data = action.payload;
            return state;
        },
        [loginAction.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        },
        [logoutAction]: (state, action) => {
            state = {};
            return state;
        },
    }
});



export const registerAction = createAsyncThunk('user/register', async (args, { dispatch }) => {
    try {
        console.log(args);
        const response = await UserAPI.createUser(args);
        return response;
    } catch (err) {
        if (err.response) {
            const { statusCode } = err.response.data;
            if (statusCode && statusCode === - 100) {
                dispatch(logoutAction());
            }
        } else if (err.request) {

        } else {

        }
    }
});


export const getContacts = createAsyncThunk('user/contacts', async (args, { dispatch, getState }) => {
    try {
        const { auth } = getState();
        const response = await UserAPI.getContacts(auth.token, auth.id);
        return response;
    } catch (err) {
        if (err.response) {
            const { statusCode } = err.response.data;
            if (statusCode && statusCode === - 100) {
                dispatch(logoutAction());
            }
        } else if (err.request) {

        } else {

        }
    }
});

