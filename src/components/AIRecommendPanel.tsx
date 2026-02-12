import { useState } from "react";
import { Sparkles, User, Building2, Loader2, AlertCircle, Lightbulb, ThumbsUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AIResult {
  recommendation: string;
  reason: string;
  confidence: string;
  alternatives: { name: string; reason: string }[];
  tips: string;
}

interface AIRecommendPanelProps {
  type: "agent" | "supplier";
}

const placeholders = {
  agent: "e.g. Beach tour in Boracay for 30 people next month",
  supplier: "e.g. Need hotel for 20 guests in Palawan for 3 nights",
};

const confidenceColors = {
  high: "bg-success/20 text-success",
  medium: "bg-accent/20 text-accent",
  low: "bg-destructive/20 text-destructive",
};

const AIRecommendPanel = ({ type }: AIRecommendPanelProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);

  const getRecommendation = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-recommend", {
        body: { type, context: query },
      });

      if (error) throw error;
      setResult(data as AIResult);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "AI Recommendation Failed",
        description: e.message || "Could not get recommendation. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            AI {type === "agent" ? "Agent" : "Supplier"} Recommendation
          </h3>
          <p className="text-[10px] text-muted-foreground">Powered by Gemini AI</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          className="bg-secondary border-border text-sm"
          placeholder={placeholders[type]}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getRecommendation()}
        />
        <Button
          onClick={getRecommendation}
          disabled={loading || !query.trim()}
          className="gradient-primary text-primary-foreground border-0 gap-2 shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Thinking..." : "Recommend"}
        </Button>
      </div>

      {result && (
        <div className="space-y-3 animate-fade-in">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {type === "agent" ? <User className="w-4 h-4 text-primary" /> : <Building2 className="w-4 h-4 text-primary" />}
                <span className="text-sm font-bold text-foreground">{result.recommendation}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${confidenceColors[result.confidence as keyof typeof confidenceColors] || confidenceColors.medium}`}>
                {result.confidence} confidence
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{result.reason}</p>
          </div>

          {result.alternatives && result.alternatives.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Alternatives</p>
              <div className="space-y-1.5">
                {result.alternatives.map((alt, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-secondary/50">
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{alt.name}</span>
                    <span className="text-xs text-muted-foreground">— {alt.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.tips && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-accent/10 border border-accent/20">
              <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">{result.tips}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecommendPanel;
