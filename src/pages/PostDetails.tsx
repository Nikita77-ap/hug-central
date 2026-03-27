import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import EntryCard from "@/components/EntryCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<any>(null);
  const [comments, setComments] = useState<Tables<"comments">[]>([]);
  const [reactions, setReactions] = useState<Tables<"reactions">[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) return;
    const [e, c, r] = await Promise.all([
      supabase.from("entries").select("*").eq("id", id).single(),
      supabase.from("comments").select("*").eq("entry_id", id),
      supabase.from("reactions").select("*").eq("entry_id", id),
    ]);
    if (e.data) setEntry(e.data);
    if (c.data) setComments(c.data);
    if (r.data) setReactions(r.data);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <p className="text-center py-10 text-muted-foreground animate-pulse-warm">Loading post...</p>;
  if (!entry) return <p className="text-center py-10 text-muted-foreground">Post not found 💭</p>;

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>
      <EntryCard entry={entry} comments={comments} reactions={reactions} onRefresh={fetchData} />
    </div>
  );
};

export default PostDetails;
