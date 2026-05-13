import { Calendar, Brain, Heart, Sparkles, TrendingUp, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import MaaMindChatbot from "@/components/chat/MaaMindChatbot";

const Dashboard = () => {
  const todayMoods = ["😊", "😌", "🥰"];
  const weekProgress = 65;

  const quickActions = [
    { icon: Calendar, label: "Log Mood", path: "/mood-calendar", color: "bg-mood-happy/20 text-mood-happy" },
    { icon: Brain, label: "Screening", path: "/screening", color: "bg-mood-calm/20 text-mood-calm" },
    { icon: Heart, label: "Grandma Tips", path: "/grandma-wisdom", color: "bg-secondary/20 text-secondary" },
    
  ];

  const recentMoods = [
    { day: "Mon", mood: "😊", color: "bg-mood-happy" },
    { day: "Tue", mood: "😌", color: "bg-mood-calm" },
    { day: "Wed", mood: "😔", color: "bg-mood-sad" },
    { day: "Thu", mood: "😊", color: "bg-mood-happy" },
    { day: "Fri", mood: "🥰", color: "bg-primary" },
    { day: "Sat", mood: "😌", color: "bg-mood-calm" },
    { day: "Sun", mood: "😊", color: "bg-mood-happy" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Good Morning, Likhi! 🌸</h1>
          <p className="text-muted-foreground">How are you feeling today?</p>
        </div>

        {/* Today's Mood Quick Log */}
        <div className="card-elevated p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">How are you feeling?</h2>
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {["😊", "😌", "🥰", "😔", "😰", "😠", "😴"].map((emoji) => (
              <button
                key={emoji}
                className={`text-3xl p-3 rounded-xl transition-all hover:scale-110 ${
                  todayMoods.includes(emoji) ? "bg-primary/20 ring-2 ring-primary" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="card-glow p-5 flex flex-col items-center gap-3 text-center group"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">{action.label}</span>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mood Week Overview */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg">This Week</h2>
              <Link to="/mood-calendar" className="text-sm text-primary hover:underline flex items-center gap-1">
                View Calendar <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex justify-between gap-2 mb-6">
              {recentMoods.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.day}</span>
                  <div className={`w-10 h-10 rounded-full ${item.color}/20 flex items-center justify-center`}>
                    <span className="text-xl">{item.mood}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Weekly Wellness</span>
                  <span className="text-primary">{weekProgress}%</span>
                </div>
                <Progress value={weekProgress} className="h-2" />
              </div>
            </div>
          </div>

          {/* Maa Wrapped Teaser */}
          <div className="card-elevated p-6 bg-gradient-to-br from-primary/5 via-blush/50 to-card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg mb-2">Your Maa Wrapped</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  See your emotional journey insights - weekly patterns, improvements, and personalized recommendations.
                </p>
                <Link to="/maa-wrapped">
                  <Button variant="outline" size="sm" className="rounded-full gap-2">
                    View Insights
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Grandma Tip of the Day */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <span className="text-xl">👵</span>
              </div>
              <h2 className="font-display font-bold text-lg">Tip of the Day</h2>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm mb-3">
                <span className="font-medium">Fennel Water for Lactation:</span> Saunf ka paani has been traditionally given to nursing mothers.
              </p>
              <p className="text-xs text-muted-foreground">
                💡 Fennel contains phytoestrogens that may help support milk production.
              </p>
            </div>
            <Link to="/grandma-wisdom" className="text-sm text-primary hover:underline mt-4 inline-flex items-center gap-1">
              Explore more tips <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Upcoming Screening */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-mood-calm/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-mood-calm" />
              </div>
              <h2 className="font-display font-bold text-lg">Mental Health Check</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              It's been 2 weeks since your last screening. Regular check-ins help us support you better.
            </p>
            <Link to="/screening">
              <Button className="w-full rounded-full gap-2">
                Take Screening
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <MaaMindChatbot />
    </div>
  );
};

export default Dashboard;
