"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Megaphone, AlertTriangle, ShieldCheck, MapPin, Map, Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BroadcastAlertPage() {
  const { roles, token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // Basic authorization check for UI
  if (!roles?.includes("ROLE_GOVERNMENT") && !roles?.includes("ROLE_ADMIN")) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <ShieldCheck className="w-24 h-24 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Access Denied</h1>
        <p className="text-slate-500 mt-2">Only verified government agencies can publish emergency alerts.</p>
        <button onClick={() => router.push("/")} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Return to Dashboard</button>
      </div>
    );
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    agency: "NDMA",
    agencyId: "NDMA-HQ-01",
    alertType: "FLOOD",
    severity: "CRITICAL",
    title: "",
    description: "",
    latitude: 25.0330,
    longitude: 121.5654,
    radiusKm: 15.0
  });

  const generateEventId = () => `${formData.agency}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    const payload = {
      ...formData,
      eventId: generateEventId(),
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // default +48 hrs
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/ingestion/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": "GOV-SECRET-KEY-2026"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ ...formData, title: "", description: "" }); // reset some fields
      } else {
        alert("Failed to broadcast alert. Check permissions or gateway connection.");
      }
    } catch (err) {
      alert("Network error. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
              <Megaphone className="text-red-600" size={32} />
              Government Control Panel
            </h1>
            <p className="text-slate-500 mt-2">Secure terminal for publishing real-time emergency alerts to the CivicGuardian mesh.</p>
          </div>
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <ShieldCheck size={20} />
            RESTRICTED ACCESS
          </div>
        </header>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
            <ShieldCheck size={24} />
            <div>
              <h3 className="font-bold">Alert Successfully Broadcasted</h3>
              <p className="text-sm">The event has been securely ingested, Kafka events fired, AI risks recalculated, and notifications deployed.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Issuing Agency</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={formData.agency}
                onChange={e => setFormData({...formData, agency: e.target.value})}
              >
                <option value="NDMA">National Disaster Management Authority (NDMA)</option>
                <option value="IMD">Indian Meteorological Department (IMD)</option>
                <option value="FIRE_DEPT">National Fire Agency</option>
                <option value="POLICE">State Police Department</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Disaster Category</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={formData.alertType}
                onChange={e => setFormData({...formData, alertType: e.target.value})}
              >
                <option value="FLOOD">Flood</option>
                <option value="EARTHQUAKE">Earthquake</option>
                <option value="CYCLONE">Cyclone / Typhoon</option>
                <option value="TSUNAMI">Tsunami</option>
                <option value="FIRE">Industrial Fire / Wildfire</option>
                <option value="CHEMICAL_LEAK">Chemical / Biohazard Leak</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Alert Title</label>
            <input 
              required
              placeholder="e.g. Category 5 Cyclone Warning for Coastal Regions"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none text-lg font-medium"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Detailed Emergency Instructions</label>
            <textarea 
              required
              rows={4}
              placeholder="Provide exact instructions for citizens, expected impact times, and evacuation protocol..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="col-span-3 mb-2 flex items-center gap-2">
              <MapPin className="text-blue-500" size={20} />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Geospatial Targeting parameters</h3>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Latitude</label>
              <input 
                type="number" step="0.0001" required
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-white"
                value={formData.latitude}
                onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Longitude</label>
              <input 
                type="number" step="0.0001" required
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-white"
                value={formData.longitude}
                onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Impact Radius (Km)</label>
              <input 
                type="number" step="0.1" required
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-white"
                value={formData.radiusKm}
                onChange={e => setFormData({...formData, radiusKm: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-8 mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Event Severity:</span>
              <div className="flex gap-2">
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({...formData, severity: level})}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      formData.severity === level 
                        ? level === 'CRITICAL' || level === 'HIGH' ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xl shadow-red-600/20 flex items-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              AUTHORIZE & BROADCAST
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
