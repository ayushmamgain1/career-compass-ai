import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ArrowLeft, MapPin, ExternalLink, Target, Map } from "lucide-react";
import { fetchJobById } from "../features/jobs/jobSlice";
import { matchResumeToJob, clearCurrentMatch } from "../features/match/matchSlice";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ProgressGauge from "../components/ui/ProgressGauge";
import Loader from "../components/ui/Loader";

export default function JobDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob, jobStatus } = useSelector((state) => state.jobs);
  const { currentMatch, matchStatus } = useSelector((state) => state.match);
  const hasActiveResume = useSelector((state) => Boolean(state.resume.activeResume));

  useEffect(() => {
    dispatch(fetchJobById(id));
    dispatch(clearCurrentMatch());
  }, [dispatch, id]);

  const handleMatch = async () => {
    const result = await dispatch(matchResumeToJob(id));
    if (!matchResumeToJob.fulfilled.match(result)) {
      toast.error(result.payload || "Couldn't match your resume to this job.");
    }
  };

  if (jobStatus === "loading" || !currentJob) return <Loader label="Pulling up the listing…" />;

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-parchment-dim hover:text-parchment transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div>
        <h1 className="font-display text-2xl text-parchment">{currentJob.title}</h1>
        <div className="flex items-center gap-4 text-sm text-parchment-dim mt-2">
          <span>{currentJob.company || "Company not listed"}</span>
          {currentJob.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {currentJob.location}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          {currentJob.employmentType && <Badge variant="neutral">{currentJob.employmentType}</Badge>}
          {currentJob.salaryRange && <Badge variant="brass">{currentJob.salaryRange}</Badge>}
        </div>
      </div>

      <Card>
        <h2 className="font-display text-lg text-parchment mb-3">Description</h2>
        <p className="text-sm text-parchment-dim leading-relaxed whitespace-pre-line">{currentJob.description}</p>
        {currentJob.applyUrl && (
          <a href={currentJob.applyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brass hover:text-brass-soft mt-4 font-medium">
            View original listing <ExternalLink size={14} />
          </a>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-parchment">How you match up</h2>
          {!currentMatch && (
            <Button size="sm" icon={Target} onClick={handleMatch} loading={matchStatus === "loading"} disabled={!hasActiveResume}>
              Match my resume
            </Button>
          )}
        </div>

        {!hasActiveResume ? (
          <p className="text-sm text-parchment-dim">Upload a resume first to see how you match this role.</p>
        ) : currentMatch ? (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <ProgressGauge value={currentMatch.matchPercentage} label="Overall match" size={120} strokeWidth={9} />
              </div>
              <div className="flex flex-col items-center">
                <ProgressGauge value={currentMatch.readinessScore} label="Skill readiness" size={120} strokeWidth={9} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-verdigris-soft mb-2">Matching skills</h3>
                {currentMatch.matchingSkills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.matchingSkills.map((s) => (
                      <span key={s} className="text-xs px-2 py-1 rounded-full bg-verdigris/10 text-verdigris-soft border border-verdigris/30">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-parchment-dim">None found.</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-signal-soft mb-2">Missing skills</h3>
                {currentMatch.missingSkills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.missingSkills.map((s) => (
                      <span key={s} className="text-xs px-2 py-1 rounded-full bg-signal/10 text-signal-soft border border-signal/30">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-parchment-dim">None — you're covered.</p>
                )}
              </div>
            </div>

            {currentMatch.improvementSuggestions?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-brass mb-2">Suggestions</h3>
                <ul className="text-sm text-parchment-dim space-y-1.5 list-disc list-inside">
                  {currentMatch.improvementSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <Link to={`/roadmap?jobId=${id}`}>
              <Button variant="secondary" icon={Map} fullWidth>
                Build a roadmap for this role
              </Button>
            </Link>
          </div>
        ) : (
          <p className="text-sm text-parchment-dim">Run a match to see your fit for this role, side by side.</p>
        )}
      </Card>
    </div>
  );
}