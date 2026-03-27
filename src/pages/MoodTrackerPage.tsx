import MoodTracker from "@/components/MoodTracker";

const MoodTrackerPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-display font-bold text-foreground">Mood Tracker</h1>
      <p className="text-muted-foreground text-sm">Track how you feel every day 📊</p>
      <MoodTracker />
    </div>
  );
};

export default MoodTrackerPage;
