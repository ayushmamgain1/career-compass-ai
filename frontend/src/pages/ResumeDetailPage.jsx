import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { fetchResumeById, analyzeResume, deleteResume } from "../features/resume/resumeSlice";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProgressGauge from "../components/ui/ProgressGauge";
import Loader from "../components/ui/Loader";
import { formatDate } from "../utils/format";

const BREAKDOWN_MAX = { keywordMatch: 30, formatting: 15, skills: 25, experience: 20, education: 10 };
const BREAKDOWN_LABELS = {
  keywordMatch: "Keyword match",
  formatting: "Formatting",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
};

export default function ResumeDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentResume, analysisStatus } = useSelector((state) => state.resume);

  useEffect(() => {
    dispatch(fetchResumeById(id));
  }, [dispatch, id]);

  const handleAnalyze = async () => {
    const result = await dispatch(analyzeResume(id));
    if (analyzeResume.fulfilled.match(result)) {
      toast.success("AI analysis complete.");
    } else {
      toast.error(result.payload || "Couldn't run AI analysis.");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteResume(id));
    if (deleteResume.fulfilled.match(result)) {
      toast.success("Resume deleted.");
      navigate("/resume");
    } else {
      toast.error(result.payload || "Couldn't delete that resume.");
    }
  };

  if (!currentResume) return <Loader label="Retrieving resume…" />;

  const { parsedData, atsScore, extractedSkills, aiAnalysis } = currentResume;
  const hasAnalysis = aiAnalysis && (aiAnalysis.strengths?.length || aiAnalysis.suggestions?.length);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/resume")} className="flex items-center gap-1.5 text-sm text-parchment-dim hover:text-parchment transition-colors">
          <ArrowLeft size={16} /> Back to resumes
        </button>
        <button onClick={handleDelete} className="flex items-center gap-1.5 text-sm text-parchment-dim hover:text-signal-soft transition-colors">
          <Trash2 size={16} /> Delete
        </button>
      </div>

      <div>
        <h1 className="font-display text-2xl text-parchment">{currentResume.originalFileName}</h1>
        <p className="text-sm text-parchment-dim mt-1">Uploaded {formatDate(currentResume.createdAt)}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center lg:col-span-1">
          <ProgressGauge value={atsScore?.total || 0} label="ATS Score" size={140} />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-display text-lg text-parchment mb-4">Score breakdown</h2>
          <div className="space-y-3">
            {Object.entries(BREAKDOWN_MAX).map(([key, max]) => {
              const value = atsScore?.breakdown?.[key] || 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-parchment-dim">{BREAKDOWN_LABELS[key]}</span>
                    <span className="font-mono text-parchment">{value}/{max}</span>
                  </div>
                  <div className="h-1.5 bg-ink rounded-full overflow-hidden">
                    <div className="h-full bg-brass rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-lg text-parchment mb-3">Extracted skills</h2>
        {extractedSkills?.length ? (
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map((skill) => (
              <span key={skill} className="text-xs font-medium px-2.5 py-1 rounded-full bg-verdigris/10 text-verdigris-soft border border-verdigris/30">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-parchment-dim">No skills were detected in this resume.</p>
        )}
      </Card>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-lg text-parchment mb-3">Parsed details</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-parchment-dim">Name</dt>
              <dd className="text-parchment">{parsedData?.name || "Not detected"}</dd>
            </div>
            <div>
              <dt className="text-parchment-dim">Email</dt>
              <dd className="text-parchment">{parsedData?.email || "Not detected"}</dd>
            </div>
            <div>
              <dt className="text-parchment-dim">Phone</dt>
              <dd className="text-parchment">{parsedData?.phone || "Not detected"}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="font-display text-lg text-parchment mb-3">Education</h2>
          {parsedData?.education?.length ? (
            <ul className="text-sm text-parchment-dim space-y-1.5 list-disc list-inside">
              {parsedData.education.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-parchment-dim">No education section detected.</p>
          )}
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-lg text-parchment mb-3">Experience</h2>
          {parsedData?.experience?.length ? (
            <ul className="text-sm text-parchment-dim space-y-1.5 list-disc list-inside">
              {parsedData.experience.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-parchment-dim">No experience section detected.</p>
          )}
        </Card>
        <Card>
          <h2 className="font-display text-lg text-parchment mb-3">Projects</h2>
          {parsedData?.projects?.length ? (
            <ul className="text-sm text-parchment-dim space-y-1.5 list-disc list-inside">
              {parsedData.projects.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-parchment-dim">No projects section detected.</p>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-parchment">AI analysis</h2>
          <Button size="sm" variant="secondary" icon={Sparkles} onClick={handleAnalyze} loading={analysisStatus === "loading"}>
            {hasAnalysis ? "Re-run analysis" : "Run AI analysis"}
          </Button>
        </div>

        {hasAnalysis ? (
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-verdigris-soft mb-2">Strengths</h3>
              <ul className="text-sm text-parchment-dim space-y-1.5 list-disc list-inside">
                {aiAnalysis.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-signal-soft mb-2">Areas to improve</h3>
              <ul className="text-sm text-parchment-dim space-y-1.5 list-disc list-inside">
                {aiAnalysis.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-2">
              <h3 className="text-sm font-medium text-brass mb-2">Suggestions</h3>
              <ul className="text-sm text-parchment-dim space-y-1.5 list-disc list-inside">
                {aiAnalysis.suggestions?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            {aiAnalysis.rewrittenPoints?.length > 0 && (
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-parchment mb-2">Rewritten bullet points</h3>
                <ul className="text-sm text-parchment-dim space-y-2">
                  {aiAnalysis.rewrittenPoints.map((point, i) => (
                    <li key={i} className="p-3 bg-ink rounded-lg border border-ink-line">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-parchment-dim">Run AI analysis to get strengths, gaps, and rewritten bullet points for this resume.</p>
        )}
      </Card>
    </div>
  );
}