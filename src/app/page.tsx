"use client";

import { useGetCityMetricsQuery } from "@/services/digitalTwinApi";
import { useGetAlertsQuery } from "@/services/disasterApi";
import { useGetSheltersQuery } from "@/services/evacuationApi";
import { useGetCommandDashboardQuery } from "@/store/api";
import { Spinner } from "@/components/ui/Spinner";
import { AlertTriangle, Users, Home, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/ThemeLanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage();
  const { data: metricsData, isLoading: metricsLoading } = useGetCityMetricsQuery(undefined);
  const { data: alertsData, isLoading: alertsLoading } = useGetAlertsQuery(undefined);
  const { data: sheltersData, isLoading: sheltersLoading } = useGetSheltersQuery(undefined);
  const { data: commandData, isLoading: commandLoading } = useGetCommandDashboardQuery(undefined);

  if (metricsLoading || alertsLoading || sheltersLoading || commandLoading) {
    return (
      <main className="flex h-full items-center justify-center" aria-label={t("loading")}>
        <Spinner size="lg" />
      </main>
    );
  }

  const metrics = metricsData;
  const alerts = alertsData || [];
  const shelters = sheltersData || [];

  return (
    <main className="space-y-6 animate-in fade-in duration-500" aria-label={t("nav.dashboard")}>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Dashboard Overview">
        <article className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
            <AlertTriangle size={24} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">{t("dashboard.activeAlerts")}</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{alerts.length}</p>
          </div>
        </article>

        <article className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
            <Users size={24} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">{t("dashboard.impactedPopulation")}</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{metrics?.populationImpacted?.toLocaleString() || 0}</p>
          </div>
        </article>

        <article className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
            <Home size={24} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">{t("dashboard.openShelters")}</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{shelters.filter((s: any) => s.status === 'Open').length}</p>
          </div>
        </article>

        <article className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
            <Activity size={24} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">{t("dashboard.activeIncidents")}</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{commandData?.total_active_disasters ?? metrics?.activeIncidents ?? 0}</p>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Details">
        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <header className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t("dashboard.recentAlerts")}</h3>
          </header>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">{t("dashboard.noActiveAlerts")}</div>
            ) : (
              alerts.map((alert: any) => (
                <div key={alert.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors flex justify-between items-start">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
                      alert.severity === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400' :
                      alert.severity === 'Warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                    }`}>
                      {alert.severity}
                    </span>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{alert.message}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{alert.time}</span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <header className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t("dashboard.shelterStatus")}</h3>
          </header>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {shelters.slice(0, 4).map((shelter: any) => (
              <div key={shelter.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors flex justify-between items-center">
                <div>
                  <h4 className="text-gray-800 dark:text-gray-200 font-medium">{shelter.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("dashboard.occupancy")}: {shelter.currentOccupancy} / {shelter.capacity}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  shelter.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' :
                  shelter.status === 'Nearing Capacity' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                }`}>
                  {shelter.status}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
