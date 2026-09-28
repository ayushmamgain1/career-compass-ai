import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Map, RefreshCw } from "lucide-react";
import { generateRoadmapForJob, generateGeneralRoadmap, clearRoadmap } from "../features/roadmap/roadmapSlice";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const dispatch = useDispatch();
  const { currentRoadmap, status, error } = useSelector((state) => state.roadmap);
  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    if (jobId) {
      dispatch(generateRoadmapForJob(jobId));
    }
    return () => {
      dispatch(clearRoadmap());
    };
  }, [dispatch, jobId]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const targetSkills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (targetSkills.length === 0) {
      toast.error("Add at least one skill you're aiming for.");
      return;
    }
    const result = await dispatch(generateGeneralRoadmap(targetSkills));
    if (!generateGeneralRoadmap.fulfilled.match(result)) {
      toast.error(result.payload || "Couldn't generate a roadmap.");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl text-parchment">Learning roadmap</h1>
        <p className="text-sm text-parchment-dim mt-1">A week-by-week plan built from your skill gaps and career goal.</p>
      </div>

      {!jobId && (
        <Card>
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 items-end">
            <Input
              label="Skills you're aiming for"
              placeholder="e.g. React, Docker, System Design"
              hint="Comma-separated"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" icon={currentRoadmap ? RefreshCw : Map} loading={status === "loading"}>
              {currentRoadmap ? "Regenerate" : "Generate roadmap"}
            </Button>
          </form>
        </Card>
      )}

      {status === "loading" && <Loader label="Charting your course…" />}

      {status === "failed" && !currentRoadmap && (
        <Card>
          <p className="text-sm text-signal-soft">{error}</p>
        </Card>
      )}

      {currentRoadmap && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg text-parchment">Your route</h2>
            <span className="text-sm text-parchment-dim font-mono">{currentRoadmap.estimatedDurationWeeks} weeks</span>
          </div>
          <ol className="relative border-l-2 border-ink-line ml-3 space-y-8">
            {currentRoadmap.roadmap?.map((item) => (
              <li key={item.week} className="ml-6">
                <span className="absolute -left-3.25 w-6 h-6 rounded-full bg-brass text-ink text-xs font-mono font-semibold flex items-center justify-center">
                  {item.week}
                </span>
                <h3 className="text-parchment font-medium">{item.topic}</h3>
                <p className="text-sm text-parchment-dim mt-1 leading-relaxed">{item.description}</p>
                {item.resources?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.resources.map((resource, i) => (
                      <li key={i} className="text-xs text-brass-dim">
                        ↳ {resource}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </Card>
      )}

      {!currentRoadmap && status === "idle" && !jobId && (
        <EmptyState icon={Map} title="No roadmap yet" description="Add a few target skills above to get a personalized, week-by-week plan." />
      )}
    </div>
  );
}