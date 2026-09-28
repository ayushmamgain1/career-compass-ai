import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mic, Plus } from "lucide-react";
import { fetchInterviews, startInterview } from "../features/interview/interviewSlice";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { formatDate } from "../utils/format";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

export default function InterviewsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interviews, listStatus, startStatus } = useSelector((state) => state.interview);
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!role.trim()) {
      toast.error("Tell us what role you're practicing for.");
      return;
    }
    const result = await dispatch(startInterview({ role, difficulty }));
    if (startInterview.fulfilled.match(result)) {
      setModalOpen(false);
      navigate(`/interviews/${result.payload._id}`);
    } else {
      toast.error(result.payload || "Couldn't start the interview.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-parchment">Mock interviews</h1>
          <p className="text-sm text-parchment-dim mt-1">Practice role-specific questions and get scored feedback.</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Start new
        </Button>
      </div>

      {listStatus === "loading" ? (
        <Loader />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Mic}
          title="No interviews yet"
          description="Start one to practice answering role-specific questions with AI feedback."
          action={
            <Button icon={Plus} onClick={() => setModalOpen(true)}>
              Start your first interview
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <Card key={interview._id} hoverable padding="p-4 sm:p-5" onClick={() => navigate(`/interviews/${interview._id}`)} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-parchment font-medium truncate">{interview.role}</p>
                <p className="text-xs text-parchment-dim mt-0.5 capitalize">
                  {interview.difficulty} · {formatDate(interview.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {interview.status === "completed" ? (
                  <Badge variant={interview.overallScore >= 75 ? "verdigris" : interview.overallScore >= 45 ? "brass" : "signal"}>{interview.overallScore}/100</Badge>
                ) : (
                  <Badge variant="neutral">In progress</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Start a mock interview">
        <form onSubmit={handleStart} className="space-y-4">
          <Input label="Target role" placeholder="e.g. Frontend Developer" value={role} onChange={(e) => setRole(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium text-parchment-dim mb-1.5">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`text-sm capitalize py-2 rounded-lg border transition-colors ${
                    difficulty === d ? "bg-brass/10 border-brass text-brass" : "border-ink-line text-parchment-dim hover:text-parchment"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" fullWidth loading={startStatus === "loading"}>
            Begin interview
          </Button>
        </form>
      </Modal>
    </div>
  );
}