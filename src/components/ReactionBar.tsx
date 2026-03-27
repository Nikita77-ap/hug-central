import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const reactionTypes = [
  { key: "hug", emoji: "🤗", label: "Hug" },
  { key: "care", emoji: "❤️", label: "Care" },
  { key: "stay_strong", emoji: "💪", label: "Stay Strong" },
  { key: "praying", emoji: "🙏", label: "Praying" },
  { key: "hope", emoji: "🌟", label: "Hope" },
  { key: "listening", emoji: "👂", label: "I'm listening" },
  { key: "you_got_this", emoji: "🔥", label: "You got this" },
  { key: "better_days", emoji: "🌈", label: "Better days" },
];

interface ReactionBarProps {
  entryId: string;
  reactions: Tables<"reactions">[];
  onRefresh: () => void;
  ventMode?: boolean;
}

const ReactionBar = ({ entryId, reactions, onRefresh, ventMode }: ReactionBarProps) => {
  const { user } = useAuth();

  const handleReaction = async (type: string) => {
    if (!user) return;
    const existing = reactions.find(
      (r) => r.user_id === user.id && r.reaction_type === type
    );
    try {
      if (existing) {
        await supabase.from("reactions").delete().eq("id", existing.id);
      } else {
        await supabase.from("reactions").insert({
          entry_id: entryId,
          user_id: user.id,
          reaction_type: type,
        });
      }
      onRefresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const getCount = (type: string) =>
    reactions.filter((r) => r.reaction_type === type).length;

  const hasReacted = (type: string) =>
    reactions.some((r) => r.user_id === user?.id && r.reaction_type === type);

  const displayTypes = ventMode
    ? reactionTypes.filter((r) => ["hug", "care", "hope", "praying"].includes(r.key))
    : reactionTypes;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayTypes.map((rt) => {
        const count = getCount(rt.key);
        const active = hasReacted(rt.key);
        return (
          <motion.button
            key={rt.key}
            whileTap={{ scale: 1.2 }}
            onClick={() => handleReaction(rt.key)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all ${
              active
                ? "bg-primary/15 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
            title={rt.label}
          >
            <span className="text-sm">{rt.emoji}</span>
            {count > 0 && <span>{count}</span>}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ReactionBar;
