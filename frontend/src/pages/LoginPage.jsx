import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Mail, Lock } from "lucide-react";
import { loginUser, googleLogin, clearAuthError } from "../features/auth/authSlice";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import FormError from "../components/ui/FormError";
import GoogleAuthButton from "../components/ui/GoogleAuthButton";

const firstName = (name) => (name || "").trim().split(" ")[0] || "there";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  // Send people back to the page that bounced them here (ProtectedRoute stores it)
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ""}` : "/dashboard";

  // Don't show an error left over from another auth screen
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const clearErrors = () => {
    setLocalError("");
    dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate(redirectTo, { replace: true });
    }
  };

  const handleGoogle = async (credential) => {
    clearErrors();
    const result = await dispatch(googleLogin(credential));
    if (googleLogin.fulfilled.match(result)) {
      if (result.payload.isNewUser) {
        toast.success(`Account created. Welcome aboard, ${firstName(result.payload.name)}!`);
      }
      navigate(redirectTo, { replace: true });
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

        <FormError message={localError || error} />

        <GoogleAuthButton
          text="signin_with"
          onCredential={handleGoogle}
          onError={() => setLocalError("Google sign-in didn't complete. Please try again.")}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" name="email" icon={Mail} autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          <Input label="Password" type="password" name="password" icon={Lock} autoComplete="current-password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
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