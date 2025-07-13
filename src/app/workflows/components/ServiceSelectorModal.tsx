"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Loader2, Zap, ShieldCheck } from "lucide-react";
import { ActionOrTrigger, WorkflowStepType, Service } from "@/types/workflow";
import {
  connectService,
  fetchActionsByService,
  fetchTriggersByService,
  fetchServices,
  isConnectedService,
} from "@/services/workflow";

interface Props {
  open: boolean;
  stepType: WorkflowStepType;
  onClose: () => void;
  onSelect: (item: ActionOrTrigger) => void;
}

export default function ServiceSelectorModal({
  open,
  stepType,
  onClose,
  onSelect,
}: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [actions, setActions] = useState<ActionOrTrigger[]>([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [serviceConnected, setServiceConnected] = useState(false); // Optionnel, affichage possible

  useEffect(() => {
    if (!open) return;
    resetModal();
    loadServices();
  }, [open]);

  const resetModal = () => {
    setServices([]);
    setSelectedServiceId(null);
    setActions([]);
    setServiceConnected(false);
  };

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err) {
      console.error("Erreur lors du chargement des services :", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleServiceClick = async (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCheckingConnection(true);
    const isConnected = await isConnectedService(serviceId);

    if (isConnected) {
      setServiceConnected(true);
      await loadActionsOrTriggers(serviceId);
      setCheckingConnection(false);
    } else {
      await connectService(serviceId);
      setTimeout(async () => {
        const recheck = await isConnectedService(serviceId);
        setServiceConnected(recheck);
        if (recheck) {
          await loadActionsOrTriggers(serviceId);
        }
        setCheckingConnection(false);
      }, 1000);
    }
  };

  const loadActionsOrTriggers = async (serviceId: string) => {
    setLoadingActions(true);
    try {
      const data =
        stepType === "trigger"
          ? await fetchTriggersByService(serviceId)
          : await fetchActionsByService(serviceId);
      setActions(data);
    } catch (err) {
      console.error("Erreur lors du chargement des actions/triggers :", err);
    } finally {
      setLoadingActions(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="bg-black/40 fixed inset-0" />
      <Dialog.Panel className="relative z-50 bg-white max-w-3xl w-full rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Sélectionnez un service</h2>

        {loadingServices ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
            {services.map((service) => (
              <button
                key={service.identifier}
                onClick={() => handleServiceClick(service.identifier)}
                className={`flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition ${
                  selectedServiceId === service.identifier
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
              >
                <Zap className="text-blue-600 w-5 h-5" />
                <span className="font-medium">{service.name}</span>
              </button>
            ))}
          </div>
        )}

        {checkingConnection && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
            <Loader2 className="animate-spin w-5 h-5" />
            Vérification de la connexion au service...
          </div>
        )}

        {serviceConnected && !checkingConnection && (
          <div className="mt-4 text-green-600 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Service connecté avec succès.
          </div>
        )}

        {selectedServiceId && actions.length > 0 && !loadingActions && (
          <>
            <h3 className="text-md font-semibold mt-6 mb-2">
              Sélectionnez une{" "}
              {stepType === "trigger" ? "déclencheur" : "action"}
            </h3>
            <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
              {actions.map((item) => (
                <button
                  key={item.serviceActionId}
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-blue-50 transition"
                >
                  <ShieldCheck className="text-green-600 w-5 h-5" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.identifier}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {loadingActions && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
            <Loader2 className="animate-spin w-5 h-5" />
            Chargement des {stepType === "trigger" ? "triggers" : "actions"}...
          </div>
        )}
      </Dialog.Panel>
    </Dialog>
  );
}
