import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { User, Mail, Lock, MailCheck } from "lucide-react";
import { registerUser, verifyOtp, resendOtp, googleLogin, clearAuthError } from "../features/auth/authSlice";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import FormError from "../components/ui/FormError";
import GoogleAuthButton from "../components/ui/GoogleAuthButton";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60; // mirrors OTP_RESEND_SECONDS on the backend

const firstName = (name) => (name || "").trim().split(" ")[0] || "there";

// Steps slide sideways: the details step lives on the left, the code step on the right
const stepMotion = (side) => ({
  initial: { opacity: 0, x: 16 * side },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 * side },
  transition: { duration: 0.18 },
});

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, resendStatus, error } = useSelector((state) => state.auth);

  const [step, setStep] = useState("details"); // "details" -> "verify"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [pendingEmail, setPendingEmail] = useState(""); // the address the code was actually sent to
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [localError, setLocalError] = useState("");
  const otpRef = useRef(null);

  const loading = status === "loading";
  const message = localError || error;

  // Don't show an error left over from another auth screen
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Tick the resend countdown down once a second
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const clearErrors = () => {
    setLocalError("");
    dispatch(clearAuthError());
  };

  // Step 1: validate, then ask the backend to email a code
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setLocalError("Password needs at least 6 characters.");
      return;
    }

    const result = await dispatch(
      registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    );
    if (registerUser.fulfilled.match(result)) {
      setPendingEmail(result.payload.email);
      setOtp("");
      setCooldown(RESEND_SECONDS);
      setStep("verify");
    }
  };

  // Step 2: the account is only created once the code checks out
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) return;
    clearErrors();

    const result = await dispatch(verifyOtp({ email: pendingEmail, otp }));
    if (verifyOtp.fulfilled.match(result)) {
      toast.success(`Email verified. Welcome aboard, ${firstName(result.payload.name)}!`);
      navigate("/dashboard", { replace: true });
    } else {
      setOtp("");
      otpRef.current?.focus();
    }
  };

  const handleResend = async () => {
    clearErrors();
    const result = await dispatch(resendOtp(pendingEmail));
    if (resendOtp.fulfilled.match(result)) {
      setOtp("");
      setCooldown(RESEND_SECONDS);
      toast.success("New code sent.");
      otpRef.current?.focus();
    }
  };

  const handleUseDifferentEmail = () => {
    clearErrors();
    setOtp("");
    setCooldown(0);
    setStep("details");
  };

  const handleGoogle = async (credential) => {
    clearErrors();
    const result = await dispatch(googleLogin(credential));
    if (googleLogin.fulfilled.match(result)) {
      const { name, isNewUser } = result.payload;
      toast.success(isNewUser ? `Account created. Welcome aboard, ${firstName(name)}!` : `Welcome back, ${firstName(name)}.`);
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel rounded-2xl p-8 w-full max-w-sm"
      >
        <AnimatePresence mode="wait" initial={false}>
          {step === "details" ? (
            <motion.div key="details" {...stepMotion(-1)}>
              <h1 className="font-display text-2xl text-parchment mb-1.5">Chart your course</h1>
              <p className="text-sm text-parchment-dim mb-6">Create an account to get your first ATS score.</p>

              <FormError message={message} />

              <GoogleAuthButton
                text="signup_with"
                onCredential={handleGoogle}
                onError={() => setLocalError("Google sign-in didn't complete. Please try again.")}
              />

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <Input label="Name" name="name" icon={User} autoComplete="name" placeholder="Ada Lovelace" value={form.name} onChange={handleChange} required />
                <Input label="Email" type="email" name="email" icon={Mail} autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                <Input label="Password" type="password" name="password" icon={Lock} autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required />
                <Input label="Confirm password" type="password" name="confirmPassword" icon={Lock} autoComplete="new-password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required />
                <Button type="submit" fullWidth loading={loading}>
                  Send verification code
                </Button>
              </form>

              <p className="text-sm text-parchment-dim text-center mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-brass hover:text-brass-soft font-medium">
                  Sign in
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div key="verify" {...stepMotion(1)}>
              <div className="w-12 h-12 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center mb-5">
                <MailCheck size={22} className="text-brass" />
              </div>
              <h1 className="font-display text-2xl text-parchment mb-1.5">Check your email</h1>
              <p className="text-sm text-parchment-dim mb-6">
                We sent a 6-digit code to <span className="text-parchment break-all">{pendingEmail}</span>. It expires in 5 minutes.
              </p>

              <FormError message={message} />

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="sr-only">
                    Verification code
                  </label>
                  <input
                    ref={otpRef}
                    id="otp"
                    name="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    placeholder="······"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
                    className="w-full bg-ink border border-ink-line rounded-lg px-4 py-3.5 text-center font-mono text-2xl tracking-[0.5em] indent-[0.5em] text-parchment placeholder:text-parchment-dim/40 focus:outline-none focus:ring-2 focus:ring-brass/50 focus:border-brass transition-colors duration-150"
                  />
                </div>
                <Button type="submit" fullWidth loading={loading} disabled={otp.length !== OTP_LENGTH}>
                  Verify and create account
                </Button>
              </form>

              <div className="flex items-center justify-between mt-5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  loading={resendStatus === "loading"}
                  className="tabular-nums"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </Button>
                <button
                  type="button"
                  onClick={handleUseDifferentEmail}
                  className="text-sm text-parchment-dim hover:text-parchment transition-colors"
                >
                  Use a different email
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}