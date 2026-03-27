import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from "date-fns";

const moods = [
  { key: "happy", emoji: "😊", label: "Happy", color: "bg-warm-glow/30" },
  { key: "sad", emoji: "😢", label: "Sad", color: "bg-soft-blue/30" },
  { key: "angry", emoji: "😤", label: "Angry", color: "bg-destructive/30" },
  { key: "tired", emoji: "😴", label: "Tired", color: "bg-muted" },
  { key: "anxious", emoji: "😰", label: "Anxious", color: "bg-accent/30" },
];

const MoodTracker = () => {
  const { user } = useAuth();
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [weekMoods, setWeekMoods] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchMoods();
  }, [user]);

  const fetchMoods = async () => {
    if (!user) return;
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const { data } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", weekStart.toISOString())
      .order("created_at", { ascending: false });

    if (data) {
      const moodMap: Record<string, string> = {};
      data.forEach((entry: any) => {
        const day = format(new Date(entry.created_at), "yyyy-MM-dd");
        if (!moodMap[day]) moodMap[day] = entry.mood;
      });
      setWeekMoods(moodMap);

      const today = format(new Date(), "yyyy-MM-dd");
      if (moodMap[today]) setTodayMood(moodMap[today]);
    }
  };

  const logMood = async (mood: string) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await supabase.from("mood_entries").insert({
        user_id: user.id,
        mood,
      });
      setTodayMood(mood);
      await fetchMoods();
      toast.success("Mood logged! Keep tracking 📊");
    } catch {
      toast.error("Couldn't log mood");
    } finally {
      setSubmitting(false);
    }
  };

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const moodEmojiMap: Record<string, string> = {};
  moods.forEach((m) => (moodEmojiMap[m.key] = m.emoji));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-lg border border-border p-5 space-y-4"
    >
      <h3 className="font-display font-semibold text-foreground">
        How are you feeling today?
      </h3>

      {todayMood ? (
        <div className="text-center py-3">
          <span className="text-4xl">{moodEmojiMap[todayMood] || "💭"}</span>
          <p className="text-sm text-muted-foreground mt-2">
            You're feeling <strong>{todayMood}</strong> today
          </p>
        </div>
      ) : (
        <div className="flex justify-center gap-3">
          {moods.map((m) => (
            <motion.button
              key={m.key}
              whileTap={{ scale: 1.2 }}
              onClick={() => logMood(m.key)}
              disabled={submitting}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all hover:bg-secondary ${m.color}`}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Weekly mini chart */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2 font-medium">This week</p>
        <div className="flex justify-between">
          {weekDays.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayMood = weekMoods[key];
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">
                  {format(day, "EEE")}
                </span>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm">
                  {dayMood ? moodEmojiMap[dayMood] || "💭" : "·"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MoodTracker;
