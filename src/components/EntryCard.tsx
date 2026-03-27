import { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import ReactionBar from "./ReactionBar";

const moodEmojis: Record<string, string> = {
  happy: "😊", sad: "😢", anxious: "😰", angry: "😤",
  hopeful: "🌟", grateful: "🙏", lonely: "💔", confused: "🤔", tired: "😴",
};

const postTypeLabels: Record<string, { label: string; emoji: string; color: string }> = {
  feeling: { label: "Feeling", emoji: "💛", color: "bg-warm-glow/20 text-foreground" },
  confession: { label: "Confession", emoji: "🤫", color: "bg-accent/20 text-accent" },
  need_advice: { label: "Need Advice", emoji: "🙋", color: "bg-soft-blue/20 text-soft-blue" },
  want_to_talk: { label: "Want to Talk", emoji: "💬", color: "bg-calm-green/20 text-calm-green" },
  vent: { label: "Vent Mode", emoji: "🌊", color: "bg-destructive/20 text-destructive" },
};

interface EntryCardProps {
  entry: Tables<"entries"> & { post_type?: string };
  comments: Tables<"comments">[];
  reactions: Tables<"reactions">[];
  onRefresh: () => void;
}

const EntryCard = ({ entry, comments, reactions, onRefresh }: EntryCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isOwner = entry.user_id === user?.id;
  const postType = (entry as any).post_type || "feeling";
  const isVent = postType === "vent";
  const typeInfo = postTypeLabels[postType] || postTypeLabels.feeling;

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
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}>
            {typeInfo.emoji} {typeInfo.label}
          </span>
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

      <ReactionBar
        entryId={entry.id}
        reactions={reactions}
        onRefresh={onRefresh}
        ventMode={isVent}
      />

      {!isVent && (
        <div className="pt-1">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{comments.length > 0 ? `${comments.length} comment${comments.length > 1 ? "s" : ""}` : "Advise"}</span>
            {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}

      {isVent && (
        <p className="text-xs text-muted-foreground italic">
          🌊 Vent mode — only support reactions, no comments
        </p>
      )}

      <AnimatePresence>
        {showComments && !isVent && (
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
