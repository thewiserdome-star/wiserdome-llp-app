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
    <div className="bg-slate-50 p-6 rounded-3xl">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Widget Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">ROI Calculator</h3>
                <p className="text-sm text-indigo-100">Calculate Your Property Returns</p>
              </div>
            </div>
            <Link 
              to="/roi-calculator" 
              className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl transition-all duration-200 font-medium"
            >
              Full Calculator →
            </Link>
          </div>
        </div>

        {/* Widget Content */}
        <div className="p-6 md:p-8">
          {/* Quick Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-slate-500" />
                Purchase Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(parsePositiveNumber(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200 text-slate-900 font-medium"
                  placeholder="50,00,000"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                Monthly Rent
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(parsePositiveNumber(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200 text-slate-900 font-medium"
                  placeholder="25,000"
                />
              </div>
            </div>
          </div>

          {/* Loan Toggle */}
          <div className="mb-6">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={hasLoan}
                onChange={(e) => setHasLoan(e.target.checked)}
                className="w-5 h-5 text-indigo-600 focus:ring-4 focus:ring-indigo-500/10 border-slate-300 rounded"
              />
              <span className="ml-3 text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">Taking a loan?</span>
            </label>
          </div>

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold mb-6 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>

          {/* Advanced Options - Collapsible */}
          {showAdvanced && (
            <div className="mb-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hasLoan && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">Down Payment (%)</label>
                      <input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(parsePositiveNumber(e.target.value))}
                        min="10"
                        max="80"
                        className="w-full px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-slate-900 text-sm font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">Interest Rate (%)</label>
                      <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parsePositiveNumber(e.target.value))}
                        step="0.25"
                        min="6"
                        max="12"
                        className="w-full px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-slate-900 text-sm font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">Loan Tenure (years)</label>
                      <input
                        type="number"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(parsePositiveNumber(e.target.value))}
                        min="5"
                        max="30"
                        className="w-full px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-slate-900 text-sm font-medium"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">Appreciation Rate (%)</label>
                  <input
                    type="number"
                    value={appreciationRate}
                    onChange={(e) => setAppreciationRate(parsePositiveNumber(e.target.value))}
                    step="0.5"
                    min="0"
                    max="15"
                    className="w-full px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-slate-900 text-sm font-medium"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">Management Fee (%)</label>
                  <input
                    type="number"
                    value={managementFee}
                    onChange={(e) => setManagementFee(parsePositiveNumber(e.target.value))}
                    step="0.5"
                    min="0"
                    max="15"
                    className="w-full px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-slate-900 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Section - Hero Number Design */}
          <div className="bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100 mb-6">
            {/* Hero Number - Net Rental Yield */}
            <div className="text-center mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Net Rental Yield</p>
              </div>
              <p className="text-6xl font-bold text-emerald-600 mb-2">{calculations.netRentalYield.toFixed(2)}%</p>
              <p className="text-sm text-slate-500">Annual return on your investment</p>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 5-Year ROI */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">5-Year Total ROI</p>
                    <p className="text-3xl font-bold text-indigo-600">{calculations.totalROI5Year.toFixed(2)}%</p>
                    <p className="text-xs text-slate-500 mt-1">Including appreciation</p>
                  </div>
                </div>
              </div>

              {/* Monthly Cash Flow */}
              <div className={`bg-white p-4 rounded-xl border ${calculations.monthlyCashFlow >= 0 ? 'border-emerald-100' : 'border-red-100'} hover:shadow-md transition-shadow duration-200`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${calculations.monthlyCashFlow >= 0 ? 'bg-emerald-50' : 'bg-red-50'} rounded-lg`}>
                    <Home className={`w-5 h-5 ${calculations.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Monthly Cash Flow</p>
                    <p className={`text-3xl font-bold ${calculations.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(calculations.monthlyCashFlow)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {calculations.monthlyCashFlow >= 0 ? 'Positive flow' : 'Negative flow'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-slate-600 font-medium">Your Investment:</span>
              <span className="font-bold text-slate-900 text-lg">{formatLargeNumber(calculations.totalInvestment)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-slate-600 font-medium">Annual Rental Income:</span>
              <span className="font-bold text-slate-900 text-lg">{formatLargeNumber(monthlyRent * 12)}</span>
            </div>
            <div className="flex items-center text-xs text-slate-500 pt-3 border-t border-slate-300">
              <span>*Estimated values. Use full calculator for detailed analysis.</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/roi-calculator" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
            >
              View Detailed Analysis
            </Link>
            <Link 
              to="/contact" 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
            >
              Get Expert Advice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
