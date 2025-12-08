import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp, DollarSign, PiggyBank, Home } from 'lucide-react';

// Helper function for input validation
const parsePositiveNumber = (value) => Math.max(0, parseFloat(value) || 0);

// Reusable SliderInput Component
const SliderInput = ({ label, value, onChange, min = 0, max = 100, step = 1, suffix = '%' }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-primary">
          {value.toLocaleString('en-IN')}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min.toLocaleString('en-IN')}{suffix}</span>
        <span>{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  );
};

// ResultCard Component for Key Metrics
const ResultCard = ({ title, value, subtitle, icon: Icon, trend = 'neutral' }) => {
  const trendColor = trend === 'positive' ? 'text-green-600' : trend === 'negative' ? 'text-red-600' : 'text-gray-600';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${trendColor} mb-2`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="bg-primary/10 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

// Main ROI Calculator Component
export default function ROICalculator() {
  // State for inputs
  const [purchasePrice, setPurchasePrice] = useState(5000000);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [appreciationRate, setAppreciationRate] = useState(5);
  const [hasLoan, setHasLoan] = useState(true);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [annualMaintenance, setAnnualMaintenance] = useState(60000);
  const [propertyTax, setPropertyTax] = useState(15000);
  const [managementFee, setManagementFee] = useState(8);
  const [vacancyRate, setVacancyRate] = useState(5);

  // Calculations
  const calculations = useMemo(() => {
    try {
      // Basic calculations
      const downPaymentAmount = hasLoan ? (purchasePrice * downPayment) / 100 : purchasePrice;
      const loanAmount = hasLoan ? purchasePrice - downPaymentAmount : 0;
      const annualRent = monthlyRent * 12;
      
      // EMI Calculation (if loan exists)
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
      
      // Operating Expenses
      const annualManagementFee = (annualRent * managementFee) / 100;
      const vacancyLoss = (annualRent * vacancyRate) / 100;
      const totalAnnualExpenses = annualMaintenance + propertyTax + annualManagementFee + vacancyLoss;
      
      // Net Operating Income
      const netOperatingIncome = annualRent - totalAnnualExpenses;
      
      // Monthly Cash Flow
      const monthlyCashFlow = (netOperatingIncome / 12) - monthlyEMI;
      
      // Net Rental Yield
      const totalInvestment = hasLoan ? downPaymentAmount : purchasePrice;
      const netRentalYield = totalInvestment > 0 ? ((netOperatingIncome - annualEMI) / totalInvestment) * 100 : 0;
      
      // Cash-on-Cash Return
      const annualCashFlow = netOperatingIncome - annualEMI;
      const cashOnCashReturn = totalInvestment > 0 ? (annualCashFlow / totalInvestment) * 100 : 0;
      
      // 5-Year Projection
      const appreciationGain = purchasePrice * Math.pow(1 + appreciationRate / 100, 5) - purchasePrice;
      const accumulatedCashFlow = annualCashFlow * 5;
      const totalROI5Year = totalInvestment > 0 ? ((accumulatedCashFlow + appreciationGain) / totalInvestment) * 100 : 0;
      
      // 10-Year Projection Data for Chart
      const projectionData = [];
      for (let year = 0; year <= 10; year++) {
        const propertyValue = purchasePrice * Math.pow(1 + appreciationRate / 100, year);
        const cumulativeCashFlow = annualCashFlow * year;
        projectionData.push({
          year: year === 0 ? 'Now' : `Year ${year}`,
          'Property Value': Math.round(propertyValue),
          'Total Investment': Math.round(totalInvestment),
          'Accumulated Cash Flow': Math.round(cumulativeCashFlow > 0 ? cumulativeCashFlow : 0),
        });
      }
      
      // Expense Breakdown for Pie Chart
      const expenseBreakdown = [
        { name: 'EMI', value: Math.round(annualEMI), color: '#3730A3' },
        { name: 'Maintenance', value: Math.round(annualMaintenance), color: '#F59E0B' },
        { name: 'Property Tax', value: Math.round(propertyTax), color: '#14B8A6' },
        { name: 'Management Fee', value: Math.round(annualManagementFee), color: '#8B5CF6' },
        { name: 'Vacancy Loss', value: Math.round(vacancyLoss), color: '#EF4444' },
      ].filter(item => item.value > 0);
      
      return {
        netRentalYield,
        cashOnCashReturn,
        totalROI5Year,
        monthlyCashFlow,
        annualCashFlow,
        projectionData,
        expenseBreakdown,
        totalAnnualExpenses,
        annualEMI,
        netOperatingIncome,
      };
    } catch (error) {
      console.error('Calculation error:', error);
      return {
        netRentalYield: 0,
        cashOnCashReturn: 0,
        totalROI5Year: 0,
        monthlyCashFlow: 0,
        annualCashFlow: 0,
        projectionData: [],
        expenseBreakdown: [],
        totalAnnualExpenses: 0,
        annualEMI: 0,
        netOperatingIncome: 0,
      };
    }
  }, [purchasePrice, monthlyRent, appreciationRate, hasLoan, downPayment, interestRate, loanTenure, 
      annualMaintenance, propertyTax, managementFee, vacancyRate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Rental Property ROI Calculator</h1>
          </div>
          <p className="text-gray-600 text-lg">Calculate returns on your Indian real estate investment</p>
        </div>

        {/* Main Content - Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Inputs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Home className="w-6 h-6 mr-2 text-primary" />
              Property Details
            </h2>

            {/* Purchase Price */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Purchase Price</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(parsePositiveNumber(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter purchase price"
              />
            </div>

            {/* Monthly Rent */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Expected Monthly Rent</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(parsePositiveNumber(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter monthly rent"
              />
            </div>

            {/* Appreciation Rate */}
            <SliderInput
              label="Annual Appreciation Rate"
              value={appreciationRate}
              onChange={setAppreciationRate}
              min={0}
              max={15}
              step={0.5}
              suffix="%"
            />

            {/* Loan Toggle */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLoan}
                  onChange={(e) => setHasLoan(e.target.checked)}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">Taking a loan?</span>
              </label>
            </div>

            {/* Loan Details - Conditional */}
            {hasLoan && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Details</h3>
                
                <SliderInput
                  label="Down Payment"
                  value={downPayment}
                  onChange={setDownPayment}
                  min={10}
                  max={80}
                  step={5}
                  suffix="%"
                />
                
                <SliderInput
                  label="Interest Rate"
                  value={interestRate}
                  onChange={setInterestRate}
                  min={6}
                  max={12}
                  step={0.25}
                  suffix="%"
                />
                
                <SliderInput
                  label="Loan Tenure"
                  value={loanTenure}
                  onChange={setLoanTenure}
                  min={5}
                  max={30}
                  step={1}
                  suffix=" years"
                />
              </div>
            )}

            {/* Operating Expenses */}
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Operating Expenses</h3>
              
              {/* Annual Maintenance */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Annual Maintenance/Society Charges</label>
                <input
                  type="number"
                  value={annualMaintenance}
                  onChange={(e) => setAnnualMaintenance(parsePositiveNumber(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Property Tax */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Annual Property Tax</label>
                <input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(parsePositiveNumber(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <SliderInput
                label="Property Management Fee"
                value={managementFee}
                onChange={setManagementFee}
                min={0}
                max={15}
                step={0.5}
                suffix="%"
              />
              
              <SliderInput
                label="Vacancy Rate"
                value={vacancyRate}
                onChange={setVacancyRate}
                min={0}
                max={20}
                step={1}
                suffix="%"
              />
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                Key Metrics
              </h2>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <ResultCard
                  title="Net Rental Yield"
                  value={`${calculations.netRentalYield.toFixed(2)}%`}
                  subtitle="Annual return on investment"
                  icon={DollarSign}
                  trend={calculations.netRentalYield > 5 ? 'positive' : calculations.netRentalYield > 0 ? 'neutral' : 'negative'}
                />
                
                <ResultCard
                  title="Cash-on-Cash Return"
                  value={`${calculations.cashOnCashReturn.toFixed(2)}%`}
                  subtitle="Return relative to cash invested"
                  icon={PiggyBank}
                  trend={calculations.cashOnCashReturn > 8 ? 'positive' : calculations.cashOnCashReturn > 0 ? 'neutral' : 'negative'}
                />
                
                <ResultCard
                  title="5-Year Total ROI"
                  value={`${calculations.totalROI5Year.toFixed(2)}%`}
                  subtitle="Projected return over 5 years"
                  icon={TrendingUp}
                  trend={calculations.totalROI5Year > 50 ? 'positive' : calculations.totalROI5Year > 0 ? 'neutral' : 'negative'}
                />
                
                <ResultCard
                  title="Monthly Cash Flow"
                  value={formatCurrency(calculations.monthlyCashFlow)}
                  subtitle={calculations.monthlyCashFlow > 0 ? 'Positive cash flow' : 'Negative cash flow'}
                  icon={Calculator}
                  trend={calculations.monthlyCashFlow > 0 ? 'positive' : 'negative'}
                />
              </div>
            </div>

            {/* Expense Breakdown Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Annual Expense Breakdown</h3>
              {calculations.expenseBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={calculations.expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {calculations.expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-12">No expenses to display</p>
              )}
            </div>

            {/* Projected Value vs Investment Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">10-Year Property Value Projection</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calculations.projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="Property Value" fill="#3730A3" />
                  <Bar dataKey="Total Investment" fill="#F59E0B" />
                  <Bar dataKey="Accumulated Cash Flow" fill="#14B8A6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Box */}
            <div className="bg-gradient-to-r from-primary to-primary-light text-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">Investment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Annual Rental Income:</span>
                  <span className="font-semibold">{formatCurrency(monthlyRent * 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Operating Expenses:</span>
                  <span className="font-semibold">{formatCurrency(calculations.totalAnnualExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual EMI:</span>
                  <span className="font-semibold">{formatCurrency(calculations.annualEMI)}</span>
                </div>
                <div className="border-t border-white/30 pt-2 mt-2 flex justify-between text-base">
                  <span className="font-bold">Net Annual Cash Flow:</span>
                  <span className={`font-bold ${calculations.annualCashFlow > 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {formatCurrency(calculations.annualCashFlow)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
