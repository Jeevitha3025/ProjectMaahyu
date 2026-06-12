import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: string[];
}

const SecurityPolicy = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["intro"])
  );

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const sections: Section[] = [
    {
      id: "intro",
      title: "PRIVACY POLICY & SECURITY AGREEMENT",
      content: [
        "Effective Date: June 12, 2026",
        "Last Updated: June 12, 2026",
        "Version: 1.0",
        "",
        "Maahyu (\"Platform\", \"we\", \"us\", \"our\") is committed to protecting the privacy, security, and confidentiality of maternal and mental health information.",
      ],
    },
    {
      id: "1",
      title: "1. SCOPE AND APPLICABILITY",
      content: [
        "This policy covers all personally identifiable information (PII) collected through:",
        "• Maahyu web platform",
        "• Maahyu mobile applications",
        "• Third-party integrations (Google Firebase, Google Gemini API)",
      ],
    },
    {
      id: "2",
      title: "2. DATA COLLECTION",
      content: [
        "Registration Data:",
        "• Full Name, Email, Phone, Date of Birth",
        "• Location, Emergency Contact",
        "",
        "Health Data:",
        "• Daily Mood Logs with diary entries",
        "• Mental health screening assessments (PHQ-9, EPDS, GAD-7)",
        "• Chatbot conversation history",
        "• Community participation (optional anonymous)",
      ],
    },
    {
      id: "3",
      title: "3. DATA SECURITY MEASURES",
      content: [
        "Encryption:",
        "• TLS 1.2+ for all data transmission",
        "• AES-256 encryption at rest (Google Firebase)",
        "",
        "Access Control:",
        "• Firebase Authentication with secure passwords",
        "• Users can only access their own data",
        "• Role-based admin access",
      ],
    },
    {
      id: "4",
      title: "4. HEALTH DATA PROTECTION",
      content: [
        "Special Protections:",
        "• Mental health data encrypted individually",
        "• Crisis indicators flagged for emergency response",
        "• NO use for marketing or advertising",
        "• NO sale to third parties",
        "• NO sharing with insurance or employers",
      ],
    },
    {
      id: "5",
      title: "5. EMERGENCY PROTOCOLS",
      content: [
        "Crisis Detection:",
        "• Automated keyword detection for crisis language",
        "• PHQ-9 & EPDS score thresholds trigger alerts",
        "• Immediate crisis resource display",
        "",
        "Emergency Contact:",
        "• Notified only if user consents during onboarding",
        "• Real-time notification within 2 minutes",
        "• Alert sent WITHOUT detailed health info",
      ],
    },
    {
      id: "6",
      title: "6. DATA RETENTION & DELETION",
      content: [
        "Retention:",
        "• Active accounts: Data retained indefinitely",
        "• After deletion: Permanently deleted within 30 days",
        "• Backups: Deleted within 30 days",
        "",
        "User-Initiated Deletion:",
        "• Request deletion via Settings > Delete Account",
        "• 48-hour grace period before permanent deletion",
        "• No recovery possible after deletion",
      ],
    },
    {
      id: "7",
      title: "7. YOUR DATA RIGHTS",
      content: [
        "Right to Access:",
        "• View all your data in the app",
        "• Download in JSON format within 48 hours",
        "",
        "Right to Rectification:",
        "• Edit any information in your profile",
        "",
        "Right to Erasure:",
        "• Request complete data deletion anytime",
        "",
        "Right to Withdraw Consent:",
        "• Opt-out of research data sharing",
        "• Disable emergency contact notifications",
      ],
    },
    {
      id: "8",
      title: "8. THIRD-PARTY SERVICES",
      content: [
        "Google Firebase:",
        "• Database, authentication, real-time messaging",
        "• Located in Asia-South1 (India)",
        "• Data encrypted by Google Cloud",
        "",
        "Google Gemini API:",
        "• Powers SHEro AI chatbot",
        "• Chat messages sent (NOT health assessments)",
        "• Do NOT share medical records in chat",
      ],
    },
    {
      id: "9",
      title: "9. SECURITY INCIDENT & BREACH RESPONSE",
      content: [
        "Detection & Response:",
        "• Automated 24/7 security monitoring",
        "• Breach assessment within 1 hour",
        "• System containment within 2 hours",
        "",
        "User Notification:",
        "• Breach notification within 72 hours",
        "• Details of data exposure",
        "• Steps to protect yourself",
      ],
    },
    {
      id: "10",
      title: "10. REGULATORY COMPLIANCE",
      content: [
        "India Compliance:",
        "• Digital Personal Data Protection Act, 2023",
        "• Information Technology Act, 2000",
        "• Healthcare data confidentiality standards",
        "",
        "International Standards:",
        "• GDPR compliant for EU users",
        "• HIPAA principles applied to health data",
        "• ISO 27001 information security standards",
      ],
    },
    {
      id: "11",
      title: "11. IMPORTANT DISCLAIMERS",
      content: [
        "NOT Medical Service:",
        "• Maahyu is NOT a substitute for professional mental health care",
        "• Always consult licensed psychiatrists or therapists",
        "• In emergencies, contact hospitals or crisis helplines immediately",
        "",
        "Platform As-Is:",
        "• Provided without warranties",
        "• Not liable for data loss, service interruptions, or incorrect diagnosis",
        "• Crisis detection system is automated (not 100% accurate)",
      ],
    },
    {
      id: "12",
      title: "12. CONTACT & POLICY UPDATES",
      content: [
        "Privacy Officer:",
        "• Email: privacy@maahyu.health",
        "• Response Time: Within 48 hours",
        "",
        "Data Protection Officer:",
        "• Email: dpo@maahyu.health",
        "",
        "Policy Updates:",
        "• Changes notified via in-app notification + email",
        "• Material changes: 30-day notice before implementation",
        "• Continued use = acceptance of new terms",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-rose-900 mb-4">
            Privacy & Security Policy
          </h1>
          <p className="text-rose-700 text-lg mb-2">
            Comprehensive Data Protection Agreement
          </p>
          <p className="text-rose-600 text-sm">
            Effective: June 12, 2026 | Version 1.0
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow border border-rose-100 overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-rose-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-rose-900 text-left">
                  {section.title}
                </h2>
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="w-5 h-5 text-rose-600 flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-rose-600 flex-shrink-0 ml-4" />
                )}
              </button>

              {/* Section Content */}
              {expandedSections.has(section.id) && (
                <div className="px-6 pb-6 border-t border-rose-100">
                  <div className="space-y-3 text-rose-800">
                    {section.content.map((line, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-rose-100 rounded-lg p-6 mt-12 text-rose-900">
          <h3 className="font-bold mb-3">Questions?</h3>
          <p className="mb-2">
            <strong>Privacy Officer:</strong> privacy@maahyu.health
          </p>
          <p className="mb-2">
            <strong>Data Protection Officer:</strong> dpo@maahyu.health
          </p>
          <p className="text-sm mt-4 italic">
            Last Updated: June 12, 2026 | Next Review: June 12, 2027
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityPolicy;