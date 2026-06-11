import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, User, Calendar, Heart,
  Phone, Mail, Lock, AlertCircle, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import LifestyleScreening from "@/components/onboarding/LifestyleScreening";
import { useAuth } from "../context/AuthContext";

type Stage = "antenatal" | "postnatal" | "toddler-care" | "";

interface FormData {
  phone: string;
  dob: string;
  stage: Stage;
  emergencyContact: string;
  emergencyPhone: string;
}

const stages = [
  { value: "antenatal",    label: "Expecting",   description: "I'm currently pregnant", icon: "🤰" },
  { value: "postnatal",    label: "New Mom",      description: "I recently gave birth",  icon: "👶" },
  { value: "toddler-care", label: "Toddler Mom",  description: "I have a toddler",       icon: "🧒" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { userProfile, saveOnboardingProfile } = useAuth();

  const [step, setStep]         = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors]     = useState<Partial<FormData>>({});
  const [form, setForm] = useState<FormData>({
    phone: "", dob: "", stage: "", emergencyContact: "", emergencyPhone: "",
  });

  const set = (k: keyof FormData, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (step === 1) {
      if (!form.dob)   e.dob   = "Date of birth is required";
      if (!form.stage) e.stage = "Please select your stage";
    }
    if (step === 2) {
      if (!form.emergencyContact.trim()) e.emergencyContact = "Contact name is required";
      if (!form.emergencyPhone.trim())   e.emergencyPhone   = "Contact phone is required";
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => { if (validate()) setStep((s) => s + 1); };
  const handleBack = () => { if (step > 1) setStep((s) => s - 1); };

  const handleComplete = async (tags: string[]) => {
    setIsSaving(true);
    try {
      await saveOnboardingProfile({
        phone:            form.phone,
        dob:              form.dob,
        stage:            form.stage,
        emergencyContact: form.emergencyContact,
        emergencyPhone:   form.emergencyPhone,
        screeningTags:    tags,
      });
      toast.success("Profile complete! Welcome to Maahyu 🌸");
      navigate("/dashboard");
    } catch {
      toast.error("Couldn't save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        <div className="text-center mb-8">
          <img src={logo} alt="Maahyu" className="h-16 mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold">
            Welcome{userProfile?.name ? `, ${userProfile.name.split(" ")[0]}` : ""}! 🌸
          </h1>
          <p className="text-muted-foreground">Let's set up your wellness profile</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 rounded-full ${s < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <div className="card-elevated p-8">

          {/* Step 1: Personal details */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-display font-bold text-xl">Your Details</h2>
                <p className="text-sm text-muted-foreground">Tell us a little about yourself</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Phone Number <span className="text-muted-foreground">(optional)</span></Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="tel" placeholder="+91 98765 43210"
                      value={form.phone} onChange={(e) => set("phone", e.target.value)} className="pl-10" />
                  </div>
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="date" value={form.dob}
                      onChange={(e) => set("dob", e.target.value)} className="pl-10" />
                  </div>
                  {errors.dob && <Err msg={errors.dob} />}
                </div>

                <div>
                  <Label className="mb-3 block">Your Stage</Label>
                  <RadioGroup value={form.stage} onValueChange={(v) => set("stage", v)} className="space-y-2">
                    {stages.map((s) => (
                      <div key={s.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          form.stage === s.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => set("stage", s.value)}>
                        <RadioGroupItem value={s.value} id={s.value} />
                        <span className="text-xl">{s.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.stage && <Err msg={errors.stage} />}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Emergency contact */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-display font-bold text-xl">Emergency Contact</h2>
                <p className="text-sm text-muted-foreground">Someone we can reach in urgent situations</p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Your safety matters:</strong>{" "}
                  This contact will only be used with your consent during critical situations.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Contact Name</Label>
                  <Input placeholder="Partner, parent, or trusted friend"
                    value={form.emergencyContact}
                    onChange={(e) => set("emergencyContact", e.target.value)} className="mt-1.5" />
                  {errors.emergencyContact && <Err msg={errors.emergencyContact} />}
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="tel" placeholder="+91 98765 43210"
                      value={form.emergencyPhone}
                      onChange={(e) => set("emergencyPhone", e.target.value)} className="pl-10" />
                  </div>
                  {errors.emergencyPhone && <Err msg={errors.emergencyPhone} />}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Lifestyle screening */}
          {step === 3 && (
            <LifestyleScreening onComplete={handleComplete} />
          )}

          {/* Navigation — hidden on step 3 (LifestyleScreening has its own button) */}
          {step < 3 && (
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="rounded-full gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              )}
              <Button onClick={handleNext} className="flex-1 rounded-full gap-2" disabled={isSaving}>
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already completed this?{" "}
          <a href="/dashboard" className="text-primary font-medium hover:underline">Go to Dashboard</a>
        </p>
      </div>
    </div>
  );
};

const Err = ({ msg }: { msg: string }) => (
  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
    <AlertCircle className="w-3 h-3" />{msg}
  </p>
);

export default Onboarding;