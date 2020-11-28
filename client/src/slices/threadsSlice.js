import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import ProjectAPI from "../api/ProjectAPI";
import { logoutAction } from "./userSlice";

export const getAllThreads = createAsyncThunk('threads/getAllThreads', async (args, { dispatch }) => {
    const { boardId, token } = args;
    try {
        const response = await ProjectAPI.getThreads(token, boardId);
        console.log(response);
        return {
            boardId,
            threads: response
        };
    } catch (err) {
        const { statusCode } = err.response.data;
        if (statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        }
    }
});

export const createThread = createAsyncThunk('threads/createThread', async (args, { dispatch }) => {
    const { data, token } = args;
    try {
        const response = await ProjectAPI.createThread(token, data);
        return response;
    } catch (err) {
        const { statusCode } = err.response.data;
        if (statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        }
    }
});

const initialState = {
    
};

export const getThreadsSelector = (state) => {
    let storedBoardIds = Object.keys(state);
    let allThreads = [];
    for (let i = 0; i < storedBoardIds.length; i++) {
        let currentBoardId = storedBoardIds[i];
        allThreads.push(...state[currentBoardId].data);
    }
    return allThreads;
}

export const threadsStatusSelector = (state, boardId) => {
    let currentThreadState = state.threads[boardId];
    return currentThreadState ? currentThreadState.status : undefined;
}

export const getThreadsByBoardIdSelector = (state, boardId) => {
    let currentThreadState = state.threads[boardId];
    return currentThreadState ? currentThreadState.data : [];
}

export const threads = createSlice({
    name: 'threads',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getAllThreads.pending]: (state, action) => {
            let boardId = action.meta.arg.boardId;
            state[boardId] = {
                status: 'loading',
                data: [],
                error: null
            };
            return state;
        },
        [getAllThreads.fulfilled]: (state, action) => {
            if (action.payload) {
                const { boardId, threads } = action.payload;
                state[boardId].status = 'complete';
                state[boardId].data = threads;
                console.log(current(state));
            }
            return state;
        },
        [getAllThreads.rejected]: (state, action) => {
            let boardId = action.meta.arg.boardId;
            state[boardId].status = 'failed';
            return state;
        },
    }
});


