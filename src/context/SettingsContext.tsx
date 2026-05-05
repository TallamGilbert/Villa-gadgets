import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Settings {
  business_name: string;
  whatsapp_number: string;
}

const defaultSettings: Settings = {
  business_name: "Villa Gadgets",
  whatsapp_number: "254700000000",
};

const SettingsContext = createContext<Settings>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    supabase
      .from("settings")
      .select("business_name, whatsapp_number")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
