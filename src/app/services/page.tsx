'use client';

import { useEffect, useState } from 'react';
import ServiceCard from './components/ServiceCard';
import {
  connectService,
  disconnectService,
  fetchConnectedServices,
  fetchServices,
} from '@/services/workflow';
import { Service } from '@/types/workflow';
import { useNotify } from '@/components/NotificationProvider'; 

export default function ServicesPage() {
  const [connectedServices, setConnectedServices] = useState<Service[]>([]);
  const [allAvailableServices, setAllAvailableServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);



  const loadServices = async () => {
      try {
        const [connected, available] = await Promise.all([
          fetchConnectedServices(),
          fetchServices(),
        ]);
        setConnectedServices(connected);
        setAllAvailableServices(available);
      } catch (error) {
        console.error('Error loading services:', error);
        notify('Failed to load services', 'error');
      } finally {
        setLoading(false);
      }
    };

  const notify = useNotify();

  useEffect(() => {


    loadServices();
  }, [notify]);

  const handleConnect = async (serviceId: string) => {
    try {
      setConnectingId(serviceId);
      await connectService(serviceId);
      notify('Redirecting to connect service...', 'success');
      await loadServices(); 

    } catch {
      notify('Connection failed', 'error');
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = async (serviceId: string) => {
    try {
      setDisconnectingId(serviceId);
      await disconnectService(serviceId);
      setConnectedServices((prev) =>
        prev.filter((s) => s.identifier !== serviceId)
      );
      notify('Service disconnected', 'success');
    } catch {
      notify('Disconnection failed', 'error');
    } finally {
      setDisconnectingId(null);
    }
  };

  const isConnected = (serviceId: string) =>
    connectedServices.some((s) => s.identifier === serviceId);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-16">
      {/* Connected Services */}
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-blue-700">
          Connected Services
        </h1>
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loader" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedServices.length === 0 ? (
              <p className="text-gray-500">No connected services found.</p>
            ) : (
              connectedServices.map((service) => (
                <ServiceCard
                  key={service.identifier}
                  service={service}
                  isConnected={true}
                  onConnect={() => handleConnect(service.identifier)}
                  onDisconnect={() => handleDisconnect(service.identifier)}
                  loading={disconnectingId === service.identifier}
                />
              ))
            )}
          </div>
        )}
      </section>

      {/* Available Services */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-blue-600">
          Available Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAvailableServices
            .filter((s) => !isConnected(s.identifier))
            .map((service) => (
              <ServiceCard
                key={service.identifier}
                service={service}
                isConnected={false}
                onConnect={() => handleConnect(service.identifier)}
                onDisconnect={() => {}}
                loading={connectingId === service.identifier}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
