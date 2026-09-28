import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Mail, Lock } from "lucide-react";
import { loginUser, clearAuthError } from "../features/auth/authSlice";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } else {
      toast.error(result.payload || "Couldn't sign in. Check your details and try again.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel rounded-2xl p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-2xl text-parchment mb-1.5">Welcome back</h1>
        <p className="text-sm text-parchment-dim mb-6">Sign in to keep your course on track.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" name="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          <Input label="Password" type="password" name="password" icon={Lock} placeholder="••••••••" value={form.password} onChange={handleChange} required />
          {error && <p className="text-sm text-signal-soft">{error}</p>}
          <Button type="submit" fullWidth loading={status === "loading"}>
            Sign in
          </Button>
        </form>

        <p className="text-sm text-parchment-dim text-center mt-6">
          New here?{" "}
          <Link to="/register" className="text-brass hover:text-brass-soft font-medium">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}