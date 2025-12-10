import ROICalculator from '@wiserdomenpm/roi-calculator/components/roi-calculator'

export default function RoiCalculatorPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Property ROI Calculator
      </h1>
      <ROICalculator />
    </div>
  )
}