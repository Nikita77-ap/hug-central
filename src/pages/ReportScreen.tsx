import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const ReportScreen = () => {
  const [reportType, setReportType] = useState("post");
  const [description, setDescription] = useState("");

  const types = [
    { key: "post", label: "Report Post" },
    { key: "user", label: "Report User" },
    { key: "chat", label: "Report Chat" },
    { key: "bug", label: "Report Bug" },
  ];

  const handleSubmit = () => {
    if (!description.trim()) return;
    toast.success("Report submitted. Thank you for keeping the community safe. 💛");
    setDescription("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flag className="w-5 h-5 text-destructive" />
        <h1 className="text-2xl font-display font-bold text-foreground">Report</h1>
      </div>
      <p className="text-muted-foreground text-sm">Help us keep Hunguta safe for everyone 🛡️</p>

      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t.key}
            onClick={() => setReportType(t.key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              reportType === t.key ? "bg-destructive text-destructive-foreground border-destructive" : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4 text-warm-glow" />
          <span>All reports are reviewed by our team</span>
        </div>
        <Textarea
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-background min-h-[120px]"
        />
        <Button onClick={handleSubmit} disabled={!description.trim()} className="w-full" variant="destructive">
          Submit Report
        </Button>
      </div>
    </div>
  );
};

export default ReportScreen;
