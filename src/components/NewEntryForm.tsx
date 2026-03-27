import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const moods = [
  { key: "happy", emoji: "😊" },
  { key: "sad", emoji: "😢" },
  { key: "anxious", emoji: "😰" },
  { key: "angry", emoji: "😤" },
  { key: "hopeful", emoji: "🌟" },
  { key: "grateful", emoji: "🙏" },
  { key: "lonely", emoji: "💔" },
  { key: "confused", emoji: "🤔" },
];

const prompts = [
  "How are you feeling today? 💛",
  "What's on your heart right now?",
  "Never give up — share what's on your mind.",
  "You matter. Tell us how you're doing.",
  "Take a deep breath and let it out here...",
];

const NewEntryForm = ({ onCreated }: { onCreated: () => void }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from("entries").insert({
        user_id: user.id,
        content: content.trim(),
        mood,
      });
      setContent("");
      setMood(null);
      onCreated();
      toast.success("Your feelings have been shared. You're brave! 🌟");
    } catch {
      toast.error("Couldn't save your entry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-lg border border-border p-5 space-y-4"
    >
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="w-5 h-5" />
        <p className="font-serif text-lg italic text-muted-foreground">{prompt}</p>
      </div>

      <Textarea
        placeholder="Write your feelings here... Everything is anonymous."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-background min-h-[120px] font-serif text-base"
      />

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">How are you feeling?</p>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m.key}
              onClick={() => setMood(mood === m.key ? null : m.key)}
              className={`text-2xl p-2 rounded-lg transition-all ${
                mood === m.key
                  ? "bg-primary/20 scale-110 ring-2 ring-primary/30"
                  : "hover:bg-secondary"
              }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={!content.trim() || submitting} className="w-full">
        {submitting ? "Sharing..." : "Share Anonymously"}
      </Button>
    </motion.div>
  );
};

export default NewEntryForm;
