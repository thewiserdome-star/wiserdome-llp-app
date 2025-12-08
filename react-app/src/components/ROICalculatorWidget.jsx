import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper function for input validation
const parsePositiveNumber = (value) => Math.max(0, parseFloat(value) || 0);

// Compact ROI Calculator Widget Component
export default function ROICalculatorWidget() {
  // State for inputs - with sensible defaults
  const [purchasePrice, setPurchasePrice] = useState(5000000);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [appreciationRate, setAppreciationRate] = useState(5);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasLoan, setHasLoan] = useState(true);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [managementFee, setManagementFee] = useState(8);

  // Calculations (simplified for widget)
  const calculations = useMemo(() => {
    try {
      const downPaymentAmount = hasLoan ? (purchasePrice * downPayment) / 100 : purchasePrice;
      const loanAmount = hasLoan ? purchasePrice - downPaymentAmount : 0;
      const annualRent = monthlyRent * 12;
      
      // EMI Calculation
      let monthlyEMI = 0;
      if (hasLoan && loanAmount > 0) {
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTenure * 12;
        if (monthlyInterestRate > 0) {
          const compound = Math.pow(1 + monthlyInterestRate, numberOfPayments);
          monthlyEMI = (loanAmount * monthlyInterestRate * compound) / (compound - 1);
        }
      }
      const annualEMI = monthlyEMI * 12;
      
      // Operating Expenses (simplified)
      const annualManagementFee = (annualRent * managementFee) / 100;
      const estimatedMaintenance = purchasePrice * 0.01; // 1% of property value
      const totalAnnualExpenses = estimatedMaintenance + annualManagementFee;
      
      // Net Operating Income
      const netOperatingIncome = annualRent - totalAnnualExpenses;
      
      // Monthly Cash Flow
      const monthlyCashFlow = (netOperatingIncome / 12) - monthlyEMI;
      
      // Net Rental Yield
      const totalInvestment = hasLoan ? downPaymentAmount : purchasePrice;
      const netRentalYield = totalInvestment > 0 ? ((netOperatingIncome - annualEMI) / totalInvestment) * 100 : 0;
      
      // 5-Year ROI
      const appreciationGain = purchasePrice * Math.pow(1 + appreciationRate / 100, 5) - purchasePrice;
      const annualCashFlow = netOperatingIncome - annualEMI;
      const accumulatedCashFlow = annualCashFlow * 5;
      const totalROI5Year = totalInvestment > 0 ? ((accumulatedCashFlow + appreciationGain) / totalInvestment) * 100 : 0;
      
      return {
        netRentalYield,
        totalROI5Year,
        monthlyCashFlow,
        totalInvestment,
      };
    } catch (error) {
      console.error('Calculation error:', error);
      return {
        netRentalYield: 0,
        totalROI5Year: 0,
        monthlyCashFlow: 0,
        totalInvestment: 0,
      };
    }
  }, [purchasePrice, monthlyRent, appreciationRate, hasLoan, downPayment, interestRate, loanTenure, managementFee]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLargeNumber = (num) => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2)} L`;
    }
    return formatCurrency(num);
  };

return (
  <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-8 rounded-3xl">
    {/* Floating card container */}
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">Property ROI</h3>
            <p className="text-sm text-slate-500">
              Real-time investment projections for your property.
            </p>
          </div>
        </div>
        <Link
          to="/roi-calculator"
          className="hidden sm:inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
        >
          Full calculator
        </Link>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-5 mb-6">
        {/* Purchase price */}
        <div>
          <label className="text-sm font-medium text-slate-500 mb-1 block">
            Purchase price
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              ₹
            </span>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(parsePositiveNumber(e.target.value))}
              className="w-full bg-slate-50 border-0 rounded-lg pl-8 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              placeholder="50,00,000"
            />
          </div>
        </div>

        {/* Monthly rent */}
        <div>
          <label className="text-sm font-medium text-slate-500 mb-1 block">
            Monthly rental income
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              ₹
            </span>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(parsePositiveNumber(e.target.value))}
              className="w-full bg-slate-50 border-0 rounded-lg pl-8 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              placeholder="25,000"
            />
          </div>
        </div>
      </div>

      {/* Loan toggle + advanced toggle */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          type="button"
          onClick={() => setHasLoan(!hasLoan)}
          className="inline-flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
        >
          <span className="flex items-center gap-2">
            <Home className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">Apply mortgage</span>
          </span>
          <span
            className={`inline-flex h-5 w-9 items-center rounded-full px-0.5 transition ${
              hasLoan ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition ${
                hasLoan ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition"
        >
          {showAdvanced ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
          <span>{showAdvanced ? 'Hide advanced settings' : 'Show advanced settings'}</span>
        </button>
      </div>

      {/* Advanced section */}
      {showAdvanced && (
        <div className="mb-6 flex flex-col gap-4">
          {hasLoan && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Down payment (%)
                </label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parsePositiveNumber(e.target.value))}
                  min="10"
                  max="80"
                  className="w-full bg-slate-50 border-0 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Interest rate (%)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parsePositiveNumber(e.target.value))}
                  step="0.25"
                  min="6"
                  max="12"
                  className="w-full bg-slate-50 border-0 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Loan tenure (years)
                </label>
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(parsePositiveNumber(e.target.value))}
                  min="5"
                  max="30"
                  className="w-full bg-slate-50 border-0 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-500 mb-1 block">
              Appreciation rate (%)
            </label>
            <input
              type="number"
              value={appreciationRate}
              onChange={(e) => setAppreciationRate(parsePositiveNumber(e.target.value))}
              step="0.5"
              min="0"
              max="15"
              className="w-full bg-slate-50 border-0 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-500 mb-1 block">
              Management fee (%)
            </label>
            <input
              type="number"
              value={managementFee}
              onChange={(e) => setManagementFee(parsePositiveNumber(e.target.value))}
              step="0.5"
              min="0"
              max="15"
              className="w-full bg-slate-50 border-0 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex flex-col gap-5 mb-6">
        {/* Hero result */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wide">
                Net rental yield
              </span>
            </div>
          </div>
          <p className="text-4xl font-semibold tracking-tight mb-1">
            {calculations.netRentalYield.toFixed(2)}%
          </p>
          <p className="text-sm text-violet-100">
            Estimated annual percentage return on your invested capital.
          </p>
        </div>

        {/* Secondary metrics */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
              5-year total ROI
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {calculations.totalROI5Year.toFixed(2)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Including price appreciation.</p>
          </div>

          <div className="flex-1 rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
              Monthly cash flow
            </p>
            <p
              className={`text-2xl font-semibold ${
                calculations.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatCurrency(calculations.monthlyCashFlow)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {calculations.monthlyCashFlow >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-slate-50 px-4 py-3 flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Your investment</span>
            <span className="font-semibold text-slate-900">
              {formatLargeNumber(calculations.totalInvestment)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Annual rental income</span>
            <span className="font-semibold text-emerald-600">
              {formatLargeNumber(monthlyRent * 12)}
            </span>
          </div>
          <p className="text-xs text-slate-400 pt-1">
            *Indicative numbers only. Use the full calculator for a detailed breakdown.
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/roi-calculator"
          className="flex-1 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 transition"
        >
          View detailed analysis
        </Link>
        <Link
          to="/contact"
          className="flex-1 inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-200 transition"
        >
          Get expert advice
        </Link>
      </div>
    </div>
  </div>
);
