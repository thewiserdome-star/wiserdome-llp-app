import ROICalculator from '../components/ROICalculator'

export default function RoiCalculatorPage() {
  return (
    <div className="roi-calculator-page">
      <section className="roi-hero">
        <div className="container">
          <span className="section-label">Financial Planning</span>
          <h1>ROI Calculator</h1>
          <p>Calculate your property's potential returns and plan your investment strategy with precision.</p>
        </div>
      </section>

      <section className="roi-calculator-section">
        <div className="container">
          <ROICalculator />
        </div>
      </section>
    </div>
  )
}
