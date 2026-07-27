"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeLanguageProvider } from "@/contexts/ThemeLanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeLanguageProvider>
        {children}
      </ThemeLanguageProvider>
    </Provider>
  );
}
