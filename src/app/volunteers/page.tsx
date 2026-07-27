"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { HeartHandshake, CheckCircle, Clock, Shield, MapPin, AlertCircle } from "lucide-react";
import { useGetVolunteersQuery, useGetRescueTasksQuery } from "@/services/rescueApi";
import { Spinner } from "@/components/ui/Spinner";
import { useLanguage } from "@/contexts/ThemeLanguageContext";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function VolunteersPage() {
  const { data: volunteersData, isLoading, isError, refetch } = useGetVolunteersQuery(undefined, { pollingInterval: 5000 });
  const { data: tasksData } = useGetRescueTasksQuery(undefined, { pollingInterval: 5000 });
  const { t } = useLanguage();
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

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

  const volunteers = volunteersData || [];
  const tasks = tasksData || [];
  const deployed = volunteers.filter((v: any) => v.status === 'Deployed').length;
  const available = volunteers.filter((v: any) => v.status === 'Available').length;

  return (
    <main className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500" aria-label={t("nav.volunteer")}>
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight dark:text-gray-100">{t("nav.volunteer")}</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">{t("volunteer.description") || "Track, deploy, and communicate with emergency response volunteers."}</p>
        </div>
        <Button onClick={() => setIsDispatchModalOpen(true)} aria-label={t("volunteer.dispatch") || "Dispatch Volunteer"}>
          {t("volunteer.dispatch") || "+ Dispatch Volunteer"}
        </Button>
      </header>

      <Modal isOpen={isDispatchModalOpen} onClose={() => setIsDispatchModalOpen(false)} title={t("volunteer.dispatch") || "Dispatch Volunteer"}>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Available Volunteers</h4>
            {available > 0 ? (
              <div className="space-y-2">
                {volunteers.filter((v: any) => v.status === 'Available').map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <span className="text-sm font-medium dark:text-gray-200">{v.name || v.fullName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin size={12}/> {v.location || 'Unknown'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No volunteers are currently available.</p>
                <p className="text-xs text-gray-400 mt-1">Volunteers must check in via the mobile app.</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target SOS Request</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {tasks.length === 0 ? (
                <option value="">No active SOS requests (Trigger via Mobile App)</option>
              ) : (
                tasks.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.title} - Priority: {t.priority}</option>
                ))
              )}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsDispatchModalOpen(false)}>Cancel</Button>
            <Button disabled={available === 0 || tasks.length === 0} className={(available === 0 || tasks.length === 0) ? "opacity-50 cursor-not-allowed" : ""}>Dispatch</Button>
          </div>
        </div>
      </Modal>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Volunteer Stats">
        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <HeartHandshake size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("volunteer.totalRegistered") || "Total Registered"}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{volunteers.length}</p>
            {volunteers.length === 0 && <p className="text-xs text-gray-400 font-normal mt-1">No volunteers currently online.</p>}
          </div>
        </article>

        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
            <CheckCircle size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("volunteer.availableNow") || "Available Now"}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{available}</p>
            {available === 0 && <p className="text-xs text-gray-400 font-normal mt-1">Waiting for volunteer check-ins...</p>}
          </div>
        </article>

        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
            <Clock size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("volunteer.deployed") || "Deployed in Field"}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{deployed}</p>
            {deployed === 0 && <p className="text-xs text-gray-400 font-normal mt-1">Waiting for live events...</p>}
          </div>
        </article>
      </section>

      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden mt-8" aria-label="Volunteer Roster">
        <header className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t("volunteer.roster") || "Volunteer Roster"}</h3>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="List of volunteers">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("volunteer.name") || "Name"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("volunteer.location") || "Location"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("volunteer.skills") || "Skills"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("volunteer.status") || "Status"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right" scope="col">{t("actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-0">
                    <EmptyState 
                      title="No volunteers available" 
                      message="There are currently no volunteers registered in the active sector." 
                      icon={HeartHandshake}
                    />
                  </td>
                </tr>
              ) : (
                volunteers.map((volunteer: any) => (
                  <tr key={volunteer.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs" aria-hidden="true">
                        {volunteer.name.charAt(0)}
                      </div>
                      {volunteer.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{volunteer.location}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2 flex-wrap" aria-label={`Skills for ${volunteer.name}`}>
                        {volunteer.skills.map((skill: string, idx: number) => (
                          <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        volunteer.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' :
                        volunteer.status === 'Deployed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {volunteer.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="secondary" className="px-4 py-1.5 text-xs font-medium rounded-lg" aria-label={`View details for ${volunteer.name}`}>{t("view") || "View"}</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
