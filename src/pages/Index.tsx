import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import NewEntryForm from "@/components/NewEntryForm";
import EntryCard from "@/components/EntryCard";
import EncouragementBanner from "@/components/EncouragementBanner";
import MoodTracker from "@/components/MoodTracker";
import AnonymousProfile from "@/components/AnonymousProfile";
import type { Tables } from "@/integrations/supabase/types";

const Index = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [comments, setComments] = useState<Tables<"comments">[]>([]);
  const [reactions, setReactions] = useState<Tables<"reactions">[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchData = useCallback(async () => {
    const [entriesRes, commentsRes, reactionsRes] = await Promise.all([
      supabase.from("entries").select("*").order("created_at", { ascending: false }),
      supabase.from("comments").select("*"),
      supabase.from("reactions").select("*"),
    ]);

    if (entriesRes.data) setEntries(entriesRes.data);
    if (commentsRes.data) setComments(commentsRes.data);
    if (reactionsRes.data) setReactions(reactionsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredEntries = filter === "all"
    ? entries
    : entries.filter((e) => e.post_type === filter);

  const filters = [
    { key: "all", label: "All" },
    { key: "feeling", label: "💛 Feelings" },
    { key: "confession", label: "🤫 Confessions" },
    { key: "need_advice", label: "🙋 Advice" },
    { key: "want_to_talk", label: "💬 Talk" },
    { key: "vent", label: "🌊 Vent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <EncouragementBanner />
        <AnonymousProfile />
        <MoodTracker />
        <NewEntryForm onCreated={fetchData} />

        {/* Post type filter */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                filter === f.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="animate-pulse-warm">Loading feelings...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="font-serif text-lg">No entries yet. Be the first to share! 💛</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                comments={comments.filter((c) => c.entry_id === entry.id)}
                reactions={reactions.filter((r) => r.entry_id === entry.id)}
                onRefresh={fetchData}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
