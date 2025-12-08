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
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-primary/10">
      {/* Widget Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">ROI Calculator</h3>
              <p className="text-sm text-white/90">Calculate Your Property Returns</p>
            </div>
          </div>
          <Link 
            to="/roi-calculator" 
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            Full Calculator →
          </Link>
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-6">
        {/* Quick Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Purchase Price</label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(parsePositiveNumber(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="₹50,00,000"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Monthly Rent</label>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(parsePositiveNumber(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="₹25,000"
            />
          </div>
        </div>

        {/* Loan Toggle */}
        <div className="mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hasLoan}
              onChange={(e) => setHasLoan(e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Taking a loan?</span>
          </label>
        </div>

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium mb-4 transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>

        {/* Advanced Options - Collapsible */}
        {showAdvanced && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasLoan && (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Down Payment (%)</label>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parsePositiveNumber(e.target.value))}
                      min="10"
                      max="80"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Interest Rate (%)</label>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parsePositiveNumber(e.target.value))}
                      step="0.25"
                      min="6"
                      max="12"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Loan Tenure (years)</label>
                    <input
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(parsePositiveNumber(e.target.value))}
                      min="5"
                      max="30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Appreciation Rate (%)</label>
                <input
                  type="number"
                  value={appreciationRate}
                  onChange={(e) => setAppreciationRate(parsePositiveNumber(e.target.value))}
                  step="0.5"
                  min="0"
                  max="15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Management Fee (%)</label>
                <input
                  type="number"
                  value={managementFee}
                  onChange={(e) => setManagementFee(parsePositiveNumber(e.target.value))}
                  step="0.5"
                  min="0"
                  max="15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results - Compact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Net Rental Yield */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-green-700 font-medium">Net Rental Yield</p>
                <p className="text-2xl font-bold text-green-800">{calculations.netRentalYield.toFixed(2)}%</p>
                <p className="text-xs text-green-600 mt-1">Annual return on investment</p>
              </div>
            </div>
          </div>

          {/* 5-Year ROI */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-blue-700 font-medium">5-Year Total ROI</p>
                <p className="text-2xl font-bold text-blue-800">{calculations.totalROI5Year.toFixed(2)}%</p>
                <p className="text-xs text-blue-600 mt-1">Including appreciation</p>
              </div>
            </div>
          </div>

          {/* Monthly Cash Flow */}
          <div className={`bg-gradient-to-br ${calculations.monthlyCashFlow >= 0 ? 'from-purple-50 to-purple-100 border-purple-200' : 'from-red-50 to-red-100 border-red-200'} p-4 rounded-lg border`}>
            <div className="flex items-start gap-2 mb-2">
              <Home className={`w-4 h-4 ${calculations.monthlyCashFlow >= 0 ? 'text-purple-600' : 'text-red-600'} mt-0.5`} />
              <div className="flex-1">
                <p className={`text-xs ${calculations.monthlyCashFlow >= 0 ? 'text-purple-700' : 'text-red-700'} font-medium`}>Monthly Cash Flow</p>
                <p className={`text-2xl font-bold ${calculations.monthlyCashFlow >= 0 ? 'text-purple-800' : 'text-red-800'}`}>
                  {formatCurrency(calculations.monthlyCashFlow)}
                </p>
                <p className={`text-xs ${calculations.monthlyCashFlow >= 0 ? 'text-purple-600' : 'text-red-600'} mt-1`}>
                  {calculations.monthlyCashFlow >= 0 ? 'Positive flow' : 'Negative flow'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600">Your Investment:</span>
            <span className="font-bold text-gray-800">{formatLargeNumber(calculations.totalInvestment)}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600">Annual Rental Income:</span>
            <span className="font-bold text-gray-800">{formatLargeNumber(monthlyRent * 12)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-300">
            <span>*Estimated values. Use full calculator for detailed analysis.</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 flex gap-3">
          <Link 
            to="/roi-calculator" 
            className="flex-1 bg-primary hover:bg-primary-dark text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
          >
            View Detailed Analysis
          </Link>
          <Link 
            to="/contact" 
            className="flex-1 bg-accent hover:bg-accent-hover text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
          >
            Get Expert Advice
          </Link>
        </div>
      </div>
    </div>
  );
}
