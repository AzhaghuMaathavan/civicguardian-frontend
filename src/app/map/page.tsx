"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { Map as MapIcon, AlertTriangle, Navigation2, Activity } from "lucide-react";
import { useGetDisastersQuery } from "@/services/disasterApi";
import { useGetInfrastructureStatusQuery } from "@/services/digitalTwinApi";
import { useGetSheltersQuery, useGetRoutesQuery } from "@/services/evacuationApi";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><Spinner size="lg" /></div> });

export default function MapPage() {
  const { data: disastersData, isLoading: disastersLoading, isError: disastersError, refetch: refetchDisasters } = useGetDisastersQuery(undefined, { pollingInterval: 5000 });
  const { data: infraData, isLoading: infraLoading } = useGetInfrastructureStatusQuery(undefined, { pollingInterval: 5000 });
  const { data: sheltersData, isLoading: sheltersLoading } = useGetSheltersQuery(undefined, { pollingInterval: 5000 });
  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(undefined, { pollingInterval: 5000 });
  
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  if (disastersLoading || infraLoading || sheltersLoading || routesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (disastersError) {
    return <ErrorState onRetry={refetchDisasters} />;
  }

  const disasters = disastersData || [];
  const infrastructure = infraData || [];
  const shelters = sheltersData || [];
  const routes = routesData || [];

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Live Hazard Map</h2>
          <p className="text-gray-500 mt-1">Real-time visualization of active disasters and infrastructure.</p>
        </div>
        <button 
          onClick={() => setIsRouteModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Navigation2 size={18} />
          Broadcast Route
        </button>
      </div>

      <Modal isOpen={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} title="Broadcast Evacuation Route">
        <div className="space-y-4">
          {routes.length === 0 ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No evacuation routes are available.</p>
              <p className="text-xs text-gray-500 mt-1">Generate a disaster first to create evacuation routes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Route to Broadcast</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {routes.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.name} - {r.estimatedTime}</option>
                ))}
              </select>
              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium" onClick={() => setIsRouteModalOpen(false)}>Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Broadcast Now</button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <div className="flex gap-6 h-[600px]">
        {/* Left Side: Leaflet Map */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200/60 flex items-center justify-center relative overflow-hidden shadow-inner">
          <MapComponent disasters={disasters} shelters={shelters} />
        </div>

        {/* Right Side: Control Panel / Legend */}
        <div className="w-80 flex flex-col gap-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-gray-200/60 flex-1 overflow-y-auto">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-red-500" />
              Active Disasters
            </h3>
            <div className="space-y-3">
              {disasters.map((d: any) => (
                <div key={d.id} className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                  <p className="font-medium text-gray-800 text-sm">{d.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{d.location}</p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mt-6 mb-4">
              <Activity size={18} className="text-blue-500" />
              Infrastructure Status
            </h3>
            <div className="space-y-3">
              {infrastructure.map((infra: any) => (
                <div key={infra.id} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{infra.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{infra.type}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    infra.status === 'Critical' ? 'bg-red-100 text-red-700' :
                    infra.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {infra.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
