import { ROICalculator } from "@/components/roi-calculator"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Real-time calculations
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance text-foreground">
              NRI Property ROI Calculator
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Calculate your Indian real estate investment returns with precision. Factor in loans, management fees, and
              appreciation to make informed decisions.
            </p>
          </div>

          <ROICalculator />

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/40 max-w-3xl mx-auto">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              This calculator provides estimates for informational purposes only. Actual returns may vary based on
              market conditions, property location, rental demand, and other factors. Consult with a financial advisor
              for personalized investment advice.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
