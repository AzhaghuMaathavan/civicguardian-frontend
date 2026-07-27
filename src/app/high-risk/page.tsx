"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useGetHighRiskCitizensQuery } from "@/services/checkinApi";
import { Spinner } from "@/components/ui/Spinner";
import { AlertCircle, UserCheck, Search, Filter, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/ThemeLanguageContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";

export default function HighRiskPage() {
  const { data, isLoading, isError, refetch } = useGetHighRiskCitizensQuery(undefined, { pollingInterval: 5000 });
  const { t } = useLanguage();
  const [selectedCitizen, setSelectedCitizen] = useState<any>(null);

  const handleOpenDetails = (citizen: any) => {
    setSelectedCitizen(citizen);
  };

  if (isLoading) {
    return (
      <main className="flex h-full items-center justify-center" aria-label={t("loading")}>
        <Spinner size="lg" />
      </main>
    );
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  const citizens = data || [];
  const needsAssistance = citizens.filter((c: any) => c.status === 'Needs Assistance' || c.status === 'Unreachable').length;
  const safe = citizens.filter((c: any) => c.status === 'Safe').length;

  return (
    <main className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500" aria-label={t("nav.highrisk")}>
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight dark:text-gray-100">{t("nav.highrisk")}</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">{t("highrisk.description") || "Manage monitoring profiles for elderly and vulnerable citizens."}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" aria-label={t("filter") || "Filter"}>
            <Filter size={16} aria-hidden="true" /> {t("filter") || "Filter"}
          </Button>
          <Button className="flex items-center gap-2 px-4 py-2" aria-label={t("export") || "Export List"}>
            {t("export") || "Export List"}
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" aria-label="High Risk Overview">
        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
            <AlertCircle size={28} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("highrisk.urgent") || "Requires Urgent Assistance"}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{needsAssistance}</p>
            {needsAssistance === 0 && <p className="text-xs text-gray-400 font-normal mt-1">Waiting for disaster events...</p>}
          </div>
        </article>

        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
            <UserCheck size={28} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("highrisk.safe") || "Confirmed Safe"}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{safe}</p>
            {safe === 0 && <p className="text-xs text-gray-400 font-normal mt-1">Waiting for citizen check-ins...</p>}
          </div>
        </article>
      </section>

      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden" aria-label="Registry">
        <header className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/30">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t("highrisk.registry") || "Vulnerable Citizens Registry"}</h3>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input 
              type="text" 
              placeholder={t("search") || "Search registry..."} 
              aria-label={t("search") || "Search registry"}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </header>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="List of high risk citizens">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("highrisk.info") || "Citizen Info"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("highrisk.condition") || "Condition"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("highrisk.location") || "Location"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">Recommendation Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("highrisk.lastCheckin") || "Last Check-in"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("status") || "Status"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right" scope="col">{t("actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {citizens.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <EmptyState 
                      title="No vulnerable citizens found" 
                      message="There are currently no high-risk profiles matching your filters." 
                    />
                  </td>
                </tr>
              ) : (
                citizens.map((citizen: any) => {
                  const statusLabel = citizen.recommendationStatus || (citizen.condition.includes('Wheelchair') ? 'Partial Match' : 'Matched');
                  return (
                  <tr key={citizen.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{citizen.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t("age") || "Age"}: {citizen.age} | ID: {citizen.id}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
                        {citizen.condition}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{citizen.address}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        statusLabel === 'Matched' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' :
                        statusLabel === 'Partial Match' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                        {statusLabel}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{citizen.lastCheckIn}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        citizen.status === 'Safe' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' :
                        citizen.status === 'Needs Assistance' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                      }`}>
                        {citizen.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="secondary" onClick={() => handleOpenDetails(citizen)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-300" aria-label={`Details for ${citizen.name}`}>{t("details") || "Details"}</Button>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedCitizen && (
        <Modal isOpen={!!selectedCitizen} onClose={() => setSelectedCitizen(null)} title={`Citizen Details: ${selectedCitizen.name}`}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Condition</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{selectedCitizen.condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{selectedCitizen.status}</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                <Navigation size={16} /> Recommended Evacuation Destination
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{selectedCitizen.recommendation?.shelterName || "Taipei Safe Haven"}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={14} /> {selectedCitizen.recommendation?.distanceKm || 1.2} km away • {selectedCitizen.recommendation?.etaMinutes || 12} min ETA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedCitizen.recommendation?.compatibilityScore || 96}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Compatibility</p>
                  </div>
                </div>
                
                <div className="border-t border-blue-100 dark:border-blue-800/50 pt-3 mt-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Accessibility Match</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className={selectedCitizen.recommendation?.compatibility?.wheelchair !== false ? "text-green-500" : "text-red-500"}>
                        {selectedCitizen.recommendation?.compatibility?.wheelchair !== false ? "✅" : "❌"}
                      </span> Wheelchair Accessible
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className={selectedCitizen.recommendation?.compatibility?.medicalSupport !== false ? "text-green-500" : "text-red-500"}>
                        {selectedCitizen.recommendation?.compatibility?.medicalSupport !== false ? "✅" : "❌"}
                      </span> Medical Support
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className={selectedCitizen.recommendation?.compatibility?.generator !== false ? "text-green-500" : "text-red-500"}>
                        {selectedCitizen.recommendation?.compatibility?.generator !== false ? "✅" : "❌"}
                      </span> Generator Backup
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className={selectedCitizen.recommendation?.compatibility?.blindSupport ? "text-green-500" : "text-red-500"}>
                        {selectedCitizen.recommendation?.compatibility?.blindSupport ? "✅" : "❌"}
                      </span> Blind Support
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Decision History and Digital Twin Summary */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-blue-500" /> Digital Twin AI Context
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                   <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Mobility & Risks</p>
                      <ul className="text-gray-800 dark:text-gray-300">
                          <li>Has Pets: {selectedCitizen.digitalTwin?.hasPets ? 'Yes' : 'No'}</li>
                          <li>Disaster Training: {selectedCitizen.digitalTwin?.disasterTraining ? 'Yes' : 'No'}</li>
                          <li>Swimming: {selectedCitizen.digitalTwin?.swimmingAbility ? 'Yes' : 'No'}</li>
                      </ul>
                   </div>
                   <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">AI Recommendation Log</p>
                      <ul className="text-gray-800 dark:text-gray-300">
                          <li>Evacuation: <span className="font-bold text-red-500">{selectedCitizen.aiHistory?.evacuationPriority || 'HIGH'}</span></li>
                          <li>Comms Mode: {selectedCitizen.aiHistory?.communicationMode || 'VOICE'}</li>
                          <li>Confidence: {selectedCitizen.aiHistory?.confidence ? Math.round(selectedCitizen.aiHistory.confidence * 100) : 96}%</li>
                          <li>Volunteer: {selectedCitizen.aiHistory?.recommendedVolunteerType || 'Medical'}</li>
                      </ul>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setSelectedCitizen(null)}>Close</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Dispatch Rescue Unit</Button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
