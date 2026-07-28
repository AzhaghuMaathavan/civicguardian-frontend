"use client";

import { useEffect, useState } from "react";
import { Activity, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";

interface ServiceStatus {
  name: string;
  path: string;
  method?: "GET" | "POST";
  status: "up" | "down" | "checking" | "unknown";
  code?: number;
  latencyMs?: number;
}

const SERVICES: ServiceStatus[] = [
  { name: "API Gateway", path: "/actuator/health", status: "checking" },
  { name: "Auth Service", path: "/auth/login", method: "POST", status: "checking" },
  { name: "AI Personalization", path: "/docs", status: "checking" },
  { name: "AI Risk Prediction", path: "/api/v1/risk", status: "checking" },
  { name: "Emergency Command Center", path: "/api/v1/command", status: "checking" },
  { name: "Safety Checkin", path: "/api/v1/safety", status: "checking" },
  { name: "Offline Sync", path: "/offline", status: "checking" },
  { name: "Disaster Intelligence", path: "/disasters", status: "checking" },
  { name: "Community Rescue", path: "/sos", status: "checking" },
  { name: "Digital Twin", path: "/api/v1/citizens", status: "checking" },
  { name: "Smart Evacuation", path: "/evacuation", status: "checking" },
];

export default function ServiceStatusPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const [services, setServices] = useState<ServiceStatus[]>(SERVICES);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [checking, setChecking] = useState(false);

  const checkServices = async () => {
    setChecking(true);
    const results = await Promise.all(
      SERVICES.map(async (svc) => {
        const start = performance.now();
        try {
          const res = await fetch(`${baseUrl}${svc.path}`, {
            method: svc.method || "GET",
            headers: { Accept: "application/json" },
            // bypass auth for public health endpoints
            cache: "no-store",
          });
          const latency = Math.round(performance.now() - start);
          const code = res.status;
          // 401/403 counts as reachable = up, just unauthenticated
          const up = res.ok || code === 401 || code === 403 || code === 400;
          return {
            ...svc,
            status: up ? "up" : "down",
            code,
            latencyMs: latency,
          } as ServiceStatus;
        } catch {
          return { ...svc, status: "down" as const, code: undefined, latencyMs: undefined };
        }
      })
    );
    setServices(results);
    setLastChecked(new Date());
    setChecking(false);
  };

  useEffect(() => {
    checkServices();
    const interval = setInterval(checkServices, 30_000);
    return () => clearInterval(interval);
  }, [baseUrl]);

  const upCount = services.filter((s) => s.status === "up").length;
  const total = services.length;

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8" aria-label="Service Status">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            Microservices Status
          </h1>
          <p className="text-slate-500 mt-2">
            Live health for all CivicGuardian backend services
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            {lastChecked
              ? `Last checked: ${lastChecked.toLocaleTimeString()}`
              : "Checking..."}
          </span>
          <button
            onClick={checkServices}
            disabled={checking}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw size={18} className={checking ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Summary">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Services</p>
          <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">{total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Operational</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{upCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Down</p>
          <p className="text-4xl font-bold text-red-600 mt-2">{total - upCount}</p>
        </div>
      </section>

      <section aria-label="Service Details" className="space-y-3">
        {services.map((svc) => {
          const badge =
            svc.status === "up"
              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
              : svc.status === "down"
              ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400";

          const icon =
            svc.status === "up" ? (
              <ShieldCheck size={20} className="text-green-500" />
            ) : (
              <AlertTriangle size={20} className="text-red-500" />
            );

          return (
            <article
              key={svc.name}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {icon}
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {svc.name}
                  </h2>
                  <p className="text-sm text-slate-500 font-mono">{baseUrl}{svc.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {svc.latencyMs !== undefined && (
                  <span className="text-sm text-slate-500">{svc.latencyMs}ms</span>
                )}
                {svc.code !== undefined && (
                  <span className="text-sm text-slate-500">{svc.code}</span>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${badge}`}
                >
                  {svc.status}
                </span>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
