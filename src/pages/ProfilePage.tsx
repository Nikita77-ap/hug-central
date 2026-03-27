import AnonymousProfile from "@/components/AnonymousProfile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [moodStatus, setMoodStatus] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data);
        setBio(data.bio || "");
        setMoodStatus(data.mood_status || "");
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ bio, mood_status: moodStatus }).eq("id", user.id);
    if (error) { toast.error("Couldn't update profile"); return; }
    toast.success("Profile updated! 🌟");
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-display font-bold text-foreground">Anonymous Profile</h1>
      <p className="text-muted-foreground text-sm">Your identity is always private 🔒</p>
      <AnonymousProfile />

      {profile && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">Edit Profile</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit"}
            </Button>
          </div>
          {editing && (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Mood Status</label>
                <input
                  value={moodStatus}
                  onChange={(e) => setMoodStatus(e.target.value)}
                  placeholder="How are you feeling?"
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Bio (anonymous)</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people something about you..."
                  className="bg-background min-h-[80px]"
                />
              </div>
              <Button onClick={handleSave} className="w-full">Save Changes</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
