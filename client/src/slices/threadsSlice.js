import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import BoardsAPI from "../api/BoardsAPI";
import { logoutAction } from "./userSlice";

export const getAllThreads = createAsyncThunk('threads/getAllThreads', async (args, { dispatch, getState }) => {
    const { boardId } = args;
    try {
        const user = getState().user.data;

        const response = await BoardsAPI.getThreads(user.token, boardId);
        return {
            boardId,
            threads: response
        };
    } catch (err) {
        const { statusCode } = err.response.data;
        if (statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        } else {
            throw new Error('Request failed.');
        }
    }
});

export const createThread = createAsyncThunk('threads/createThread', async (args, { dispatch }) => {
    const { data, token } = args;
    try {
        const response = await BoardsAPI.createThread(token, data);
        return response;
    } catch (err) {
        const { statusCode } = err.response.data;
        if (statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        } else {
            throw new Error('Request failed.');
        }
    }
});

const initialState = {
    status: 'idle',
    data: [],
    error: null
};

export const getThreadsSelector = (state) => {
    return state.threads.data;
}

export const threadsStatusSelector = (state) => {
    return state.threads.status;
}

export const threadByIdSelector = (state, id) => state.threads.data.find(thread => thread._id === id);


export const threads = createSlice({
    name: 'threads',
    initialState,
    reducers: {
        resetThreads: (state, action) => {
            state = initialState;
            return state;
        }
    },
    extraReducers: {
        [getAllThreads.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [getAllThreads.fulfilled]: (state, action) => {
            if (action.payload) {
                const { threads } = action.payload;
                state.status = 'complete';
                state.data = threads;
                console.log(current(state));
            }
            return state;
        },
        [getAllThreads.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        },
    }
});


export const { resetThreads } = threads.actions;
