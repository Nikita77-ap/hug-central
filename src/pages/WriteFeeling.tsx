import NewEntryForm from "@/components/NewEntryForm";
import { useNavigate } from "react-router-dom";

const WriteFeeling = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-display font-bold text-foreground">Write Your Feelings</h1>
      <p className="text-muted-foreground font-serif italic">This is your safe space. Let it all out... 💛</p>
      <NewEntryForm onCreated={() => navigate("/")} />
    </div>
  );
};

export default WriteFeeling;
