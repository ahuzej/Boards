import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../api/AuthAPI";

export const loginAction = createAsyncThunk('user/login', async (args, { dispatch }) => {
    const { username, password } = args;
    try {
        const response = await loginUser(username, password);
        console.log(response);
        return response;
    } catch (err) {
        const { statusCode } = err.response.data;
        if (statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        } else {
            throw new Error('Data fetch failed.');
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


