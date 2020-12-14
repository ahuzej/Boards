import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BoardsAPI from "../api/BoardsAPI";
import { logoutAction } from "./userSlice";

export const getAllComments = createAsyncThunk('comments/getAllComments', async (args, { dispatch, getState }) => {
    const { threadId } = args;
    try {
        const user = getState().user.data;
        const response = await BoardsAPI.getComments(user.token, threadId);
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

export const createComment = createAsyncThunk('comments/createComment', async (args, { dispatch, getState, rejectWithValue }) => {
    const { comment, threadId, onOk, onError } = args;
    try {
        const user = getState().user.data;
        const response = await BoardsAPI.createComment(user.token, threadId, comment);
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

export const createRating = createAsyncThunk('comments/createRating', async (args, { dispatch, rejectWithValue }) => {
    const { data, token } = args;
    try {
        const response = await BoardsAPI.createRating(token, data);
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

export const updateRating = createAsyncThunk('comments/updateRating', async (args, { dispatch, rejectWithValue }) => {
    const { data, token } = args;
    try {
        const response = await BoardsAPI.createRating(token, data);
        if(response) {
            return {
                userRating: response,
                total: response === 'upvote' ? 2 : -2
            };
        }
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

export const getCommentsSelector = (state) => {
    return state.comments.data ?? [];
}

export const commentsStatusSelector = (state) => {
    return state.comments.status;
}

export const commentByIdSliceSelector = (state, id) => state.data.find(comment => comment._id === id);

export const commentsPagingSelector = (state, page, itemsPerPage) => {
    const comments = state.comments.data;
    const totalAmountOfPages = Math.ceil(comments.length / itemsPerPage);
    return { items: comments.slice((page - 1) * itemsPerPage, page * itemsPerPage), totalAmountOfPages };
}

export const getCommentsErrorSelector = (state) => state.comments.error;

export const comments = createSlice({
    name: 'comments',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getAllComments.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [getAllComments.fulfilled]: (state, action) => {
            if (action.payload) {
                state.status = 'complete';
                state.data = action.payload;
            }
            return state;
        },
        [getAllComments.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        },
        [createRating.pending]: (state, action) => {
            return state;
        },
        [createRating.fulfilled]: (state, action) => {
            const newRating = action.payload;
            let { comment: commentId } = action.meta.arg.data;
            let targetComment = state.data.find(comment => comment._id === commentId);
            targetComment.userRating = newRating;
            let { rating } = targetComment;
            if(newRating === 'upvote') {
                rating.totalUpvotes++;
                rating.total++;
            } else if(newRating === 'downvote') {
                rating.totalUpvotes--;
                rating.total--;
            }
            return state;
        },
        [createComment.fulfilled]: (state, action) => {
            const newComment = action.payload;
            state.data.push(newComment);
            return state;
        },
        [updateRating.fulfilled]: (state, action) => {
            const { userRating, total } = action.payload;
            let { comment: commentId } = action.meta.arg.data;
            let targetComment = state.data.find(comment => comment._id === commentId);
            targetComment.userRating = userRating;
            let { rating } = targetComment;
            rating.total += total;
            return state;
        },
        [createRating.rejected]: (state, action) => {
            return state;
        }
    }
});

