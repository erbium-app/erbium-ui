// @ts-nocheck
import { Label } from "../components/label";
import { Switch } from "../components/switch";
import { CheckIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";

export default function SwitchIcons() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="icons-track" startIcon={<CheckIcon />} endIcon={<XIcon />} defaultChecked />
        <Label htmlFor="icons-track">Track icons</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="icons-thumb" thumbIcon={<SunIcon />} />
        <Label htmlFor="icons-thumb">Thumb icon</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="icons-theme" startIcon={<MoonIcon />} endIcon={<SunIcon />} />
        <Label htmlFor="icons-theme">Dark mode</Label>
      </div>
    </div>
  );
}
