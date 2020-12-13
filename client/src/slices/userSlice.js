import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BoardsAPI from "../api/BoardsAPI";

export const loginAction = createAsyncThunk('user/login', async (args, { dispatch }) => {
    const { username, password } = args;
    try {
        const response = await BoardsAPI.loginUser(username, password);
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


export const registerAction = createAsyncThunk('user/register', async (args, { dispatch }) => {
    console.log('bam hit');
    const { username, password, email } = args;
    try {
        throw new Error('test');
        const response = await BoardsAPI.registerUser(username, password, email);
        console.log(response);
        return response;
    } catch (err) {
        const { statusCode } = err.response.data;
        if (statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        } else {
            throw new Error('Sign up failed.');
        }
    }
});


export const logoutAction = createAction('user/logout');

const initialState = {
    status: 'idle',
    data: {},
    error: null
};

export const getUserSelector = (state) => {
    return state.user.data;
};
export const getUserStatus = (state) => state.user.status;

export const user = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        resetUser: (state, action) => {
            state = initialState;
            return state;
        }
    },
    extraReducers: {
        [loginAction.pending]: (state, action) => {
            console.log(state);
            state.status = 'loading';
            return state;
        },
        [loginAction.fulfilled]: (state, action) => {
            state.status = 'complete';
            console.log(action);
            const user = action.payload;
            user.loggedIn = true;
            state.data = user;
            return state;
        },
        [loginAction.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        },
        [logoutAction]: (state, action) => {
            state.data = {
                loggedIn: false
            };
            state.status = 'idle';
            return state;
        },
        [registerAction.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [registerAction.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        },
        [registerAction.fulfilled]: (state, action) => {
            let userData = action.payload;
            state.data = userData;
            state.status = 'complete';
            return state;
        }
    }
});


export const { resetUser } = user.actions;
