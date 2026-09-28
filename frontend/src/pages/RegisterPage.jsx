import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "motion/react";
import { User, Mail, Lock } from "lucide-react";
import { registerUser, clearAuthError } from "../features/auth/authSlice";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(clearAuthError());

    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setLocalError("Password needs at least 6 characters.");
      return;
    }

    const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    } else {
      toast.error(result.payload || "Couldn't create your account. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel rounded-2xl p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-2xl text-parchment mb-1.5">Chart your course</h1>
        <p className="text-sm text-parchment-dim mb-6">Create an account to get your first ATS score.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" name="name" icon={User} placeholder="Ada Lovelace" value={form.name} onChange={handleChange} required />
          <Input label="Email" type="email" name="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          <Input label="Password" type="password" name="password" icon={Lock} placeholder="At least 6 characters" value={form.password} onChange={handleChange} required />
          <Input label="Confirm password" type="password" name="confirmPassword" icon={Lock} placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required />
          {(localError || error) && <p className="text-sm text-signal-soft">{localError || error}</p>}
          <Button type="submit" fullWidth loading={status === "loading"}>
            Create account
          </Button>
        </form>

        <p className="text-sm text-parchment-dim text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brass hover:text-brass-soft font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}