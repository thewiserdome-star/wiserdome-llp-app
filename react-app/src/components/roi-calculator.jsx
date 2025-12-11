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

    // 5-year projection
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-teal-50 rounded-full mb-4">
            <span className="text-sm font-semibold text-teal-600">
              <span className="inline-block w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
              Real-time calculations
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">NRI Property ROI Calculator</h1>
          <p className="text-lg text-slate-600">
            Calculate your Indian real estate investment returns with precision. Factor in loans, management fees, and
            appreciation to make informed decisions.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1">
            {/* Currency Toggle */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setCurrency("INR")}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                  currency === "INR" ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                  currency === "USD" ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Property Details Card */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Home className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-slate-900">Property Details</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Purchase Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">{currencySymbol}</span>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Monthly Rent</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">{currencySymbol}</span>
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">Annual Appreciation</label>
                    <span className="text-teal-600 font-semibold">{appreciation}%</span>
                  </div>
                  <Slider
                    value={[appreciation]}
                    onValueChange={(value) => setAppreciation(value[0])}
                    min={0}
                    max={15}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Costs & Fees Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-slate-900">Costs & Fees</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">Property Management Fee</label>
                    <span className="text-teal-600 font-semibold">{managementFee}%</span>
                  </div>
                  <Slider
                    value={[managementFee]}
                    onValueChange={(value) => setManagementFee(value[0])}
                    min={0}
                    max={20}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Society Maintenance (Monthly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">{currencySymbol}</span>
                    <input
                      type="number"
                      value={maintenance}
                      onChange={(e) => setMaintenance(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Monthly Cash Flow */}
              <div className="bg-teal-500 text-white rounded-xl p-6 shadow-lg">
                <div className="text-sm font-semibold text-teal-100 mb-1">MONTHLY CASH FLOW</div>
                <div className="text-3xl font-bold mb-2">
                  {currencySymbol}
                  {calculations.monthlyNetCashFlow.toLocaleString()}
                </div>
                <div className="text-sm text-teal-100">After all expenses</div>
              </div>

              {/* Net Yield */}
              <div className="bg-slate-800 text-white rounded-xl p-6 shadow-lg">
                <div className="text-sm font-semibold text-slate-300 mb-1">NET YIELD</div>
                <div className="text-3xl font-bold mb-2">{calculations.netYield}%</div>
                <div className="text-sm text-slate-300">Annual return on property</div>
              </div>
            </div>

            {/* CAP Rate */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-600 mb-1">CAP RATE</div>
                  <div className="text-3xl font-bold text-slate-900">{calculations.capRate}%</div>
                  <div className="text-sm text-slate-500 mt-1">Operating income ratio</div>
                </div>
                <TrendingUp className="w-12 h-12 text-teal-500 opacity-20" />
              </div>
            </div>

            {/* 5-Year Projection Chart */}
            <div className="bg-slate-800 text-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-sm font-bold text-slate-300 mb-4">5-YEAR WEALTH PROJECTION</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={calculations.projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="wealth"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    dot={{ fill: "#14b8a6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">Equity Gain</div>
                  <div className="text-lg font-bold text-teal-400">
                    {currencySymbol}
                    {calculations.projectionData[4]?.equity.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">Cash Flow</div>
                  <div className="text-lg font-bold text-teal-400">
                    {currencySymbol}
                    {calculations.projectionData[4]?.cashFlow.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">Total Wealth</div>
                  <div className="text-lg font-bold text-teal-400">
                    {currencySymbol}
                    {calculations.projectionData[4]?.wealth.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">MONTHLY BREAKDOWN</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Gross Rent</span>
                  <span className="font-semibold text-teal-600">
                    +{currencySymbol}
                    {calculations.monthlyGrossRent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Management Fee</span>
                  <span className="font-semibold text-red-600">
                    -{currencySymbol}
                    {calculations.monthlyManagementFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Maintenance</span>
                  <span className="font-semibold text-red-600">
                    -{currencySymbol}
                    {maintenance.toLocaleString()}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between">
                  <span className="font-bold text-slate-900">Net Cash Flow</span>
                  <span className="font-bold text-teal-600">
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