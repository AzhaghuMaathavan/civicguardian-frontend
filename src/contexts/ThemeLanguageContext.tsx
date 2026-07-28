"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export type Language = "en" | "zh-TW" | "ta" | "hi" | "nan-TW" | "hak-TW" | "ami";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.analytics": "Analytics",
    "nav.disaster": "Disaster Monitoring",
    "nav.shelter": "Shelter Management",
    "nav.volunteer": "Volunteer Management",
    "nav.highrisk": "High Risk Citizens",
    "nav.reports": "Reports",
    "nav.settings": "Settings",
    "nav.rescue": "Rescue Monitoring",
    "theme.light": "Light Mode",
    "theme.dark": "Dark Mode",
    "theme.system": "System",
    "dashboard.title": "City Dashboard",
    "dashboard.welcome": "Citizen Safety & Disaster Response Overview",
    "dashboard.activeAlerts": "Active Alerts",
    "dashboard.impactedPopulation": "Impacted Population",
    "dashboard.openShelters": "Open Shelters",
    "dashboard.activeIncidents": "Active Incidents",
    "dashboard.recentAlerts": "Recent Alerts",
    "dashboard.shelterStatus": "Shelter Status",
    "dashboard.noActiveAlerts": "No active alerts",
    "dashboard.occupancy": "Occupancy",
    "shelter.add": "Add Shelter",
    "shelter.description": "Monitor capacity and resources of evacuation centers.",
    "shelter.active": "Active Shelters",
    "shelter.totalEvacuees": "Total Evacuees",
    "shelter.notFound": "No shelters found.",
    "volunteer.description": "Track, deploy, and communicate with emergency response volunteers.",
    "volunteer.dispatch": "Dispatch Volunteer",
    "volunteer.totalRegistered": "Total Registered",
    "volunteer.availableNow": "Available Now",
    "volunteer.notFound": "No volunteers found.",
    "volunteer.deployed": "Deployed",
    "volunteer.roster": "Volunteer Roster",
    "volunteer.name": "Name",
    "volunteer.location": "Location",
    "volunteer.skills": "Skills",
    "volunteer.status": "Status",
    "highrisk.description": "Manage monitoring profiles for elderly and vulnerable citizens.",
    "highrisk.urgent": "Urgent Attention",
    "highrisk.safe": "Safe Check-ins",
    "highrisk.registry": "Citizen Registry",
    "highrisk.info": "Citizen Info",
    "highrisk.condition": "Condition",
    "highrisk.location": "Location",
    "highrisk.lastCheckin": "Last Check-in",
    "loading": "Loading..."
  },
  "zh-TW": {
    "nav.dashboard": "儀表板",
    "nav.analytics": "分析",
    "nav.disaster": "災害監測",
    "nav.shelter": "避難所管理",
    "nav.volunteer": "志工管理",
    "nav.highrisk": "高風險市民",
    "nav.reports": "報告",
    "nav.settings": "設定",
    "nav.rescue": "救援監控",
    "theme.light": "淺色模式",
    "theme.dark": "深色模式",
    "theme.system": "系統預設",
    "dashboard.title": "市政儀表板",
    "dashboard.welcome": "市民安全與災害應變概覽",
    "shelter.add": "新增避難所",
    "shelter.description": "監控避難中心的容量與資源。",
    "shelter.active": "啟用中的避難所",
    "shelter.totalEvacuees": "總撤離人數",
    "shelter.notFound": "找不到避難所。",
    "volunteer.description": "追蹤、派遣並與緊急應變志工通訊。",
    "volunteer.dispatch": "派遣志工",
    "volunteer.totalRegistered": "總註冊人數",
    "volunteer.availableNow": "目前可用",
    "volunteer.notFound": "找不到志工。",
    "loading": "載入中..."
  },
  "ta": {
    "nav.dashboard": "Dashboard (Tamil)",
    "nav.analytics": "Analytics (Tamil)",
    "nav.disaster": "Disaster Monitoring (Tamil)",
    "nav.shelter": "Shelter Management (Tamil)",
    "nav.volunteer": "Volunteer Management (Tamil)",
    "nav.highrisk": "High Risk Citizens (Tamil)",
    "nav.reports": "Reports (Tamil)",
    "nav.settings": "Settings (Tamil)",
    "nav.rescue": "Rescue Monitoring (Tamil)",
    "theme.light": "Light Mode",
    "theme.dark": "Dark Mode",
    "theme.system": "System",
    "dashboard.title": "City Dashboard",
    "dashboard.welcome": "Citizen Safety & Disaster Response Overview",
    "shelter.add": "Add Shelter (Tamil)",
    "shelter.description": "Monitor capacity and resources of evacuation centers. (Tamil)",
    "shelter.active": "Active Shelters (Tamil)",
    "shelter.totalEvacuees": "Total Evacuees (Tamil)",
    "shelter.notFound": "No shelters found. (Tamil)",
    "volunteer.description": "Track, deploy, and communicate with emergency response volunteers. (Tamil)",
    "volunteer.dispatch": "Dispatch Volunteer (Tamil)",
    "volunteer.totalRegistered": "Total Registered (Tamil)",
    "volunteer.availableNow": "Available Now (Tamil)",
    "volunteer.notFound": "No volunteers found. (Tamil)",
    "loading": "Loading... (Tamil)"
  },
  "hi": {
    "nav.dashboard": "Dashboard (Hindi)",
    "nav.analytics": "Analytics (Hindi)",
    "nav.disaster": "Disaster Monitoring (Hindi)",
    "nav.shelter": "Shelter Management (Hindi)",
    "nav.volunteer": "Volunteer Management (Hindi)",
    "nav.highrisk": "High Risk Citizens (Hindi)",
    "nav.reports": "Reports (Hindi)",
    "nav.settings": "Settings (Hindi)",
    "nav.rescue": "Rescue Monitoring (Hindi)",
    "theme.light": "Light Mode",
    "theme.dark": "Dark Mode",
    "theme.system": "System",
    "dashboard.title": "City Dashboard",
    "dashboard.welcome": "Citizen Safety & Disaster Response Overview",
    "shelter.add": "Add Shelter (Hindi)",
    "shelter.description": "Monitor capacity and resources of evacuation centers. (Hindi)",
    "shelter.active": "Active Shelters (Hindi)",
    "shelter.totalEvacuees": "Total Evacuees (Hindi)",
    "shelter.notFound": "No shelters found. (Hindi)",
    "volunteer.description": "Track, deploy, and communicate with emergency response volunteers. (Hindi)",
    "volunteer.dispatch": "Dispatch Volunteer (Hindi)",
    "volunteer.totalRegistered": "Total Registered (Hindi)",
    "volunteer.availableNow": "Available Now (Hindi)",
    "volunteer.notFound": "No volunteers found. (Hindi)",
    "loading": "Loading... (Hindi)"
  },
  "nan-TW": {
    "nav.dashboard": "儀表板 (Hokkien)",
    "nav.analytics": "分析 (Hokkien)",
    "nav.disaster": "災害監測 (Hokkien)",
    "nav.shelter": "避難所 (Hokkien)",
    "nav.volunteer": "志工 (Hokkien)",
    "nav.highrisk": "高風險市民 (Hokkien)",
    "nav.reports": "報告 (Hokkien)",
    "nav.settings": "設定 (Hokkien)",
    "nav.rescue": "救援監控 (Hokkien)",
    "theme.light": "淺色模式",
    "theme.dark": "深色模式",
    "theme.system": "系統預設",
    "dashboard.title": "市政儀表板",
    "dashboard.welcome": "市民安全與災害應變概覽",
    "shelter.add": "新增避難所 (Hokkien)",
    "shelter.description": "監控避難中心的容量與資源。 (Hokkien)",
    "shelter.active": "啟用中的避難所 (Hokkien)",
    "shelter.totalEvacuees": "總撤離人數 (Hokkien)",
    "shelter.notFound": "找不到避難所。 (Hokkien)",
    "volunteer.description": "追蹤、派遣並與緊急應變志工通訊。 (Hokkien)",
    "volunteer.dispatch": "派遣志工 (Hokkien)",
    "volunteer.totalRegistered": "總註冊人數 (Hokkien)",
    "volunteer.availableNow": "目前可用 (Hokkien)",
    "volunteer.notFound": "找不到志工。 (Hokkien)",
    "loading": "載入中... (Hokkien)"
  },
  "hak-TW": {
    "nav.dashboard": "儀表板 (Hakka)",
    "nav.analytics": "分析 (Hakka)",
    "nav.disaster": "災害監測 (Hakka)",
    "nav.shelter": "避難所 (Hakka)",
    "nav.volunteer": "志工 (Hakka)",
    "nav.highrisk": "高風險市民 (Hakka)",
    "nav.reports": "報告 (Hakka)",
    "nav.settings": "設定 (Hakka)",
    "nav.rescue": "救援監控 (Hakka)",
    "theme.light": "淺色模式",
    "theme.dark": "深色模式",
    "theme.system": "系統預設",
    "dashboard.title": "市政儀表板",
    "dashboard.welcome": "市民安全與災害應變概覽",
    "shelter.add": "新增避難所 (Hakka)",
    "shelter.description": "監控避難中心的容量與資源。 (Hakka)",
    "shelter.active": "啟用中的避難所 (Hakka)",
    "shelter.totalEvacuees": "總撤離人數 (Hakka)",
    "shelter.notFound": "找不到避難所。 (Hakka)",
    "volunteer.description": "追蹤、派遣並與緊急應變志工通訊。 (Hakka)",
    "volunteer.dispatch": "派遣志工 (Hakka)",
    "volunteer.totalRegistered": "總註冊人數 (Hakka)",
    "volunteer.availableNow": "目前可用 (Hakka)",
    "volunteer.notFound": "找不到志工。 (Hakka)",
    "loading": "載入中... (Hakka)"
  },
  "ami": {
    "nav.dashboard": "Dashboard (Amis)",
    "nav.analytics": "Analytics (Amis)",
    "nav.disaster": "Disaster (Amis)",
    "nav.shelter": "Shelter (Amis)",
    "nav.volunteer": "Volunteer (Amis)",
    "nav.highrisk": "High Risk (Amis)",
    "nav.reports": "Reports (Amis)",
    "nav.settings": "Settings (Amis)",
    "nav.rescue": "Rescue (Amis)",
    "theme.light": "Light Mode",
    "theme.dark": "Dark Mode",
    "theme.system": "System",
    "dashboard.title": "City Dashboard",
    "dashboard.welcome": "Citizen Safety & Disaster Response Overview",
    "shelter.add": "Add Shelter (Amis)",
    "shelter.description": "Monitor capacity and resources of evacuation centers. (Amis)",
    "shelter.active": "Active Shelters (Amis)",
    "shelter.totalEvacuees": "Total Evacuees (Amis)",
    "shelter.notFound": "No shelters found. (Amis)",
    "volunteer.description": "Track, deploy, and communicate with emergency response volunteers. (Amis)",
    "volunteer.dispatch": "Dispatch Volunteer (Amis)",
    "volunteer.totalRegistered": "Total Registered (Amis)",
    "volunteer.availableNow": "Available Now (Amis)",
    "volunteer.notFound": "No volunteers found. (Amis)",
    "loading": "Loading... (Amis)"
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("app-language") as Language;
    if (savedLang && ["en", "zh-TW", "ta", "hi", "nan-TW", "hak-TW", "ami"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };



  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const ThemeLanguageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </NextThemesProvider>
  );
};
