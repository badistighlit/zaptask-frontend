import { Trigger, WorkflowData } from "@/types/workflow";
import api from "@/utils/api";
import { Action,Service } from "@/types/workflow";

//get

export async function fetchServices() : Promise<Service[]> {
    try {
        const response = await api.get("/services");
        return response.data as Service[];
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
    }
}

export async function fetchTriggersByService(serviceId: string) : Promise<Trigger[]> {
  try {
    const response = await api.get(`/services/${serviceId}/triggers`);
    return response.data as Trigger[];
  } catch (error) {
    console.error(`Error fetching triggers for service ${serviceId}:`, error);
    throw error;
  }
}

export async function fetchActionsByService(serviceId: string): Promise<Action[]> {
    try {
        const response = await api.get(`/services/${serviceId}/actions`);
        return response.data as Action[];
    } catch (error) {
        console.error(`Error fetching actions for service ${serviceId}:`, error);
        throw error;
    } }





    //partie workflow

    export async function createWorkflow(workflowData: WorkflowData) {
    try {
        const response = await api.post("/workflows", workflowData);
        return response.data;
    } catch (error) {
        console.error("Error creating workflow:", error);
        throw error;
    }   
}

/*
export async function fetchWorkflowById(workflowId: string) {
    return true;

}
export async function fetchWorkflowsByUser(userId: string) {
    return true;
}*/



// partie relation user-workflow/services
export async function isConnectedService(serviceId: string, TriggerId: string, userId: string): Promise<boolean> {
  try {
    const response = await api.get(`/services/${serviceId}/${TriggerId}/${userId}/is-connected`);
    return response.data.isConnected; 
  } catch (error) {
    console.error(`Error checking connection for service ${serviceId}:`, error);
    throw error;
  }
}



export async function connectService(serviceId: string, TriggerId:string,userId:string): Promise<void> {
    try {
        const response = await  api.post(`/services/${serviceId}/${TriggerId}/${userId}/connect`);
        return response.data.status
    } catch (error) {
        console.error(`Error connecting service ${serviceId}:`, error);
        throw error;
    }
}
