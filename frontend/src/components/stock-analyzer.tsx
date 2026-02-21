"use client";

import { useState, type FormEvent } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface StockAnalysis {
  ticker: string;
  action: "BUY" | "HOLD" | "SELL";
  confidence: number;
  reasoning: string;
  risks: string[];
  opportunities: string[];
}

const ACTION_CONFIG = {
  BUY: {
    label: "COMPRAR",
    icon: TrendingUp,
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
  },
  HOLD: {
    label: "MANTER",
    icon: Minus,
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
  },
  SELL: {
    label: "VENDER",
    icon: TrendingDown,
    className:
      "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
  },
} as const;

function confidenceColor(confidence: number): string {
  if (confidence >= 0.7) return "text-emerald-400";
  if (confidence >= 0.4) return "text-amber-400";
  return "text-red-400";
}

function ResultSkeleton() {
  return (
    <div className="mt-8 space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StockAnalyzer() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StockAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = ticker.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/v1/stocks/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Erro ao analisar: ${res.status}`);
      }

      const data: StockAnalysis = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado ao processar a análise."
      );
    } finally {
      setLoading(false);
    }
  }

  const config = result ? ACTION_CONFIG[result.action] : null;
  const ActionIcon = config?.icon;

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Digite o ticker (ex: AAPL, PETR4.SA)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="h-12 pl-10 text-base"
            disabled={loading}
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-6" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            "Analisar"
          )}
        </Button>
      </form>

      {loading && <ResultSkeleton />}

      {error && (
        <Card className="mt-8 border-red-500/30 bg-red-500/5">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && config && ActionIcon && (
        <div className="mt-8 space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {result.ticker}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={`w-fit gap-1.5 px-4 py-1.5 text-sm font-semibold ${config.className}`}
                >
                  <ActionIcon className="h-4 w-4" />
                  {config.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Confiança */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confiança</span>
                  <span className={`font-mono font-semibold ${confidenceColor(result.confidence)}`}>
                    {(result.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={result.confidence * 100} className="h-2" />
              </div>

              <Separator />

              {/* Raciocínio */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Análise
                </h3>
                <p className="leading-relaxed">{result.reasoning}</p>
              </div>

              <Separator />

              {/* Riscos e Oportunidades */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-medium text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    Riscos
                  </h3>
                  <ul className="space-y-2">
                    {result.risks.map((risk, i) => (
                      <li
                        key={i}
                        className="rounded-md border border-red-500/10 bg-red-500/5 px-3 py-2 text-sm leading-relaxed"
                      >
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                    <Lightbulb className="h-4 w-4" />
                    Oportunidades
                  </h3>
                  <ul className="space-y-2">
                    {result.opportunities.map((opp, i) => (
                      <li
                        key={i}
                        className="rounded-md border border-emerald-500/10 bg-emerald-500/5 px-3 py-2 text-sm leading-relaxed"
                      >
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
