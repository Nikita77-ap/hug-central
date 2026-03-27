import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Heart, Shield, Star } from "lucide-react";

const AnonymousProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
    } else {
      // Profile doesn't exist yet (existing user before migration)
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          anonymous_name: "Kind" + "Soul" + Math.floor(Math.random() * 99 + 1),
        })
        .select()
        .single();
      if (newProfile) setProfile(newProfile);
    }
  };

  if (!profile) return null;

  // Generate avatar from seed - simple color-based avatar
  const avatarHue = parseInt(profile.avatar_seed?.replace(/\D/g, "") || "0") % 360;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-lg border border-border p-5"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground"
          style={{ backgroundColor: `hsl(${avatarHue}, 60%, 55%)` }}
        >
          {profile.anonymous_name?.charAt(0) || "?"}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-foreground">
            {profile.anonymous_name}
          </h3>
          {profile.mood_status && (
            <p className="text-sm text-muted-foreground">{profile.mood_status}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-warm-glow" />
          <span>{profile.support_score} support</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Heart className="w-4 h-4 text-hug-pink" />
          <span>{profile.hugs_received} hugs</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-calm-green" />
          <span>{profile.hugs_sent} sent</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AnonymousProfile;
