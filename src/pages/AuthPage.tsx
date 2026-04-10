import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Car, ArrowRight, Users, MapPin, Shield, Star } from "lucide-react";

function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const label = strength <= 1 ? "Weak" : strength <= 3 ? "Medium" : "Strong";
  const color = strength <= 1 ? "bg-destructive" : strength <= 3 ? "bg-warning" : "bg-success";

  if (!password) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? color : "bg-muted"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${strength <= 1 ? "text-destructive" : strength <= 3 ? "text-warning" : "text-success"}`}>
        {label} password
      </p>
    </div>
  );
}

const socialProof = [
  { icon: Users, value: "10K+", label: "Users" },
  { icon: MapPin, value: "500+", label: "Vehicles" },
  { icon: Star, value: "4.9", label: "Rating" },
];

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Welcome back!");
      } else {
        await signUp(email, password, fullName);
        toast.success("Account created! Check your email to confirm.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(120,80,255,0.3),transparent_50%)]" />

        {/* Floating orbs */}
        {[
          { size: "h-64 w-64", pos: "top-10 -left-16", delay: 0, color: "bg-primary-foreground/5" },
          { size: "h-40 w-40", pos: "bottom-20 right-10", delay: 1, color: "bg-accent/20" },
          { size: "h-24 w-24", pos: "top-1/3 right-1/4", delay: 0.5, color: "bg-primary-foreground/10" },
          { size: "h-16 w-16", pos: "bottom-1/3 left-1/4", delay: 1.5, color: "bg-accent/15" },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${orb.size} ${orb.pos} ${orb.color} blur-xl`}
            animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="h-20 w-20 rounded-2xl bg-primary-foreground/10 backdrop-blur-xl border border-primary-foreground/20 flex items-center justify-center mx-auto mb-8"
          >
            <Car className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h2 className="text-4xl font-heading font-bold text-primary-foreground mb-4">
            RentRide
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-md mb-10">
            Premium vehicle rental platform. Book cars, bikes, and trucks with ease.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 mb-10">
            {socialProof.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + socialProof.indexOf(item) * 0.15 }}
                className="text-center"
              >
                <item.icon className="h-5 w-5 text-primary-foreground/50 mx-auto mb-1" />
                <p className="text-2xl font-heading font-bold text-primary-foreground">{item.value}</p>
                <p className="text-xs text-primary-foreground/50">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-primary-foreground/5 backdrop-blur-lg rounded-2xl p-5 border border-primary-foreground/10 max-w-sm mx-auto"
          >
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-sm text-primary-foreground/80 italic">
              "Absolutely seamless experience. Booked a car in under 2 minutes!"
            </p>
            <p className="text-xs text-primary-foreground/50 mt-2">— Rahul S., Mumbai</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-heading font-bold gradient-text">RentRide</h1>
          </div>

          <h1 className="text-3xl font-heading font-bold mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isLogin ? "Sign in to manage your rentals" : "Join our premium rental platform"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required={!isLogin}
                  className="h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-card focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-card focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-card focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {!isLogin && <PasswordStrength password={password} />}
            </div>
            <Button
              type="submit"
              className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-all duration-200 glow-sm group"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Please wait...</span>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Sign Up"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground/50">
            <div className="flex items-center gap-1.5 text-xs">
              <Shield className="h-3.5 w-3.5" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Star className="h-3.5 w-3.5" />
              <span>Trusted by 10K+</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="font-semibold text-primary">
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
