// app/roi-calculator/page.tsx (for Next.js App Router)
// or pages/roi-calculator.tsx (for Pages Router)
// or src/pages/RoiCalculator.tsx (for plain React)

import ROICalculator from '@wiserdomenpm/roi-calculator/components/roi-calculator'

export default function ROICalculatorPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Property ROI Calculator
        </h1>
        <ROICalculator />
      </div>
    </main>
  )
}