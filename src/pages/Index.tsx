import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import NewEntryForm from "@/components/NewEntryForm";
import EntryCard from "@/components/EntryCard";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";

const encouragements = [
  "You're doing great just by being here. 🌻",
  "Never give up — brighter days are ahead! ☀️",
  "Someone out there cares about you. 💛",
  "Be kind to yourself today. 🤗",
  "Your feelings are valid. Always.",
];

const Index = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Tables<"entries">[]>([]);
  const [comments, setComments] = useState<Tables<"comments">[]>([]);
  const [reactions, setReactions] = useState<Tables<"reactions">[]>([]);
  const [loading, setLoading] = useState(true);

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

  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <p className="font-serif text-lg italic text-muted-foreground">
            {randomEncouragement}
          </p>
        </motion.div>

        <NewEntryForm onCreated={fetchData} />

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="animate-pulse-warm">Loading feelings...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="font-serif text-lg">No entries yet. Be the first to share! 💛</p>
            </div>
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
      </main>
    </div>
  );
};

export default Index;
