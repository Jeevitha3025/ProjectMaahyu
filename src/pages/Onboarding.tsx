import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, User, Calendar, Heart, Phone, Mail, Lock, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import logo from "@/assets/logo.png";
import LifestyleScreening from "@/components/onboarding/LifestyleScreening";

type Stage = "antenatal" | "postnatal" | "toddler-care";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: string;
  stage: Stage | "";
  emergencyContact: string;
  emergencyPhone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  dob?: string;
  stage?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

const stages = [
  { value: "antenatal", label: "Expecting", description: "I'm currently pregnant", icon: "🤰" },
  { value: "postnatal", label: "New Mom", description: "I recently gave birth", icon: "👶" },
  { value: "toddler-care", label: "Toddler Mom", description: "I have a toddler", icon: "🧒" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    stage: "",
    emergencyContact: "",
    emergencyPhone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
const [screeningTags, setScreeningTags] = useState<string[]>([]);

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    }

    if (step === 2) {
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.stage) newErrors.stage = "Please select your stage";
    }

    if (step === 3) {
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact name is required";
      if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleNext = () => {
  if (validateStep()) {
    setStep(step + 1);
  }
};


  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="Maahyu" className="h-16 mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome to Maahyu</h1>
          <p className="text-muted-foreground">Let's set up your wellness profile</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  s < step
                    ? "bg-primary text-primary-foreground"
                    : s === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < totalSteps && (
                <div className={`flex-1 h-1 rounded-full ${s < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card-elevated p-8">
          {/* Step 1: Account Details */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-display font-bold text-xl">Create Your Account</h2>
                <p className="text-sm text-muted-foreground">Your personal details and login credentials</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="mt-1.5"
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && <p className="text-destructive text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.password && <p className="text-destructive text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-destructive text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-display font-bold text-xl">Tell Us About Yourself</h2>
                <p className="text-sm text-muted-foreground">Help us personalize your experience</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateFormData("dob", e.target.value)}
                    className="mt-1.5"
                  />
                  {errors.dob && <p className="text-destructive text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.dob}</p>}
                </div>

                <div>
                  <Label>Your Current Stage</Label>
                  <RadioGroup
                    value={formData.stage}
                    onValueChange={(value) => updateFormData("stage", value)}
                    className="mt-3 space-y-3"
                  >
                    {stages.map((stage) => (
                      <label
                        key={stage.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.stage === stage.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={stage.value} id={stage.value} />
                        <span className="text-3xl">{stage.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium">{stage.label}</p>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                  {errors.stage && <p className="text-destructive text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.stage}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Emergency Contact */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="font-display font-bold text-xl">Emergency Contact</h2>
                <p className="text-sm text-muted-foreground">Someone we can reach in case of urgent support needs</p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border mb-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Your safety matters:</strong> This contact will only be used with your consent during critical situations.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="emergencyContact">Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Partner, parent, or trusted friend"
                    value={formData.emergencyContact}
                    onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                    className="mt-1.5"
                  />
                  {errors.emergencyContact && <p className="text-destructive text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.emergencyContact}</p>}
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone Number</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.emergencyPhone}
                      onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.emergencyPhone && <p className="text-destructive text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.emergencyPhone}</p>}
                </div>
              </div>
            </div>
          )}
{step === 4 && (
  <LifestyleScreening
    onComplete={(tags) => {
      setScreeningTags(tags);

      console.log("FINAL ONBOARDING DATA", {
        ...formData,
        screeningTags: tags,
      });

      navigate("/dashboard");
    }}
  />
)}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="rounded-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 rounded-full gap-2">
              {step === totalSteps ? "Complete Setup" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/auth" className="text-primary font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
