import { ActionOrTrigger,  WorkflowData,Service } from "@/types/workflow";
import api from "@/utils/api";
import { AxiosError } from "axios";

//get

export async function fetchServices() : Promise<Service[]> {
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
    return response.data.data.actions as ActionOrTrigger[];
  } catch (error) {
    console.error(`Error fetching items for service ${serviceId}:`, error);
    throw error;
  }
}


export async function fetchTriggersByService(serviceId: string): Promise<ActionOrTrigger[]> {
  const all = await fetchAllByService(serviceId);
  return all.filter(item => item.type === "trigger");
}

export async function fetchActionsByService(serviceId: string): Promise<ActionOrTrigger[]> {
  const all = await fetchAllByService(serviceId);
  return all.filter(item => item.type === "action");
}






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


export async function isConnectedService(serviceId: string, triggerId: string): Promise<boolean> {
  try {
    const response = await api.get(`/subscriptions/${serviceId}`);

    if (response.status === 302) {
      return true;
    }

    console.warn(`Unexpected status code ${response.status} — assuming not connected.`);
    return false;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;

      switch (axiosError.response?.status) {
        case 401:
          console.warn("Not connected: No access token specified.");
          return false;

        case 404:
          console.warn("Not connected: User is not subscribed to this service.");
          return false;

        default:
          console.error(
            `Unhandled error while checking service connection (status ${axiosError.response?.status}):`,
            axiosError.response?.data
          );
          return false;
      }
    } else {
      console.error("Unexpected non-Axios error:", error);
      return false;
    }
  }
}


export async function connectService(serviceId: string): Promise<void> {
  try {
    const response = await api.get(
      `/${serviceId}/redirect`,
      {
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      }
    );

    if (response.status === 302) {
      const redirectUrl = response.headers.location;

      if (!redirectUrl) {
        console.error("Redirection 302 reçue sans header 'location'.");
        return;
      }

      openOAuthPopup(redirectUrl);
    } else {
      console.log("Réponse reçue sans redirection :", response.status);
    }

  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      console.error("Erreur 401 : Token d'accès manquant.");
    } else if (axiosError.response?.status === 404) {
      console.error("Erreur 404 : Service introuvable.");
    } else {
      console.error("Erreur de connexion au service :", axiosError);
    }

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
