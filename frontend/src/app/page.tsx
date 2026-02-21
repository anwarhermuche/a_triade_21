import { StockAnalyzer } from "@/components/stock-analyzer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            A Tríade 21
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Análise inteligente de ações com IA — dados estatísticos, notícias e
            recomendação em segundos.
          </p>
        </header>
        <StockAnalyzer />
      </div>
    </main>
  );
}
