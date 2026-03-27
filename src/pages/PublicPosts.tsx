import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import EntryCard from "@/components/EntryCard";
import type { Tables } from "@/integrations/supabase/types";

const PublicPosts = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [comments, setComments] = useState<Tables<"comments">[]>([]);
  const [reactions, setReactions] = useState<Tables<"reactions">[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchData = useCallback(async () => {
    const [e, c, r] = await Promise.all([
      supabase.from("entries").select("*").order("created_at", { ascending: false }),
      supabase.from("comments").select("*"),
      supabase.from("reactions").select("*"),
    ]);
    if (e.data) setEntries(e.data);
    if (c.data) setComments(c.data);
    if (r.data) setReactions(r.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filters = [
    { key: "all", label: "All" },
    { key: "feeling", label: "💛 Feelings" },
    { key: "confession", label: "🤫 Confessions" },
    { key: "need_advice", label: "🙋 Advice" },
    { key: "want_to_talk", label: "💬 Talk" },
    { key: "vent", label: "🌊 Vent" },
  ];

  const filtered = filter === "all" ? entries : entries.filter((e: any) => e.post_type === filter);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-display font-bold text-foreground">Public Posts</h1>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              filter === f.key ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-muted-foreground animate-pulse-warm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 font-serif text-lg text-muted-foreground">No posts found 💭</p>
        ) : (
          filtered.map((entry) => (
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
    </div>
  );
};

export default PublicPosts;
