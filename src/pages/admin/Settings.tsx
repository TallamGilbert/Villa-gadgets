import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, Save } from "lucide-react";

interface SettingsData {
  business_name: string;
  whatsapp_number: string;
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SettingsData>({
    business_name: "",
    whatsapp_number: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data: settings, error: fetchError } = await supabase
        .from("settings")
        .select("business_name, whatsapp_number")
        .eq("id", 1)
        .single();
      if (fetchError) throw fetchError;
      if (settings) setData(settings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const { error: saveError } = await supabase
        .from("settings")
        .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });
      if (saveError) throw saveError;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-8">
      <h2 className="text-2xl font-black text-[#0A2540]">Business Settings</h2>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Business Name
          </label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={data.business_name}
            onChange={(e) =>
              setData({ ...data, business_name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            WhatsApp Number
          </label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="254700000000"
            value={data.whatsapp_number}
            onChange={(e) =>
              setData({ ...data, whatsapp_number: e.target.value })
            }
          />
          <p className="text-xs text-gray-400 mt-1">
            Include country code without +. Example: 254712345678
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
            Settings saved successfully.
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0A2540] text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
