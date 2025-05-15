import React from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsPanelProps {
  settings: Record<string, number>;
  defaultSettings: Record<
    string,
    {
      value: number;
      description: string;
      recommended?: number;
      min?: number;
      max?: number;
    }
  >;
  isLoading: boolean;
  updateSetting: (key: string, value: number) => void;
}

export function SettingsPanel({
  settings,
  defaultSettings,
  isLoading,
  updateSetting,
}: SettingsPanelProps) {
  return (
    <div className="w-full max-w-6xl mb-6 p-6 bg-white rounded-xl border border-gray-200 shadow">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Boolean switches for colorsampling and linefilter */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="colorsampling"
            className="capitalize font-semibold text-xl flex items-center gap-2"
          >
            Color Sampling
            <Switch
              id="colorsampling"
              checked={!!settings.colorsampling}
              onCheckedChange={(val) =>
                updateSetting("colorsampling", val ? 1 : 0)
              }
              disabled={isLoading}
            />
          </Label>
          <p className="text-lg text-gray-500 mb-1">
            Enable to reduce the number of colors in the SVG (On/Off)
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="linefilter"
            className="capitalize font-semibold text-xl flex items-center gap-2"
          >
            Line Filter
            <Switch
              id="linefilter"
              checked={!!settings.linefilter}
              onCheckedChange={(val) =>
                updateSetting("linefilter", val ? 1 : 0)
              }
              disabled={isLoading}
            />
          </Label>
          <p className="text-lg text-gray-500 mb-1">
            Enable to remove tiny or messy lines for a cleaner SVG (On/Off)
          </p>
        </div>
        {/* Sliders for the rest */}
        {Object.entries(defaultSettings).map(
          ([key, { description, recommended }]) => {
            if (key === "colorsampling" || key === "linefilter") return null;
            // Get min/max from defaultSettings using nullish coalescing
            const min = defaultSettings[key].min ?? 0;
            const max = defaultSettings[key].max ?? 1;
            const step = key === "ltres" || key === "strokewidth" ? 0.1 : 1;
            return (
              <div key={key} className="flex flex-col gap-1 col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <Label
                    htmlFor={key}
                    className="capitalize font-semibold text-xl"
                  >
                    {key === "numberofcolors" ? "Number of colors" : key}
                  </Label>
                </div>
                <p className="text-lg text-gray-500 mb-3">{description}</p>
                <div className="flex items-center gap-4">
                  <Slider
                    id={key}
                    min={min}
                    max={max}
                    step={step}
                    value={[settings[key]]}
                    onValueChange={([val]) => updateSetting(key, val)}
                    disabled={isLoading}
                    className="w-full mt-2 pb-1"
                  />
                  <Input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={settings[key]}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val < min) val = min;
                      if (val > max) val = max;
                      updateSetting(key, val);
                    }}
                    disabled={isLoading}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label={`Set ${key} value`}
                  />
                  {typeof recommended !== "undefined" && (
                    <button
                      type="button"
                      className="px-3 text-nowrap py-1.5 text-base rounded bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 transition"
                      onClick={() => updateSetting(key, recommended)}
                      disabled={isLoading || settings[key] === recommended}
                      tabIndex={0}
                    >
                      Set recommended
                    </button>
                  )}
                </div>
                <div className="flex justify-between text-base mt-1 min-h-[1.5em]">
                  {typeof recommended !== "undefined" && (
                    <span
                      className={
                        settings[key] === recommended
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      {settings[key] === recommended
                        ? "✓ Recommended"
                        : "Recommended"}
                    </span>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
