import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";
import { UploadCloud, FileText, Trash2, ChevronRight } from "lucide-react";
import { fetchResumes, uploadResume, deleteResume } from "../features/resume/resumeSlice";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Loader from "../components/ui/Loader";
import Badge from "../components/ui/Badge";
import { formatDate } from "../utils/format";

const ACCEPTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ResumesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, listStatus, uploadStatus } = useSelector((state) => state.resume);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const validateAndUpload = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }
    dispatch(uploadResume(file)).then((result) => {
      if (uploadResume.fulfilled.match(result)) {
        toast.success("Resume uploaded and scored.");
        navigate(`/resume/${result.payload._id}`);
      } else {
        toast.error(result.payload || "Couldn't upload that resume.");
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndUpload(e.dataTransfer.files?.[0]);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await dispatch(deleteResume(id));
    if (deleteResume.fulfilled.match(result)) {
      toast.success("Resume deleted.");
    } else {
      toast.error(result.payload || "Couldn't delete that resume.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-parchment">Resume</h1>
        <p className="text-sm text-parchment-dim mt-1">Upload a resume to get an ATS score, extracted skills, and AI feedback.</p>
      </div>

      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        animate={{ borderColor: dragActive ? "var(--color-brass)" : "var(--color-ink-line)" }}
        className="panel rounded-2xl border-2 border-dashed p-10 flex flex-col items-center text-center cursor-pointer transition-colors"
      >
        <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => validateAndUpload(e.target.files?.[0])} />
        <div className="w-14 h-14 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center mb-4">
          <UploadCloud size={24} className="text-brass" />
        </div>
        {uploadStatus === "loading" ? (
          <Loader label="Parsing, scoring, extracting skills…" />
        ) : (
          <>
            <p className="text-parchment font-medium mb-1">Drop your resume here, or click to browse</p>
            <p className="text-sm text-parchment-dim">PDF or DOCX, up to 5MB</p>
          </>
        )}
      </motion.div>

      {listStatus === "loading" ? (
        <Loader />
      ) : resumes.length === 0 ? (
        <EmptyState icon={FileText} title="No resumes yet" description="Your uploaded resumes will appear here." />
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <Card
              key={resume._id}
              hoverable
              padding="p-4 sm:p-5"
              onClick={() => navigate(`/resume/${resume._id}`)}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-ink flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-brass-dim" />
                </div>
                <div className="min-w-0">
                  <p className="text-parchment font-medium truncate">{resume.originalFileName}</p>
                  <p className="text-xs text-parchment-dim mt-0.5">
                    {formatDate(resume.createdAt)} {resume.isActive && "· Active"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={resume.atsScore?.total >= 75 ? "verdigris" : resume.atsScore?.total >= 45 ? "brass" : "signal"}>
                  {resume.atsScore?.total || 0}/100
                </Badge>
                <button onClick={(e) => handleDelete(e, resume._id)} className="text-parchment-dim hover:text-signal-soft transition-colors p-1" aria-label="Delete resume">
                  <Trash2 size={16} />
                </button>
                <ChevronRight size={18} className="text-parchment-dim" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}