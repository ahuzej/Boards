import { createAsyncThunk } from "@reduxjs/toolkit";
import ProjectAPI from "../api/ProjectAPI";
import { logoutAction } from "./authActions";

export const getAllProjects = createAsyncThunk('projects/getAllProjects', async (args, { dispatch }) => {
    const { id, token } = args;
    try {
        const response = await ProjectAPI.getAll(token, id);
        console.log(response);
        return response;    
    } catch (err) {
        const { statusCode } = err.response.data;
        if(statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        }
    }
});

export const createProject = createAsyncThunk('projects/createProject', async (args, { dispatch }) => {
    const { data, token } = args;
    try {
        const response = await ProjectAPI.createProject(token, data);
        return response;
    } catch (err) {
        const { statusCode } = err.response.data;
        if(statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        }
    }
});