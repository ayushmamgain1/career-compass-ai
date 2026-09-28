import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Gauge, Briefcase, Mic, Download, Upload, Tags } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";
import { fetchActiveResume } from "../features/resume/resumeSlice";
import { fetchRecommendations } from "../features/jobs/jobSlice";
import { fetchInterviews } from "../features/interview/interviewSlice";
import { reportApi } from "../api/reportApi";
import { extractErrorMessage } from "../api/axiosClient";
import CourseLine from "../components/dashboard/CourseLine";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProgressGauge from "../components/ui/ProgressGauge";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { formatDate } from "../utils/format";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { data, status } = useSelector((state) => state.dashboard);
  const { activeResume, activeStatus } = useSelector((state) => state.resume);
  const { recommendations } = useSelector((state) => state.jobs);
  const { interviews } = useSelector((state) => state.interview);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchActiveResume());
    dispatch(fetchRecommendations());
    dispatch(fetchInterviews());
  }, [dispatch]);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      await reportApi.download();
      toast.success("Report downloaded.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't generate the report."));
    } finally {
      setDownloading(false);
    }
  };

  const stages = [
    { label: "Resume", icon: FileText, completed: Boolean(activeResume) },
    { label: "Skills", icon: Tags, completed: (activeResume?.extractedSkills?.length || 0) > 0 },
    { label: "ATS Scored", icon: Gauge, completed: (activeResume?.atsScore?.total || 0) > 0 },
    { label: "Jobs Matched", icon: Briefcase, completed: recommendations.length > 0 },
    { label: "Interview Practiced", icon: Mic, completed: interviews.some((i) => i.status === "completed") },
  ];
  const firstIncompleteIndex = stages.findIndex((s) => !s.completed);
  const stagesWithCurrent = stages.map((s, i) => ({ ...s, current: i === firstIncompleteIndex }));

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (status === "loading" && !data) {
    return <Loader label="Reading the instruments…" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-parchment">
            {greeting()}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-parchment-dim mt-1">Here's where your journey stands.</p>
        </div>
        <Button icon={Download} variant="secondary" onClick={handleDownloadReport} loading={downloading} disabled={!activeResume}>
          Download report
        </Button>
      </div>

      <Card>
        <CourseLine stages={stagesWithCurrent} />
      </Card>

      {!activeResume && activeStatus !== "loading" ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No resume on file yet"
            description="Upload one to get your ATS score, extracted skills, job matches, and a personalized roadmap."
            action={
              <Link to="/resume">
                <Button icon={Upload}>Upload resume</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="flex flex-col items-center">
              <ProgressGauge value={data?.atsScore || 0} label="ATS Score" size={120} strokeWidth={9} />
            </Card>
            <Card className="flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-semibold text-parchment">{data?.totalSkills || 0}</span>
              <span className="text-sm text-parchment-dim mt-2">Skills extracted</span>
            </Card>
            <Card className="flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-semibold text-parchment">{recommendations.length}</span>
              <span className="text-sm text-parchment-dim mt-2">Job matches found</span>
            </Card>
            <Card className="flex flex-col items-center">
              <ProgressGauge value={data?.interviews?.averageScore || 0} label="Interview avg." size={120} strokeWidth={9} />
            </Card>
          </div>

          {data?.skillProgress?.length > 1 && (
            <Card>
              <h2 className="font-display text-lg text-parchment mb-4">ATS score over time</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.skillProgress.map((p) => ({ ...p, date: formatDate(p.date, "MMM D") }))}>
                    <CartesianGrid stroke="var(--color-ink-line)" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="var(--color-parchment-dim)" fontSize={12} />
                    <YAxis stroke="var(--color-parchment-dim)" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ background: "var(--color-ink-raised)", border: "1px solid var(--color-ink-line)", borderRadius: 8 }}
                      labelStyle={{ color: "var(--color-parchment)" }}
                    />
                    <Line type="monotone" dataKey="atsScore" stroke="var(--color-brass)" strokeWidth={2} dot={{ fill: "var(--color-brass)" }} name="ATS Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            <Card>
              <h2 className="font-display text-lg text-parchment mb-3">Extracted skills</h2>
              {activeResume?.extractedSkills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {activeResume.extractedSkills.map((skill) => (
                    <span key={skill} className="text-xs font-medium px-2.5 py-1 rounded-full bg-verdigris/10 text-verdigris-soft border border-verdigris/30">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-parchment-dim">No skills extracted yet.</p>
              )}
            </Card>

            <Card>
              <h2 className="font-display text-lg text-parchment mb-3">Recent interviews</h2>
              {interviews.length ? (
                <ul className="space-y-2.5">
                  {interviews.slice(0, 4).map((interview) => (
                    <li key={interview._id}>
                      <Link to={`/interviews/${interview._id}`} className="flex items-center justify-between text-sm py-1.5 hover:text-brass transition-colors">
                        <span className="text-parchment">{interview.role}</span>
                        <span className="font-mono text-parchment-dim">
                          {interview.status === "completed" ? `${interview.overallScore}/100` : "In progress"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-parchment-dim">No interview practice yet.</p>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}