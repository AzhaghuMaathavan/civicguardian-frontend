"use client";

import { useGetHighRiskCitizensQuery } from "@/services/checkinApi";
import { useGetSyncStatusQuery } from "@/services/offlineApi";
import { Spinner } from "@/components/ui/Spinner";
import { Users, Activity, PhoneCall, HeartPulse } from "lucide-react";
import { useLanguage } from "@/contexts/ThemeLanguageContext";

export default function AnalyticsPage() {
  const { data: highRiskData, isLoading: highRiskLoading } = useGetHighRiskCitizensQuery(undefined);
  const { data: syncData, isLoading: syncLoading } = useGetSyncStatusQuery(undefined);
  const { t } = useLanguage();

  if (highRiskLoading || syncLoading) {
    return (
      <main className="flex h-full items-center justify-center" aria-label={t("loading")}>
        <Spinner size="lg" />
      </main>
    );
  }

  const highRiskCitizens = highRiskData || [];
  const syncStatus = syncData;

  const stats = [
    { title: t("analytics.totalRegistered") || "Total Citizens Registered", value: "84,592", change: "+1,204 this week", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: t("analytics.vulnerable") || "Vulnerable Citizens", value: highRiskCitizens.length.toString(), change: "Tracked currently", icon: HeartPulse, color: "text-rose-600", bg: "bg-rose-100" },
    { title: t("analytics.activeSos") || "Active SOS Signals", value: "14", change: "-2 from yesterday", icon: PhoneCall, color: "text-red-600", bg: "bg-red-100" },
    { title: t("analytics.pendingSyncs") || "Pending Syncs", value: syncStatus?.pendingItems?.toString() || "0", change: `Last sync: ${syncStatus?.lastSync ? new Date(syncStatus.lastSync).toLocaleTimeString() : 'N/A'}`, icon: Activity, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <main className="space-y-6 animate-in fade-in duration-500" aria-label={t("nav.analytics")}>
      <header>
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight dark:text-gray-100">{t("nav.analytics")}</h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400">{t("analytics.description") || "Demographics and engagement metrics."}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Statistics">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <article key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl ${stat.bg} dark:bg-opacity-20`}>
                <Icon size={24} className={stat.color} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</h3>
                <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">{stat.change}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6" aria-label="Charts">
        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{t("analytics.trends") || "Registration Trends"}</h3>
          <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 flex items-end justify-between p-4 gap-2">
            {[40, 70, 45, 90, 65, 85, 120].map((h, i) => (
              <div key={i} className="w-full bg-blue-500/80 rounded-t-sm hover:bg-blue-600 transition-colors" style={{ height: `${(h/120)*100}%` }} aria-label={`Data point ${i}`} role="img"></div>
            ))}
          </div>
        </article>
        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{t("analytics.demographics") || "Demographics Distribution"}</h3>
          <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
             <div className="w-48 h-48 rounded-full border-[16px] border-indigo-500/80 border-r-rose-500/80 border-b-amber-500/80 border-l-emerald-500/80 rotate-45" role="img" aria-label="Pie Chart"></div>
          </div>
        </article>
      </section>
    </main>
  );
}

