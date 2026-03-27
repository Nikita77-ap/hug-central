import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Plus, Search, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const moodEmojis: Record<string, string> = {
  happy: "😊", sad: "😢", anxious: "😰", angry: "😤",
  hopeful: "🌟", grateful: "🙏", tired: "😴",
};

const PrivateDiary = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setEntries(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleCreate = async () => {
    if (!user || !content.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from("entries").insert({
        user_id: user.id,
        content: content.trim(),
        mood,
        post_type: "feeling",
      });
      setContent("");
      setMood(null);
      setShowForm(false);
      fetchEntries();
      toast.success("Diary entry saved 📝");
    } catch {
      toast.error("Couldn't save entry");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = searchTerm
    ? entries.filter((e) => e.content.toLowerCase().includes(searchTerm.toLowerCase()))
    : entries;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Private Diary</h1>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> New Entry
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search diary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card border border-border rounded-lg p-4 space-y-3">
          <Textarea placeholder="Dear diary..." value={content} onChange={(e) => setContent(e.target.value)} className="bg-background min-h-[100px] font-serif" />
          <div className="flex flex-wrap gap-2">
            {Object.entries(moodEmojis).map(([key, emoji]) => (
              <button key={key} onClick={() => setMood(mood === key ? null : key)} className={`text-xl p-1.5 rounded-lg transition-all ${mood === key ? "bg-primary/20 scale-110 ring-2 ring-primary/30" : "hover:bg-secondary"}`}>
                {emoji}
              </button>
            ))}
          </div>
          <Button onClick={handleCreate} disabled={!content.trim() || submitting} className="w-full">
            {submitting ? "Saving..." : "Save Entry"}
          </Button>
        </motion.div>
      )}

      {loading ? (
        <p className="text-center py-10 text-muted-foreground animate-pulse-warm">Loading diary...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-10 font-serif text-lg text-muted-foreground">Your diary is empty. Start writing! 📝</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(entry.created_at), "MMM d, yyyy h:mm a")}</span>
                {entry.mood && <span className="text-lg">{moodEmojis[entry.mood] || "💭"}</span>}
              </div>
              <p className="font-serif text-foreground leading-relaxed">{entry.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrivateDiary;
