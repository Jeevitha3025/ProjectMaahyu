import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, User, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const ERRORS: Record<string, string> = {
  "auth/user-not-found":         "No account found with this email.",
  "auth/wrong-password":         "Incorrect password. Please try again.",
  "auth/invalid-credential":     "Invalid email or password.",
  "auth/email-already-in-use":   "Email already registered. Sign in instead.",
  "auth/too-many-requests":      "Too many attempts. Please wait.",
  "auth/weak-password":          "Password must be at least 6 characters.",
  "auth/invalid-email":          "Please enter a valid email address.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

const Auth = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, signup } = useAuth();

  const [isLogin, setIsLogin]       = useState(true);
  const [isLoading, setIsLoading]   = useState(false);
  const [isGLoading, setIsGLoading] = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: "", form: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isLogin && !form.name.trim())         e.name     = "Name is required";
    if (!form.email.trim())                    e.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password)                        e.password = "Password is required";
    else if (form.password.length < 6)         e.password = "Min. 6 characters";
    if (!isLogin && form.password !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success("Welcome back! 🌸");
        navigate("/dashboard");
      } else {
        await signup(form.email, form.password, form.name);
        toast.success("Account created! Let's set up your profile 🌸");
        navigate("/onboarding");
      }
    } catch (err: any) {
      const msg = ERRORS[err.code] ?? "Something went wrong. Please try again.";
      toast.error(msg);
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsGLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google 🌸");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user")
        toast.error(ERRORS[err.code] ?? "Google sign-in failed.");
    } finally {
      setIsGLoading(false);
    }
  };

  const toggle = () => {
    setIsLogin((v) => !v);
    setErrors({});
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <img src={logo} alt="Maahyu" className="h-16 mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin ? "Sign in to continue your journey" : "Start your wellness journey today"}
          </p>
        </div>

        <div className="card-elevated p-8 space-y-5">

          {/* Google */}
          <Button type="button" variant="outline"
            className="w-full rounded-full flex items-center justify-center gap-3 h-11"
            onClick={handleGoogle} disabled={isGLoading || isLoading}>
            {isGLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>{isGLoading ? "Signing in…" : "Continue with Google"}</span>
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label>Your Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="text" placeholder="Priya Sharma"
                    value={form.name} onChange={set("name")} className="pl-10" />
                </div>
                {errors.name && <Err msg={errors.name} />}
              </div>
            )}

            <div>
              <Label>Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="you@email.com"
                  value={form.email} onChange={set("email")} className="pl-10" />
              </div>
              {errors.email && <Err msg={errors.email} />}
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="Min. 6 characters"
                  value={form.password} onChange={set("password")} className="pl-10" />
              </div>
              {errors.password && <Err msg={errors.password} />}
            </div>

            {!isLogin && (
              <div>
                <Label>Confirm Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="Repeat your password"
                    value={form.confirm} onChange={set("confirm")} className="pl-10" />
                </div>
                {errors.confirm && <Err msg={errors.confirm} />}
              </div>
            )}

            {errors.form && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-3 py-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />{errors.form}
              </div>
            )}

            <Button type="submit" className="w-full rounded-full h-11"
              disabled={isLoading || isGLoading}>
              {isLoading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Please wait…</>
                : <>{isLogin ? "Sign In" : "Create Account"}<ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "New to Maahyu? " : "Already have an account? "}
            <button type="button" onClick={toggle}
              className="text-primary font-semibold hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Err = ({ msg }: { msg: string }) => (
  <p className="text-destructive text-xs mt-1 flex items-center gap-1">
    <AlertCircle className="w-3 h-3" />{msg}
  </p>
);

export default Auth;