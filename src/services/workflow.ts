import {   BackendServiceAction, mapBackendParams, mapBackendWorkflow } from "@/types/BackTypes";
import {
  ActionOrTrigger,
  WorkflowData,
  Service,
  
} from "@/types/workflow";
import api from "@/utils/api";
import { AxiosError } from "axios";

// ─── SERVICES ─────────────────────────────────────────────────────────────

export async function fetchServices(): Promise<Service[]> {
  try {
    const response = await api.get("/services");
    return response.data.data as Service[];
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

async function fetchAllByService(serviceId: string): Promise<ActionOrTrigger[]> {
  try {
    const response = await api.get(`/${serviceId}/actions`);
    const service = response.data.data;

    return service.actions.map((action: BackendServiceAction) =>
      mapActionFromApi(action, service.identifier)
    );
  } catch (error) {
    console.error(`Error fetching items for service ${serviceId}:`, error);
    throw error;
  }
}

export async function fetchTriggersByService(serviceId: string): Promise<ActionOrTrigger[]> {
  const all = await fetchAllByService(serviceId);
  return all.filter((item) => item.type === "trigger");
}

export async function fetchActionsByService(serviceId: string): Promise<ActionOrTrigger[]> {
  const all = await fetchAllByService(serviceId);
  return all.filter((item) => item.type === "action");
}

// ─── WORKFLOWS ────────────────────────────────────────────────────────────

export async function createEmptyWorkflow(name: string): Promise<{ id: string; status: string; name: string }> {
  try {
    const response = await api.put("/workflows", { name });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du workflow vide :", error);
    throw error;
  }
}

export async function createWorkflow(workflowData: WorkflowData) {
  try {
    const response = await api.post("/workflows", workflowData);
    return response.data;
  } catch (error) {
    console.error("Error creating workflow:", error);
    throw error;
  }
}

export async function updateWorkflow(workflowData: WorkflowData) {
  if (!workflowData.id) throw new Error("Workflow ID is required to update.");

  console.log(workflowData)

  const payload = buildUpdatePayload(workflowData);
  console.log("Payload for update:", payload);

  try {
    const response = await api.put(`/workflows/${workflowData.id}`, payload);
    return mapBackendWorkflow (response.data);
  } catch (error) {
    console.error("Error updating workflow:", error);
    throw error;
  }
}

export async function testWorkflow(workflow: WorkflowData): Promise<boolean> {
  try {
    const response = await api.post("/testWorkflow", workflow);
    return response.data.isOk as boolean;
  } catch (error) {
    console.error("Error while testing the workflow");
    throw error;
  }
}

export async function testActionOrtriggerForWorkflow(actionOrTrigger: ActionOrTrigger): Promise<boolean> {
  try {
    const response = await api.post("/testActionOrTriggerForWorkflow", actionOrTrigger);
    return response.data.isOk as boolean;
  } catch (error) {
    console.error("Error while testing the action");
    throw error;
  }
}

export async function fetchWorkflowById(workflowId: string): Promise<WorkflowData | null> {
  try {
    const response = await api.get(`/workflows/${workflowId}`);

    if (response.status === 200 && response.data) {
      return mapBackendWorkflow(response.data);
    }

    console.warn("Réponse inattendue pour workflow ID:", workflowId, response.data);
    return null;
  } catch (error) {
    handleAxiosError(error, `fetching workflow by ID ${workflowId}`);
    return null;
  }
}

export async function fetchWorkflowsByUser(): Promise<WorkflowData[]> {
  try {
    const response = await api.get("/workflows");

    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data;
    }

    console.warn(" Données inattendues dans fetchWorkflowsByUser:", response.data);
    return [];
  } catch (error) {
    handleAxiosError(error, "fetching workflows by user");
    return [];
  }
}



export async function deployWorkflow(workflowId: string ): Promise<any[]> {
  try {
    const response = await api.post(`/workflows/deploy/${workflowId}`, null, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status === 200) {
      return response.data?.data || [];
    } else {
      console.warn("Réponse inattendue lors du déploiement:", response.status, response.data);
      return [];
    }
  } catch (error) {
    handleAxiosError(error, `deploying workflow ${workflowId}`);
    throw error;
  }
}



// ─── RELATION UTILISATEUR / SERVICE ───────────────────────────────────────

export async function isConnectedService(serviceId: string): Promise<boolean> {
  try {
    const response = await api.get(`/subscriptions/${serviceId}`);
    return response.status === 200;
  } catch (error) {
    return handleConnectionError(error);
  }
}

export async function connectService(serviceId: string): Promise<void> {
  try {
    const response = await api.get(`/${serviceId}/redirect`);

    if (response.status === 200) {
      const redirectUrl = response.data.url;
      if (!redirectUrl) {
        console.error("Redirection sans URL valide.");
        return;
      }
      openOAuthPopup(redirectUrl);
    } else {
      console.log("Réponse sans redirection explicite:", response.status);
    }
  } catch (error) {
    handleAxiosError(error, "connexion au service");
    throw error;
  }
}

function openOAuthPopup(url: string): void {
  const width = 600;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    url,
    "oauthPopup",
    `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes`
  );

  if (!popup) {
    alert("Popup blocked. Please allow popups for this site.");
  }

  const pollTimer = setInterval(() => {
    if (popup?.closed) {
      clearInterval(pollTimer);
      console.log("OAuth popup closed.");
    }
  }, 500);
}

// ─── MAPPING ──────────────────────────────────────────────────────────────


function buildUpdatePayload(workflowData: WorkflowData) {
  return {
    id: workflowData.id,
    name: workflowData.name,
    status: workflowData.status,
    actions: workflowData.steps.map(step => ({
      id : step.ref_id, 
      service_action_id: step.serviceActionId,
      status: step.status,
      execution_order: step.order,
      parameters: step.config
        ? step.config.reduce<Record<string, string | number | boolean | null>>((acc, param) => {
            if (param.value !== undefined) {
              acc[param.key] = param.value;
            } else {
              acc[param.key] = null; 
            }
            return acc;
          }, {})
        : {},
    })),
  };
}




function mapActionFromApi(action: BackendServiceAction, serviceId: string): ActionOrTrigger {
  return {
    serviceActionId: action.id,
    identifier: action.identifier,
    name: action.name,
    service_id: serviceId,
    type: action.type,
    parameters: mapBackendParams(action.parameters), // ✅ CORRECT
  };
}



function handleAxiosError(error: unknown, context: string): void {
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;
    console.error(`Axios error during ${context}:`, axiosError.response?.data);
  } else {
    console.error(`Unexpected error during ${context}:`, error);
  }
}

function handleConnectionError(error: unknown): boolean {
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;
    switch (axiosError.response?.status) {
      case 401:
      case 404:
        return false;
      default:
        console.error("Unhandled error while checking service connection:", axiosError.response?.data);
        return false;
    }
  } else {
    console.error("Unexpected non-Axios error:", error);
    return false;
  }
}



