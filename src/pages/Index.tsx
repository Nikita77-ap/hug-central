import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import NewEntryForm from "@/components/NewEntryForm";
import EntryCard from "@/components/EntryCard";
import EncouragementBanner from "@/components/EncouragementBanner";
import MoodTracker from "@/components/MoodTracker";
import AnonymousProfile from "@/components/AnonymousProfile";
import type { Tables } from "@/integrations/supabase/types";

const Index = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [comments, setComments] = useState<Tables<"comments">[]>([]);
  const [reactions, setReactions] = useState<Tables<"reactions">[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [entriesRes, commentsRes, reactionsRes] = await Promise.all([
      supabase.from("entries").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("comments").select("*"),
      supabase.from("reactions").select("*"),
    ]);
    if (entriesRes.data) setEntries(entriesRes.data);
    if (commentsRes.data) setComments(commentsRes.data);
    if (reactionsRes.data) setReactions(reactionsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-5">
      <EncouragementBanner />
      <AnonymousProfile />
      <MoodTracker />
      <NewEntryForm onCreated={fetchData} />
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-muted-foreground animate-pulse-warm">Loading feelings...</p>
        ) : entries.length === 0 ? (
          <p className="text-center py-10 font-serif text-lg text-muted-foreground">No entries yet. Be the first to share! 💛</p>
        ) : (
          entries.map((entry) => (
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

export default Index;
