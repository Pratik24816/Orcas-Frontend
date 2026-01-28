import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/api";   

export const createWorkspace = async (workspaceData) => {
    try {
        const response = await axios.post(`${BASE_URL}/workspaces`, workspaceData);
        return response.data;
    } catch (error) {
        console.error('❌ Error creating workspace:', error);
        throw error;
    }
};

export const getWorkspace = async (workspaceId) => {
    try {
        const response = await axios.get(`${BASE_URL}/workspaces/${workspaceId}`);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching workspace:', error);
        throw error;
    }
};

export const getWorkspaceSummary = async (workspaceId) => {
    try {
        const response = await axios.get(`${BASE_URL}/workspaces/${workspaceId}/summary`);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching workspace summary:', error);
        throw error;
    }
};