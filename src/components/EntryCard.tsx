import { useState } from "react";
import { Heart, MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  anxious: "😰",
  angry: "😤",
  hopeful: "🌟",
  grateful: "🙏",
  lonely: "💔",
  confused: "🤔",
};

interface EntryCardProps {
  entry: Tables<"entries">;
  comments: Tables<"comments">[];
  reactions: Tables<"reactions">[];
  onRefresh: () => void;
}

const EntryCard = ({ entry, comments, reactions, onRefresh }: EntryCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const hugCount = reactions.filter((r) => r.reaction_type === "hug").length;
  const hasHugged = reactions.some((r) => r.user_id === user?.id && r.reaction_type === "hug");
  const isOwner = entry.user_id === user?.id;

  const handleHug = async () => {
    if (!user) return;
    try {
      if (hasHugged) {
        await supabase
          .from("reactions")
          .delete()
          .eq("entry_id", entry.id)
          .eq("user_id", user.id)
          .eq("reaction_type", "hug");
      } else {
        await supabase.from("reactions").insert({
          entry_id: entry.id,
          user_id: user.id,
          reaction_type: "hug",
        });
      }
      onRefresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from("comments").insert({
        entry_id: entry.id,
        user_id: user.id,
        content: commentText.trim(),
      });
      setCommentText("");
      onRefresh();
      toast.success("Your kind words were shared 💛");
    } catch {
      toast.error("Couldn't send comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border border-border p-5 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {entry.mood && (
            <span className="text-2xl">{moodEmojis[entry.mood] || "💭"}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
          </span>
          {isOwner && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
      </div>

      <p className="font-serif text-lg leading-relaxed text-foreground">{entry.content}</p>

      <div className="flex items-center gap-4 pt-2">
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={handleHug}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            hasHugged ? "text-hug-pink" : "text-muted-foreground hover:text-hug-pink"
          }`}
        >
          <Heart
            className="w-5 h-5"
            fill={hasHugged ? "hsl(var(--hug-pink))" : "none"}
          />
          <span>{hugCount > 0 ? `${hugCount} hug${hugCount > 1 ? "s" : ""}` : "Send hug"}</span>
        </motion.button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{comments.length > 0 ? `${comments.length}` : "Advise"}</span>
          {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {comments.map((c) => (
              <div key={c.id} className="bg-secondary/50 rounded-md p-3 text-sm">
                <p className="text-foreground font-serif">{c.content}</p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {c.anonymous_name} · {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </span>
              </div>
            ))}

            <div className="flex gap-2">
              <Textarea
                placeholder="Share some kind words or advice..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-background text-sm min-h-[60px]"
              />
              <Button
                size="icon"
                onClick={handleComment}
                disabled={!commentText.trim() || submitting}
                className="shrink-0 self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EntryCard;
