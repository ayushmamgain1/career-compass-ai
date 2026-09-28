import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle2 } from "lucide-react";
import { fetchInterviewById, submitAnswer, completeInterview, clearCurrentInterview } from "../features/interview/interviewSlice";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Textarea from "../components/ui/Textarea";
import ProgressGauge from "../components/ui/ProgressGauge";
import Loader from "../components/ui/Loader";
import Badge from "../components/ui/Badge";

export default function InterviewSessionPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentInterview, answerStatus, completeStatus } = useSelector((state) => state.interview);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!currentInterview || currentInterview._id !== id) {
      dispatch(fetchInterviewById(id));
    }
    return () => {
      dispatch(clearCurrentInterview());
    };
  }, [dispatch, id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentInterview) return <Loader label="Bringing up the transcript…" />;

  const { questions, status, role, difficulty, overallScore, strengths, improvementAreas } = currentInterview;
  const currentIndex = questions.findIndex((q) => !q.answer);
  const allAnswered = currentIndex === -1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const result = await dispatch(submitAnswer({ id, questionIndex: currentIndex, answer: draft }));
    if (submitAnswer.fulfilled.match(result)) {
      setDraft("");
    } else {
      toast.error(result.payload || "Couldn't submit that answer.");
    }
  };

  const handleComplete = async () => {
    const result = await dispatch(completeInterview(id));
    if (!completeInterview.fulfilled.match(result)) {
      toast.error(result.payload || "Couldn't complete the interview.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl text-parchment">{role}</h1>
        <p className="text-sm text-parchment-dim mt-1 capitalize">{difficulty} difficulty</p>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <Card key={i} className={i > currentIndex && !allAnswered ? "opacity-40" : ""}>
            <p className="text-xs font-mono text-brass-dim mb-2">
              Question {i + 1} of {questions.length}
            </p>
            <p className="text-parchment mb-3">{q.question}</p>

            {q.answer ? (
              <div className="space-y-3">
                <div className="p-3 bg-ink rounded-lg border border-ink-line text-sm text-parchment-dim">{q.answer}</div>
                {q.feedback && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-3 bg-verdigris/5 border border-verdigris/20 rounded-lg">
                    <Badge variant="verdigris">{q.score}/10</Badge>
                    <p className="text-sm text-parchment-dim">{q.feedback}</p>
                  </motion.div>
                )}
              </div>
            ) : (
              i === currentIndex &&
              status !== "completed" && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Textarea placeholder="Type your answer…" value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} />
                  <Button type="submit" icon={Send} loading={answerStatus === "loading"} disabled={!draft.trim()}>
                    Submit answer
                  </Button>
                </form>
              )
            )}
          </Card>
        ))}
      </div>

      {allAnswered && status !== "completed" && (
        <Card className="flex flex-col items-center text-center">
          <p className="text-parchment-dim text-sm mb-4">You've answered every question. Ready for your overall score?</p>
          <Button icon={CheckCircle2} onClick={handleComplete} loading={completeStatus === "loading"}>
            Complete interview
          </Button>
        </Card>
      )}

      <AnimatePresence>
        {status === "completed" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="space-y-6">
              <div className="flex flex-col items-center">
                <ProgressGauge value={overallScore} label="Overall performance" size={140} />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-verdigris-soft mb-2">Strengths</h3>
                  <ul className="text-sm text-parchment-dim space-y-1.5 list-disc list-inside">
                    {strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-signal-soft mb-2">Focus on next</h3>
                  <ul className="text-sm text-parchment-dim space-y-1.5 list-disc list-inside">
                    {improvementAreas?.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button variant="secondary" fullWidth onClick={() => navigate("/interviews")}>
                Back to interviews
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}