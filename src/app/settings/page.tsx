"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useGetUserPreferencesQuery } from "@/services/personalizationApi";
import { Spinner } from "@/components/ui/Spinner";
import { Settings, Bell, Globe, Moon, Shield } from "lucide-react";
import { useLanguage, Language } from "@/contexts/ThemeLanguageContext";

export default function SettingsPage() {
  const { data: prefsData, isLoading } = useGetUserPreferencesQuery(undefined);
  const [saved, setSaved] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const prefs = prefsData;

  const handleSave = () => {
    setLanguage(selectedLang);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">System Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage command center preferences and notifications.</p>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50/30 dark:bg-gray-900/30">
          <Bell className="text-blue-600 dark:text-blue-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Alert Preferences</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Push Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts on your dashboard in real-time.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={prefs?.notificationsEnabled} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Critical Incident Sounds</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Play an audible alarm for High Priority alerts.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={true} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50/30 dark:bg-gray-900/30">
          <Globe className="text-blue-600 dark:text-blue-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Localization</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between max-w-lg">
            <p className="font-medium text-gray-800 dark:text-gray-200">Dashboard Language</p>
            <select 
              value={selectedLang} 
              onChange={(e) => setSelectedLang(e.target.value as Language)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            >
              <option value="en">English (US)</option>
              <option value="zh-TW">繁體中文 (Traditional Chinese)</option>
            </select>
          </div>
          <div className="flex items-center justify-between max-w-lg">
            <p className="font-medium text-gray-800 dark:text-gray-200">Time Zone</p>
            <select defaultValue="Asia/Taipei" className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500">
              <option value="Asia/Taipei">Taipei Standard Time (GMT+8)</option>
              <option value="UTC">Coordinated Universal Time (UTC)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="secondary" className="px-6 py-2">Reset</Button>
        <Button onClick={handleSave} className="px-6 py-2 min-w-[120px]">
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
