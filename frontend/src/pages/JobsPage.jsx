import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase, MapPin } from "lucide-react";
import { fetchRecommendations, fetchAllJobs, searchJobs } from "../features/jobs/jobSlice";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";

const TABS = [
  { key: "recommended", label: "Recommended for you" },
  { key: "search", label: "Search" },
  { key: "browse", label: "Browse all" },
];

export default function JobsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState("recommended");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const { recommendations, allJobs, searchResults, recommendationsStatus, allJobsStatus, searchStatus } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  useEffect(() => {
    if (tab === "browse" && allJobs.length === 0) dispatch(fetchAllJobs());
  }, [tab, dispatch, allJobs.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    dispatch(searchJobs({ query, location }));
  };

  const jobsForTab = { recommended: recommendations, search: searchResults, browse: allJobs }[tab];
  const statusForTab = { recommended: recommendationsStatus, search: searchStatus, browse: allJobsStatus }[tab];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-parchment">Jobs</h1>
        <p className="text-sm text-parchment-dim mt-1">Find roles that match your skills, or search for something specific.</p>
      </div>

      <div className="flex gap-1 border-b border-ink-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? "border-brass text-brass" : "border-transparent text-parchment-dim hover:text-parchment"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "search" && (
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Job title, e.g. Frontend Developer" value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
          <Input placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} className="sm:w-56" />
          <Button type="submit" icon={Search} loading={searchStatus === "loading"}>
            Search
          </Button>
        </form>
      )}

      {statusForTab === "loading" ? (
        <Loader label="Charting the job market…" />
      ) : jobsForTab.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={tab === "recommended" ? "No recommendations yet" : "No jobs found"}
          description={tab === "recommended" ? "Upload a resume so we can match you against open roles." : "Try a different search term or check back later."}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {jobsForTab.map((job) => (
            <Card key={job._id} hoverable onClick={() => navigate(`/jobs/${job._id}`)}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-display text-lg text-parchment">{job.title}</h3>
                {typeof job.matchScore === "number" && <Badge variant={job.matchScore >= 60 ? "verdigris" : "brass"}>{job.matchScore}% match</Badge>}
              </div>
              <p className="text-sm text-parchment-dim mb-3">{job.company || "Company not listed"}</p>
              <div className="flex items-center gap-4 text-xs text-parchment-dim">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {job.location}
                  </span>
                )}
                {job.employmentType && <Badge variant="neutral">{job.employmentType}</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}