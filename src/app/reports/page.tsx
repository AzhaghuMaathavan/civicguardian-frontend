"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/ThemeLanguageContext";
import { useGetActiveDisastersQuery } from "@/services/disasterApi";
import { useGetRescueOperationsQuery } from "@/services/rescueApi";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function ReportsPage() {
  const { t } = useLanguage();
  const { data: disasters, isLoading: disastersLoading, isError: disastersError, refetch: refetchDisasters } = useGetActiveDisastersQuery(undefined, { pollingInterval: 5000 });
  const { data: rescues, isLoading: rescuesLoading, isError: rescuesError, refetch: refetchRescues } = useGetRescueOperationsQuery(undefined, { pollingInterval: 5000 });
  
  if (disastersLoading || rescuesLoading) {
    return (
      <main className="flex h-full items-center justify-center" aria-label={t("loading")}>
        <Spinner size="lg" />
      </main>
    );
  }

  if (disastersError || rescuesError) {
    return <ErrorState onRetry={() => { refetchDisasters(); refetchRescues(); }} />;
  }

  const disasterList = Array.isArray(disasters) ? disasters : [];
  const rescueList = Array.isArray(rescues) ? rescues : [];

  const dynamicReports = [
    ...disasterList.map((d: any, idx: number) => ({
      id: `dis-${d.id || idx}`,
      title: `Incident Assessment: ${d.title || d.type || 'Hazard Alert'}`,
      date: d.startTime ? new Date(d.startTime).toISOString().split('T')[0] : '2026-07-26',
      type: 'Disaster Analysis',
      size: 'Dynamic'
    })),
    ...rescueList.map((r: any, idx: number) => ({
      id: `res-${r.id || idx}`,
      title: `Rescue Operation Log: ${r.status || 'Active Mission'} (#${r.id || idx + 101})`,
      date: '2026-07-26',
      type: 'Logistics Log',
      size: 'Dynamic'
    }))
  ];

  return (
    <main className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500" aria-label={t("nav.reports")}>
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight dark:text-gray-100">{t("nav.reports")}</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">{t("reports.description") || "Generate and download official incident and analytics reports."}</p>
        </div>
        <Button className="flex items-center gap-2" aria-label={t("reports.generate") || "Generate New Report"}>
          <FileText size={18} aria-hidden="true" /> {t("reports.generate") || "Generate New Report"}
        </Button>
      </header>

      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden" aria-label="Available Reports">
        <header className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/30">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t("reports.available") || "Available Documents"}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="flex items-center gap-2 px-3 py-1.5 h-9 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" aria-label={t("reports.dateRange") || "Filter by Date Range"}>
              <Calendar size={16} aria-hidden="true" /> {t("reports.dateRange") || "Date Range"}
            </Button>
            <Button variant="secondary" className="flex items-center gap-2 px-3 py-1.5 h-9 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" aria-label={t("reports.category") || "Filter by Category"}>
              <Filter size={16} aria-hidden="true" /> {t("reports.category") || "Category"}
            </Button>
          </div>
        </header>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {dynamicReports.length === 0 ? (
            <div className="p-0">
              <EmptyState 
                title="No reports generated" 
                message="There are currently no active disasters or rescue operations to report on." 
                icon={FileText}
              />
            </div>
          ) : (
            dynamicReports.map((report) => (
              <article key={report.id} className="p-5 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                    <FileText size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{report.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1" aria-label={`Date: ${report.date}`}>
                        <Calendar size={12} aria-hidden="true" /> {report.date}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md" aria-label={`Type: ${report.type}`}>
                        {report.type}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="secondary" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" aria-label={`${t("reports.download") || "Download"} ${report.title}`}>
                  <Download size={16} aria-hidden="true" /> <span className="hidden sm:inline">{t("reports.download") || "Download"} ({report.size})</span>
                </Button>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
