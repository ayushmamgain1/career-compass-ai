import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { updateProfile } from "../features/auth/authSlice";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", careerGoal: "", skillsText: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        careerGoal: user.careerGoal || "",
        skillsText: (user.currentSkills || []).join(", "),
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentSkills = form.skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    const result = await dispatch(updateProfile({ name: form.name, careerGoal: form.careerGoal, currentSkills }));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated.");
    } else {
      toast.error(result.payload || "Couldn't update your profile.");
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-parchment">Profile</h1>
        <p className="text-sm text-parchment-dim mt-1">Your career goal shapes the roadmaps we generate for you.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" value={user?.email || ""} disabled />
          <Textarea
            label="Career goal"
            placeholder="e.g. Land a mid-level backend engineering role at a product company"
            value={form.careerGoal}
            onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
            rows={3}
          />
          <Input
            label="Current skills"
            hint="Comma-separated"
            placeholder="e.g. JavaScript, React, Node.js"
            value={form.skillsText}
            onChange={(e) => setForm({ ...form, skillsText: e.target.value })}
          />
          <Button type="submit" icon={Save} loading={status === "loading"}>
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  );
}