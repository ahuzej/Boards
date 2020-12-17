import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BoardsAPI from "../api/BoardsAPI";

export const loginAction = createAsyncThunk('user/login', async (args, { dispatch, rejectWithValue }) => {
    const { username, password } = args;
    try {
        const response = await BoardsAPI.loginUser(username, password);
        console.log(response);
        return response;
    } catch (err) {
        let rejectMessage = 'Error has occured.';
        if (err.response) {
            const { statusCode } = err.response.data;
            if (statusCode === - 100) {
                dispatch(logoutAction());
                return;
            } else {
                rejectMessage = err.response.data.msg;
            }
        }
        return rejectWithValue(rejectMessage);
    }
});


export const registerAction = createAsyncThunk('user/register', async (args, { dispatch, rejectWithValue }) => {
    const { username, password, email } = args.data;
    const { onOk, onError } = args;
    try {
        const response = await BoardsAPI.registerUser(username, password, email);
        onOk();
        return response;
    } catch (err) {
        onError();
        let rejectMessage = 'Error has occured.';
        if (err.response) {
            const { statusCode } = err.response.data;
            if (statusCode === - 100) {
                dispatch(logoutAction());
                return;
            } else {
                rejectMessage = err.response.data.msg;
            }
        }
        return rejectWithValue(rejectMessage);
    }
});



const initialState = {
    status: 'idle',
    data: {},
    error: null
};

export const getUserSelector = (state) => {
    return state.user.data;
};
export const getUserStatus = (state) => state.user.status;

export const getUserError = (state) => state.user.error;

export const user = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        resetUser: (state, action) => {
            state = initialState;
            return state;
        },
        logoutAction: (state, action) => {
            state.data = {
                loggedIn: false
            };
            state.status = 'idle';
            return state;

        }
    },
    extraReducers: {
        [loginAction.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [loginAction.fulfilled]: (state, action) => {
            state.status = 'complete';
            const user = action.payload;
            user.loggedIn = true;
            state.data = user;
            return state;
        },
        [loginAction.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        },
        [registerAction.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [registerAction.fulfilled]: (state, action) => {
            let userData = action.payload;
            state.data = userData;
            state.status = 'complete';
            return state;
        },
        [registerAction.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
            return state;
        }
    }
});

export const { logoutAction } = user.actions;


export const { resetUser } = user.actions;
