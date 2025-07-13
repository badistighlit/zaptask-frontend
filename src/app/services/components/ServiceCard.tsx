'use client';

import { Service } from '@/types/workflow';
import Button from '@/components/ui/Button';
import { LogOut, LogIn, Loader2 } from 'lucide-react';

type Props = {
  service: Service;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  loading?: boolean;
};

export default function ServiceCard({
  service,
  isConnected,
  onConnect,
  onDisconnect,
  loading = false,
}: Props) {
  return (
    <div className="border rounded-2xl p-5 shadow-sm bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-xl">
          <span className="text-blue-600 font-bold text-xl uppercase">
            {service.identifier[0]}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {service.name || service.identifier}
          </h2>
          <p className="text-sm text-gray-500">
            {isConnected ? 'Connected' : 'Not connected'}
          </p>
        </div>
      </div>

      <div className="sm:ml-auto">
        <Button
          variant={isConnected ? 'destructive' : 'primary'}
          onClick={isConnected ? onDisconnect : onConnect}
          disabled={loading}
          icon={
            loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isConnected ? (
              <LogOut className="w-4 h-4" />
            ) : (
              <LogIn className="w-4 h-4" />
            )
          }
          label={loading ? 'Loading...' : isConnected ? 'Disconnect' : 'Connect'}
        />
      </div>
    </div>
  );
}
