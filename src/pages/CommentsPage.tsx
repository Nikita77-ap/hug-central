import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

const CommentsPage = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setComments(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-display font-bold text-foreground">Recent Comments</h1>
      <p className="text-muted-foreground text-sm">Kind words shared by the community 💛</p>
      {loading ? (
        <p className="text-center py-10 text-muted-foreground animate-pulse-warm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center py-10 font-serif text-lg text-muted-foreground">No comments yet</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4">
              <p className="font-serif text-foreground">{c.content}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{c.anonymous_name}</span>
                <span>·</span>
                <span>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
