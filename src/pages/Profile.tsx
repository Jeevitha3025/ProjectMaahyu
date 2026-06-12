import MaaMindChatbot from "@/components/chat/MaaMindChatbot";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    Check,
    Heart,
    Pencil,
    Phone,
    User,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const stages = [
  { value: "antenatal",    label: "Expecting",    description: "I'm currently pregnant", icon: "🤰" },
  { value: "postnatal",    label: "New Mom",       description: "I recently gave birth",  icon: "👶" },
  { value: "toddler-care", label: "Toddler Mom",   description: "I have a toddler",       icon: "🧒" },
];

// ─── Avatar options ──────────────────────────────────────────────────────────
const avatars = [
  "🌸", "🌺", "🌼", "🌻", "🦋", "🌙", "⭐", "🌈",
  "🍀", "🌿", "💐", "🌷", "🧸", "🎀", "💝", "🫶",
];

const calculateAge = (dobStr: string): number => {
  if (!dobStr) return 0;
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

const Err = ({ msg }: { msg: string }) => (
  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
    <AlertCircle className="w-3 h-3" />{msg}
  </p>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, userProfile, saveOnboardingProfile } = useAuth();

  const [isEditing,  setIsEditing]  = useState(false);
  const [isSaving,   setIsSaving]   = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name:             "",
    phone:            "",
    dob:              "",
    stage:            "",
    emergencyContact: "",
    emergencyPhone:   "",
    avatar:           "🌸",
  });

  // Load existing profile on mount
  useEffect(() => {
    if (userProfile) {
      setForm({
        name:             userProfile.name             || "",
        phone:            userProfile.phone            || "",
        dob:              userProfile.dob              || "",
        stage:            userProfile.stage            || "",
        emergencyContact: userProfile.emergencyContact || "",
        emergencyPhone:   userProfile.emergencyPhone   || "",
        avatar:           userProfile.avatar           || "🌸",
      });
    }
  }, [userProfile]);

  const set = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.emergencyContact.trim()) e.emergencyContact = "Contact name is required";
    if (!form.emergencyPhone.trim())   e.emergencyPhone   = "Contact phone is required";
    if (!form.stage)                   e.stage            = "Please select your stage";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      await saveOnboardingProfile({
        phone:            form.phone,
        dob:              form.dob,
        stage:            form.stage,
        emergencyContact: form.emergencyContact,
        emergencyPhone:   form.emergencyPhone,
        avatar:           form.avatar,
        screeningTags:    userProfile?.screeningTags || [],
      });
      toast.success("Profile updated! 🌸");
      setIsEditing(false);
    } catch {
      toast.error("Couldn't save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original profile
    if (userProfile) {
      setForm({
        name:             userProfile.name             || "",
        phone:            userProfile.phone            || "",
        dob:              userProfile.dob              || "",
        stage:            userProfile.stage            || "",
        emergencyContact: userProfile.emergencyContact || "",
        emergencyPhone:   userProfile.emergencyPhone   || "",
        avatar:           userProfile.avatar           || "🌸",
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const age       = form.dob ? calculateAge(form.dob) : null;
  const stageMeta = stages.find(s => s.value === form.stage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* ─── Avatar + name header ─────────────────────────────────────── */}
        <div className="card-elevated p-8 mb-6 text-center relative">

          {/* Edit / Save buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size="sm"
                  className="rounded-full gap-1"
                >
                  <Check className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                title="Edit profile"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div
              className={`w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-5xl mx-auto
                ${isEditing ? "cursor-pointer hover:bg-primary/20 transition-colors" : ""}`}
              onClick={() => isEditing && setShowAvatar(true)}
            >
              {form.avatar}
            </div>
            {isEditing && (
              <button
                onClick={() => setShowAvatar(true)}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white
                           flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Avatar picker */}
          {showAvatar && (
            <div className="mb-4 p-4 rounded-2xl bg-muted/50 border border-border">
              <p className="text-sm font-medium mb-3">Choose your avatar</p>
              <div className="grid grid-cols-8 gap-2">
                {avatars.map(a => (
                  <button
                    key={a}
                    onClick={() => { set("avatar", a); setShowAvatar(false); }}
                    className={`text-2xl p-2 rounded-xl transition-all hover:scale-110
                      ${form.avatar === a ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAvatar(false)}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          )}

          {/* Name */}
          <h1 className="font-display text-2xl font-bold mb-1">
            {form.name || user?.displayName || "Mama"}
          </h1>
          <p className="text-muted-foreground text-sm">{user?.email}</p>

          {/* Stage + age badges */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            {stageMeta && (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {stageMeta.icon} {stageMeta.label}
              </span>
            )}
            {age !== null && (
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                {age} years old
              </span>
            )}
          </div>
        </div>

        {/* ─── Details sections ─────────────────────────────────────────── */}

        {/* Personal details */}
        <div className="card-elevated p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold">Personal Details</h2>
          </div>

          <div className="space-y-4">
            {/* Phone */}
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                Phone number
              </Label>
              {isEditing ? (
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              ) : (
                <p className="mt-1 font-medium">
                  {form.phone || <span className="text-muted-foreground italic">Not provided</span>}
                </p>
              )}
            </div>

            {/* DOB */}
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                Date of birth
              </Label>
              {isEditing ? (
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={form.dob}
                    onChange={e => set("dob", e.target.value)}
                    className="pl-10"
                  />
                </div>
              ) : (
                <p className="mt-1 font-medium">
                  {form.dob
                    ? new Date(form.dob + "T00:00").toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric"
                      })
                    : <span className="text-muted-foreground italic">Not provided</span>}
                </p>
              )}
            </div>

            {/* Stage */}
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                Motherhood stage
              </Label>
              {isEditing ? (
                <div className="mt-2">
                  <RadioGroup
                    value={form.stage}
                    onValueChange={v => set("stage", v)}
                    className="space-y-2"
                  >
                    {stages.map(s => (
                      <div
                        key={s.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors
                          ${form.stage === s.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"}`}
                        onClick={() => set("stage", s.value)}
                      >
                        <RadioGroupItem value={s.value} id={`stage-${s.value}`} />
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
              ) : (
                <p className="mt-1 font-medium">
                  {stageMeta
                    ? `${stageMeta.icon} ${stageMeta.label} — ${stageMeta.description}`
                    : <span className="text-muted-foreground italic">Not set</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency contact */}
        <div className="card-elevated p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full bg-mood-sad/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-mood-sad" />
            </div>
            <h2 className="font-semibold">Emergency Contact</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                Contact name
              </Label>
              {isEditing ? (
                <div className="mt-1.5">
                  <Input
                    placeholder="Partner, parent, or trusted friend"
                    value={form.emergencyContact}
                    onChange={e => set("emergencyContact", e.target.value)}
                  />
                  {errors.emergencyContact && <Err msg={errors.emergencyContact} />}
                </div>
              ) : (
                <p className="mt-1 font-medium">
                  {form.emergencyContact || <span className="text-muted-foreground italic">Not set</span>}
                </p>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                Contact phone
              </Label>
              {isEditing ? (
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.emergencyPhone}
                    onChange={e => set("emergencyPhone", e.target.value)}
                    className="pl-10"
                  />
                  {errors.emergencyPhone && <Err msg={errors.emergencyPhone} />}
                </div>
              ) : (
                <p className="mt-1 font-medium">
                  {form.emergencyPhone
                    ? <a href={`tel:${form.emergencyPhone}`}
                        className="text-primary hover:underline">
                        📞 {form.emergencyPhone}
                      </a>
                    : <span className="text-muted-foreground italic">Not set</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Screening tags */}
        {userProfile?.screeningTags?.length > 0 && (
          <div className="card-elevated p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-mood-calm/20 flex items-center justify-center">
                <span className="text-sm">🌿</span>
              </div>
              <h2 className="font-semibold">Your Wellness Profile</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {userProfile.screeningTags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              These are based on your lifestyle screening during onboarding.
            </p>
          </div>
        )}

        {/* Account info */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm">🔒</span>
            </div>
            <h2 className="font-semibold">Account</h2>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email</Label>
              <p className="mt-1 font-medium">{user?.email || "—"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Member since</Label>
              <p className="mt-1 font-medium">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric"
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </div>

      </main>

      <MaaMindChatbot />
    </div>
  );
};

export default Profile;