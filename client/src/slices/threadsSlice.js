import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BoardsAPI from "../api/BoardsAPI";
import { logoutAction } from "./userSlice";

export const getAllThreads = createAsyncThunk('threads/getAllThreads', async (args, { dispatch, getState, rejectWithValue }) => {
    const { boardId } = args;
    try {
        const user = getState().user.data;

        const response = await BoardsAPI.getThreads(user.token, boardId);
        return {
            boardId,
            threads: response
        };
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

export const createThread = createAsyncThunk('threads/createThread', async (args, { dispatch, rejectWithValue }) => {
    const { data, token, onOk, onError } = args;
    try {
        const response = await BoardsAPI.createThread(token, data);
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

export const updateThreadLock = createAsyncThunk('threads/updateThreadLock', async (args, { dispatch, rejectWithValue, getState }) => {
    const { locked, threadId } = args;
    try {
        const user = getState().user.data;
        const response = await BoardsAPI.updateThreadLock(user.token, threadId, locked);
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

export const getThreadsErrorSelector = (state) => state.threads.error;


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
            }
            return state;
        },
        [getAllThreads.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        },
        [createThread.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [createThread.fulfilled]: (state, action) => {
            const thread = action.payload;
            state.data.push(thread);
            return state;
        },
        [createThread.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        },
        [updateThreadLock.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [updateThreadLock.fulfilled]: (state, action) => {
            const thread = action.payload;

            return state;
        },
        [updateThreadLock.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        }
    }
});


export const { resetThreads } = threads.actions;
