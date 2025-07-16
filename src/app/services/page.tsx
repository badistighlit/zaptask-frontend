'use client';

import { useEffect, useState, useMemo } from 'react';
import ServiceCard from './components/ServiceCard';
import {
  connectService,
  disconnectService,
  fetchConnectedServices,
  fetchServices,
} from '@/services/workflow';
import { Service } from '@/types/workflow';
import { useNotify } from '@/components/NotificationProvider';
import { Search, LayoutList, Plug, PlugZap } from 'lucide-react';

export default function ServicesPage() {
  const [connectedServices, setConnectedServices] = useState<Service[]>([]);
  const [allAvailableServices, setAllAvailableServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const notify = useNotify();

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

  // Filter services based on search term
const filteredConnected = useMemo(() => {
  return connectedServices.filter((s) =>
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [connectedServices, searchTerm]);

const filteredAvailable = useMemo(() => {
  return allAvailableServices
    .filter((s) => !isConnected(s.identifier))
    .filter((s) => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
}, [allAvailableServices, connectedServices, searchTerm]);


  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-12">
      {/* Title */}
      <header className="flex items-center gap-3 mb-10 select-none">
        <LayoutList className="w-10 h-10 text-indigo-600" />
        <h1 className="text-4xl font-extrabold text-indigo-900">Services</h1>
      </header>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Connected Services */}
      <section>
        <h2 className="flex items-center gap-2 text-3xl font-bold text-blue-700 mb-6 select-none">
          <PlugZap className="w-7 h-7" />
          Connected Services
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loader" />
          </div>
        ) : filteredConnected.length === 0 ? (
          <p className="text-gray-500 text-center">No connected services found.</p>
        ) : (
<div className="flex flex-wrap gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scroll-smooth py-2 max-h-[380px]">
  {filteredConnected.map((service) => (
    <div key={service.identifier} className="flex-shrink-0 w-[45%] min-w-[300px]">
      <ServiceCard
        service={service}
        isConnected={true}
        onConnect={() => handleConnect(service.identifier)}
        onDisconnect={() => handleDisconnect(service.identifier)}
        loading={disconnectingId === service.identifier}
      />
    </div>
  ))}
</div>

        )}
      </section>

      {/* Available Services */}
      <section>
        <h2 className="flex items-center gap-2 text-3xl font-bold text-blue-600 mb-6 select-none">
          <Plug className="w-7 h-7" />
          Available Services
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loader" />
          </div>
        ) : filteredAvailable.length === 0 ? (
          <p className="text-gray-500 text-center">No available services found.</p>
        ) : (
<div className="flex flex-wrap gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scroll-smooth py-2 max-h-[380px]">
  {filteredAvailable.map((service) => (
    <div key={service.identifier} className="flex-shrink-0 w-[45%] min-w-[300px]">
      <ServiceCard
        service={service}
        isConnected={false}
        onConnect={() => handleConnect(service.identifier)}
        onDisconnect={() => {}}
        loading={connectingId === service.identifier}
      />
    </div>
  ))}
</div>

        )}
      </section>
    </div>
  );
}
