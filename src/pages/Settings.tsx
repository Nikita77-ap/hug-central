import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Bell, Moon, Sun } from "lucide-react";

const Settings = () => {
  const { signOut } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>

      <div className="space-y-2">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">Manage notification preferences</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">Configure</Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Privacy & Safety</p>
              <p className="text-xs text-muted-foreground">Your data is always anonymous</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">View</Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Appearance</p>
              <p className="text-xs text-muted-foreground">Theme and display settings</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">Change</Button>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <Button variant="destructive" onClick={signOut} className="w-full">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
