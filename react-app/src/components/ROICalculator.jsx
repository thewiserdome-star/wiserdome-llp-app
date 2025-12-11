"use client"

import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useROIStore } from "@/lib/roi-store"
import {
  IndianRupee,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Percent,
  Wallet,
  Baseline as ChartLine,
} from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import "./ROICalculator.css"

const defaultValues = {
  purchasePrice: 10000000,
  monthlyRent: 35000,
  annualAppreciation: 5,
  managementFeePercent: 8,
  maintenanceCharges: 5000,
}

function ROICalculator() {
  const { results, calculateROI, currency, setCurrency } = useROIStore()
  const [showMobileResults, setShowMobileResults] = useState(false)

  const { register, control, setValue, getValues } = useForm({
    defaultValues,
  })

  const watchedValues = useWatch({ control })

  useEffect(() => {
    const values = getValues()
    calculateROI(values)
  }, [watchedValues, calculateROI, getValues])

  const formatCurrency = (value, compact = false) => {
    if (currency === "INR") {
      if (compact && Math.abs(value) >= 100000) {
        const lakhs = value / 100000
        return `₹${lakhs.toFixed(1)}L`
      }
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: compact ? "compact" : "standard",
    }).format(value)
  }

  const CurrencyIcon = currency === "INR" ? IndianRupee : DollarSign

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/60">
          <span className="text-sm font-medium text-muted-foreground">Currency</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrency("INR")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currency === "INR"
                  ? "text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              style={{
                backgroundColor: currency === "INR" ? "var(--color-secondary)" : undefined
              }}
            >
              ₹ INR
            </button>
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currency === "USD"
                  ? "text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              style={{
                backgroundColor: currency === "USD" ? "var(--color-secondary)" : undefined
              }}
            >
              $ USD
            </button>
          </div>
        </div>

        <Card className="p-6 border-border/60">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5" style={{ color: "var(--color-secondary)" }} />
            <h2 className="text-lg font-semibold">Property Details</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="purchasePrice" className="text-sm font-medium">
                Purchase Price
              </Label>
              <div className="relative">
                <CurrencyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="purchasePrice"
                  type="number"
                  {...register("purchasePrice", { valueAsNumber: true })}
                  className="pl-10 h-11 bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="monthlyRent" className="text-sm font-medium">
                Expected Monthly Rent
              </Label>
              <div className="relative">
                <CurrencyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="monthlyRent"
                  type="number"
                  {...register("monthlyRent", { valueAsNumber: true })}
                  className="pl-10 h-11 bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Annual Appreciation</Label>
                <span className="text-lg font-semibold" style={{ color: "var(--color-secondary)" }}>{watchedValues.annualAppreciation}%</span>
              </div>
              <Slider
                value={[watchedValues.annualAppreciation || 5]}
                onValueChange={(v) => setValue("annualAppreciation", v[0])}
                min={0}
                max={15}
                step={0.5}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border/60">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-5 h-5" style={{ color: "var(--color-secondary)" }} />
            <h2 className="text-lg font-semibold">Costs & Fees</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Property Management Fee</Label>
                <span className="text-lg font-semibold" style={{ color: "var(--color-secondary)" }}>{watchedValues.managementFeePercent}%</span>
              </div>
              <Slider
                value={[watchedValues.managementFeePercent || 8]}
                onValueChange={(v) => setValue("managementFeePercent", v[0])}
                min={0}
                max={20}
                step={0.5}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>20%</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="maintenanceCharges" className="text-sm font-medium">
                Society Maintenance (Monthly)
              </Label>
              <div className="relative">
                <CurrencyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="maintenanceCharges"
                  type="number"
                  {...register("maintenanceCharges", { valueAsNumber: true })}
                  className="pl-10 h-11 bg-white"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:self-start space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 border-0 text-white" style={{
            backgroundColor: results.isCashFlowPositive ? "var(--color-secondary)" : "var(--color-error)"
          }}>
            <div className="flex items-center gap-2 mb-2">
              {results.isCashFlowPositive ? (
                <TrendingUp className="w-4 h-4 opacity-80" />
              ) : (
                <TrendingDown className="w-4 h-4 opacity-80" />
              )}
              <span className="text-xs font-medium uppercase tracking-wider opacity-80">Monthly Cash Flow</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{formatCurrency(results.monthlyCashFlow)}</p>
            <p className="text-xs opacity-70 mt-1">After all expenses</p>
          </Card>

          <Card className="p-5 border-0 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 opacity-80" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-80">Net Yield</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{results.netYield.toFixed(2)}%</p>
            <p className="text-xs opacity-70 mt-1">Annual return on property</p>
          </Card>

          <Card className="p-5 border-border/60 bg-card col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <ChartLine className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cap Rate</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{results.capRate.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Operating income ratio</p>
          </Card>
        </div>

        <Card className="p-6 border-border/60 text-white" style={{
          backgroundImage: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)"
        }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-80">5-Year Wealth Projection</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-xs opacity-60 mb-1">Equity Gain</p>
              <p className="text-lg font-bold" style={{ color: "var(--color-secondary)" }}>{formatCurrency(results.fiveYearEquityGain, true)}</p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-1">Cash Flow</p>
              <p
                className="text-lg font-bold"
                style={{ color: results.fiveYearCashFlow >= 0 ? "var(--color-secondary)" : "var(--color-error)" }}
              >
                {formatCurrency(results.fiveYearCashFlow, true)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-1">Total Wealth</p>
              <p className="text-lg font-bold text-white">{formatCurrency(results.fiveYearTotalWealth, true)}</p>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.yearlyProjection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" fontSize={12} tickFormatter={(v) => `Y${v}`} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} tickFormatter={(v) => formatCurrency(v, true)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => [formatCurrency(value), ""]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="totalWealth"
                  stroke="#14B8A6"
                  fillOpacity={1}
                  fill="url(#colorEquity)"
                  name="Total Wealth"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-border/60 bg-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">Monthly Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Gross Rent</span>
              <span className="font-semibold" style={{ color: "var(--color-secondary)" }}>+{formatCurrency(watchedValues.monthlyRent || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Management Fee</span>
              <span className="font-semibold" style={{ color: "var(--color-error)" }}>-{formatCurrency(results.monthlyManagementFee)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Maintenance</span>
              <span className="font-semibold" style={{ color: "var(--color-error)" }}>-{formatCurrency(results.monthlyMaintenanceCost)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-secondary/50 rounded-lg px-3 -mx-3">
              <span className="font-semibold">Net Cash Flow</span>
              <span className="text-lg font-bold" style={{ color: results.isCashFlowPositive ? "var(--color-secondary)" : "var(--color-error)" }}>
                {formatCurrency(results.monthlyCashFlow)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setShowMobileResults(true)}
          className="w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg flex items-center justify-between"
          style={{
            backgroundColor: results.isCashFlowPositive ? "var(--color-secondary)" : "var(--color-error)"
          }}
        >
          <span>Monthly Cash Flow</span>
          <span className="text-xl">{formatCurrency(results.monthlyCashFlow)}</span>
        </button>
      </div>

      {showMobileResults ? (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowMobileResults(false)}>
          <div
            className="bg-card text-foreground rounded-2xl p-6 space-y-4 shadow-xl border border-border/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold">Monthly Cash Flow</h4>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setShowMobileResults(false)}
              >
                Close
              </button>
            </div>
            <p className="text-3xl font-bold" style={{ color: results.isCashFlowPositive ? "var(--color-secondary)" : "var(--color-error)" }}>
              {formatCurrency(results.monthlyCashFlow)}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Net Yield</span>
                <span className="font-semibold text-foreground">{results.netYield.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Cap Rate</span>
                <span className="font-semibold text-foreground">{results.capRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>5-Year Wealth</span>
                <span className="font-semibold text-foreground">{formatCurrency(results.fiveYearTotalWealth, true)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ROICalculator

