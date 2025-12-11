"use client"

import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Slider } from "@radix-ui/react-slider"
import { Home, DollarSign, TrendingUp } from "lucide-react"

export function ROICalculator() {
  const [currency, setCurrency] = useState("INR")
  const [purchasePrice, setPurchasePrice] = useState(10000000)
  const [monthlyRent, setMonthlyRent] = useState(35000)
  const [appreciation, setAppreciation] = useState(5)
  const [managementFee, setManagementFee] = useState(8)
  const [maintenance, setMaintenance] = useState(5000)

  const currencySymbol = currency === "INR" ? "₹" : "$"
  const exchangeRate = currency === "USD" ? 0.012 : 1

  const calculations = useMemo(() => {
    const monthlyGrossRent = monthlyRent
    const monthlyManagementFee = (monthlyGrossRent * managementFee) / 100
    const monthlyNetCashFlow = monthlyGrossRent - monthlyManagementFee - maintenance
    const yearlyCashFlow = monthlyNetCashFlow * 12
    const capRate = (yearlyCashFlow / purchasePrice) * 100
    const netYield = capRate

    const projectionData = []
    for (let year = 1; year <= 5; year++) {
      const appreciatedValue = purchasePrice * Math.pow(1 + appreciation / 100, year)
      const equityGain = appreciatedValue - purchasePrice
      const cumulativeCashFlow = yearlyCashFlow * year
      const totalWealth = appreciatedValue + cumulativeCashFlow

      projectionData.push({
        year: `Y${year}`,
        wealth: Math.round(totalWealth * exchangeRate),
        equity: Math.round(equityGain * exchangeRate),
        cashFlow: Math.round(cumulativeCashFlow * exchangeRate),
      })
    }

    return {
      monthlyGrossRent: Math.round(monthlyGrossRent * exchangeRate),
      monthlyManagementFee: Math.round(monthlyManagementFee * exchangeRate),
      monthlyNetCashFlow: Math.round(monthlyNetCashFlow * exchangeRate),
      yearlyCashFlow: Math.round(yearlyCashFlow * exchangeRate),
      capRate: capRate.toFixed(2),
      netYield: netYield.toFixed(2),
      projectionData,
      purchasePriceDisplay: Math.round(purchasePrice * exchangeRate),
    }
  }, [purchasePrice, monthlyRent, appreciation, managementFee, maintenance, exchangeRate])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-teal-50 rounded-full mb-6">
            <span className="text-sm font-semibold text-teal-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              Real-time calculations
            </span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">NRI Property ROI Calculator</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Calculate your Indian real estate investment returns with precision. Factor in loans, management fees, and
            appreciation to make informed decisions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="flex flex-col gap-6">
            {/* Currency Toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrency("INR")}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  currency === "INR"
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  currency === "USD"
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Property Details Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <Home className="w-5 h-5 text-teal-500" />
                <h2 className="text-lg font-bold text-slate-900">Property Details</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Purchase Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">{currencySymbol}</span>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Expected Monthly Rent</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">{currencySymbol}</span>
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-slate-900">Annual Appreciation</label>
                    <span className="text-teal-600 font-bold">{appreciation}%</span>
                  </div>
                  <Slider
                    value={[appreciation]}
                    onValueChange={(value) => setAppreciation(value[0])}
                    min={0}
                    max={15}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Costs & Fees Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-5 h-5 text-teal-500" />
                <h2 className="text-lg font-bold text-slate-900">Costs & Fees</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-slate-900">Property Management Fee</label>
                    <span className="text-teal-600 font-bold">{managementFee}%</span>
                  </div>
                  <Slider
                    value={[managementFee]}
                    onValueChange={(value) => setManagementFee(value[0])}
                    min={0}
                    max={20}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Society Maintenance (Monthly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">{currencySymbol}</span>
                    <input
                      type="number"
                      value={maintenance}
                      onChange={(e) => setMaintenance(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="flex flex-col gap-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Monthly Cash Flow */}
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-xs font-bold opacity-80 uppercase tracking-wider mb-2">Monthly Cash Flow</div>
                <div className="text-3xl font-bold mb-1">
                  {currencySymbol}
                  {calculations.monthlyNetCashFlow.toLocaleString()}
                </div>
                <div className="text-sm opacity-80">After all expenses</div>
              </div>

              {/* Net Yield */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-lg">
                <div className="text-xs font-bold opacity-70 uppercase tracking-wider mb-2">Net Yield</div>
                <div className="text-3xl font-bold mb-1">{calculations.netYield}%</div>
                <div className="text-sm opacity-70">Annual return on property</div>
              </div>
            </div>

            {/* CAP Rate */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">CAP Rate</div>
                <div className="text-3xl font-bold text-slate-900">{calculations.capRate}%</div>
                <div className="text-sm text-slate-500 mt-1">Operating income ratio</div>
              </div>
              <TrendingUp className="w-12 h-12 text-teal-200" />
            </div>

            {/* 5-Year Projection Chart */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xs font-bold opacity-70 uppercase tracking-wider mb-4">5-Year Wealth Projection</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={calculations.projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(20, 184, 166, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wealth"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    dot={{ fill: "#14b8a6", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
                <div>
                  <div className="text-xs opacity-60 mb-1">Equity Gain</div>
                  <div className="text-lg font-bold text-teal-400">
                    {currencySymbol}
                    {calculations.projectionData[4]?.equity.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-60 mb-1">Cash Flow</div>
                  <div className="text-lg font-bold text-teal-400">
                    {currencySymbol}
                    {calculations.projectionData[4]?.cashFlow.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-60 mb-1">Total Wealth</div>
                  <div className="text-lg font-bold text-teal-400">
                    {currencySymbol}
                    {calculations.projectionData[4]?.wealth.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Monthly Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Gross Rent</span>
                  <span className="font-bold text-teal-600">
                    +{currencySymbol}
                    {calculations.monthlyGrossRent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Management Fee</span>
                  <span className="font-bold text-red-600">
                    -{currencySymbol}
                    {calculations.monthlyManagementFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Maintenance</span>
                  <span className="font-bold text-red-600">
                    -{currencySymbol}
                    {maintenance.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Net Cash Flow</span>
                  <span className="text-xl font-bold text-teal-600">
                    {currencySymbol}
                    {calculations.monthlyNetCashFlow.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ROICalculator
