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
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-300/30 overflow-hidden border border-slate-200/60 backdrop-blur-sm">
        {/* Widget Header - Modern Fintech Style */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-8 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
                <Calculator className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-1">ROI Calculator</h3>
                <p className="text-sm text-indigo-100 font-medium">Calculate Your Property Returns</p>
              </div>
            </div>
            <Link 
              to="/roi-calculator" 
              className="text-sm bg-white/15 hover:bg-white/25 backdrop-blur-md px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold border border-white/20 hover:border-white/30 hover:shadow-lg hover:scale-105"
            >
              Full Calculator →
            </Link>
          </div>
        </div>

        {/* Widget Content - Modern Fintech Form Design */}
        <div className="p-8 md:p-10">
          {/* Quick Inputs - Enhanced Styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="group">
              <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2 tracking-wide">
                <Home className="w-4 h-4 text-indigo-600" />
                Purchase Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">₹</span>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(parsePositiveNumber(e.target.value))}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50/80 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 text-slate-900 font-semibold text-lg shadow-sm hover:border-slate-300"
                  placeholder="50,00,000"
                />
              </div>
            </div>
            
            <div className="group">
              <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2 tracking-wide">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                Monthly Rent
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">₹</span>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(parsePositiveNumber(e.target.value))}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50/80 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 text-slate-900 font-semibold text-lg shadow-sm hover:border-slate-300"
                  placeholder="25,000"
                />
              </div>
            </div>
          </div>

          {/* Loan Toggle - Enhanced Design */}
          <div className="mb-8">
            <label className="flex items-center cursor-pointer group p-4 rounded-xl bg-slate-50/50 border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300">
              <input
                type="checkbox"
                checked={hasLoan}
                onChange={(e) => setHasLoan(e.target.checked)}
                className="w-6 h-6 text-indigo-600 focus:ring-4 focus:ring-indigo-500/20 border-slate-300 rounded-md transition-all duration-200 cursor-pointer"
              />
              <span className="ml-4 text-base font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">Taking a loan?</span>
            </label>
          </div>

          {/* Advanced Options Toggle - Enhanced Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold mb-8 transition-all duration-300 hover:gap-3 group"
          >
            {showAdvanced ? <ChevronUp className="w-5 h-5 group-hover:transform group-hover:scale-110 transition-transform" /> : <ChevronDown className="w-5 h-5 group-hover:transform group-hover:scale-110 transition-transform" />}
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>

          {/* Advanced Options - Enhanced Collapsible Section */}
          {showAdvanced && (
            <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 rounded-2xl border-2 border-indigo-200/60 shadow-inner space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {hasLoan && (
                  <>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Down Payment (%)</label>
                      <input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(parsePositiveNumber(e.target.value))}
                        min="10"
                        max="80"
                        className="w-full px-4 py-3 bg-white border-2 border-indigo-200/60 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-slate-900 font-semibold hover:border-indigo-300"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Interest Rate (%)</label>
                      <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parsePositiveNumber(e.target.value))}
                        step="0.25"
                        min="6"
                        max="12"
                        className="w-full px-4 py-3 bg-white border-2 border-indigo-200/60 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-slate-900 font-semibold hover:border-indigo-300"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Loan Tenure (years)</label>
                      <input
                        type="number"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(parsePositiveNumber(e.target.value))}
                        min="5"
                        max="30"
                        className="w-full px-4 py-3 bg-white border-2 border-indigo-200/60 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-slate-900 font-semibold hover:border-indigo-300"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Appreciation Rate (%)</label>
                  <input
                    type="number"
                    value={appreciationRate}
                    onChange={(e) => setAppreciationRate(parsePositiveNumber(e.target.value))}
                    step="0.5"
                    min="0"
                    max="15"
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200/60 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-slate-900 font-semibold hover:border-indigo-300"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Management Fee (%)</label>
                  <input
                    type="number"
                    value={managementFee}
                    onChange={(e) => setManagementFee(parsePositiveNumber(e.target.value))}
                    step="0.5"
                    min="0"
                    max="15"
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200/60 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-slate-900 font-semibold hover:border-indigo-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Section - Enhanced Hero Number Design */}
          <div className="bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 p-8 rounded-2xl border-2 border-slate-200/60 mb-8 shadow-inner backdrop-blur-sm">
            {/* Hero Number - Net Rental Yield */}
            <div className="text-center mb-8 pb-8 border-b-2 border-slate-200/80">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Net Rental Yield</p>
              </div>
              <p className="text-7xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 tracking-tight">{calculations.netRentalYield.toFixed(2)}%</p>
              <p className="text-base text-slate-600 font-medium">Annual return on your investment</p>
            </div>

            {/* Secondary Metrics - Enhanced Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 5-Year ROI */}
              <div className="bg-white p-5 rounded-xl border-2 border-slate-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors duration-300">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">5-Year Total ROI</p>
                    <p className="text-4xl font-black text-indigo-600">{calculations.totalROI5Year.toFixed(2)}%</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Including appreciation</p>
                  </div>
                </div>
              </div>

              {/* Monthly Cash Flow */}
              <div className={`bg-white p-5 rounded-xl border-2 ${calculations.monthlyCashFlow >= 0 ? 'border-emerald-200 hover:border-emerald-300' : 'border-red-200 hover:border-red-300'} hover:shadow-lg transition-all duration-300 group`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${calculations.monthlyCashFlow >= 0 ? 'bg-emerald-100 group-hover:bg-emerald-200' : 'bg-red-100 group-hover:bg-red-200'} rounded-xl transition-colors duration-300`}>
                    <Home className={`w-6 h-6 ${calculations.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Monthly Cash Flow</p>
                    <p className={`text-4xl font-black ${calculations.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(calculations.monthlyCashFlow)}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                      {calculations.monthlyCashFlow >= 0 ? 'Positive flow' : 'Negative flow'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Summary - Enhanced Design */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-2xl border-2 border-slate-200/80 mb-8 shadow-sm">
            <div className="flex justify-between items-center text-sm mb-4 pb-3 border-b border-slate-300">
              <span className="text-slate-600 font-bold">Your Investment:</span>
              <span className="font-black text-slate-900 text-xl">{formatLargeNumber(calculations.totalInvestment)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-slate-600 font-bold">Annual Rental Income:</span>
              <span className="font-black text-emerald-600 text-xl">{formatLargeNumber(monthlyRent * 12)}</span>
            </div>
            <div className="flex items-center text-xs text-slate-500 pt-4 border-t border-slate-300 bg-white/50 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl">
              <span className="font-medium">*Estimated values. Use full calculator for detailed analysis.</span>
            </div>
          </div>

          {/* CTA Buttons - Modern Fintech Style */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/roi-calculator" 
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-center py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-[1.02] border border-indigo-500/20"
            >
              View Detailed Analysis
            </Link>
            <Link 
              to="/contact" 
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-center py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-[1.02] border border-emerald-500/20"
            >
              Get Expert Advice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
