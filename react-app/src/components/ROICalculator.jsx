import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calculator, TrendingUp, DollarSign, PiggyBank, Home, IndianRupee, Percent, Calendar } from 'lucide-react';
import useROIStore from '../stores/roiStore';

// Reusable SliderInput Component with React Hook Form integration
const SliderInput = ({ label, register, name, min = 0, max = 100, step = 1, suffix = '%', watch }) => {
  const value = watch(name);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-emerald-600">
          {Number(value || 0).toLocaleString('en-IN')}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        {...register(name, { valueAsNumber: true })}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min.toLocaleString('en-IN')}{suffix}</span>
        <span>{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  );
};

// ResultCard Component for Key Metrics - Updated with FinTech aesthetic
const ResultCard = ({ title, value, subtitle, icon: Icon, trend = 'neutral' }) => {
  const trendColor = trend === 'positive' ? 'text-emerald-600' : trend === 'negative' ? 'text-rose-600' : 'text-gray-600';
  const bgColor = trend === 'positive' ? 'from-emerald-50 to-emerald-100 border-emerald-200' : trend === 'negative' ? 'from-rose-50 to-rose-100 border-rose-200' : 'from-gray-50 to-gray-100 border-gray-200';
  
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-xl shadow-md p-6 border hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${trendColor} mb-2`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`${trend === 'positive' ? 'bg-emerald-100' : trend === 'negative' ? 'bg-rose-100' : 'bg-gray-100'} p-3 rounded-lg`}>
            <Icon className={`w-6 h-6 ${trendColor}`} />
          </div>
        )}
      </div>
    </div>
  );
};

// Main ROI Calculator Component
export default function ROICalculator() {
  // Zustand store
  const { results, calculateROI } = useROIStore();
  
  // React Hook Form setup with default values
  const { register, control, watch } = useForm({
    defaultValues: {
      purchasePrice: 5000000,
      monthlyRent: 25000,
      annualAppreciation: 5,
      propertyManagementFee: 8,
      monthlyMaintenance: 5000,
      hasLoan: true,
      downPaymentPercent: 20,
      interestRate: 8.5,
      loanTenure: 20,
    },
    mode: 'onChange',
  });
  
  // Watch all form values for real-time updates
  const formData = useWatch({ control });
  
  // Trigger calculation whenever form data changes
  useEffect(() => {
    if (formData) {
      calculateROI(formData);
    }
  }, [formData, calculateROI]);
  
  // Watch specific field for conditional rendering
  const hasLoan = watch('hasLoan');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <Calculator className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            NRI Property ROI Calculator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Calculate comprehensive returns on your Indian real estate investment with professional-grade analytics
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Inputs (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Home className="w-5 h-5 mr-2 text-emerald-600" />
                Property Details
              </h2>

              {/* Purchase Price */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  Purchase Price
                </label>
                <input
                  type="number"
                  {...register('purchasePrice', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter purchase price"
                />
              </div>

              {/* Monthly Rent */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  Expected Monthly Rent
                </label>
                <input
                  type="number"
                  {...register('monthlyRent', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter monthly rent"
                />
              </div>

              {/* Monthly Maintenance */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  Society Maintenance (Monthly)
                </label>
                <input
                  type="number"
                  {...register('monthlyMaintenance', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter monthly maintenance"
                />
              </div>

              {/* Appreciation Rate Slider */}
              <SliderInput
                label="Annual Appreciation"
                register={register}
                name="annualAppreciation"
                min={0}
                max={15}
                step={0.5}
                suffix="%"
                watch={watch}
              />

              {/* Property Management Fee Slider */}
              <SliderInput
                label="Property Management Fee"
                register={register}
                name="propertyManagementFee"
                min={0}
                max={15}
                step={0.5}
                suffix="%"
                watch={watch}
              />
            </div>

            {/* Loan Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="mb-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register('hasLoan')}
                    className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-all"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                    Taking a loan for this property?
                  </span>
                </label>
              </div>

              {/* Loan Details - Conditional */}
              {hasLoan && (
                <div className="space-y-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Calculator className="w-4 h-4 mr-2 text-emerald-600" />
                    Loan Details
                  </h3>
                  
                  <SliderInput
                    label="Down Payment"
                    register={register}
                    name="downPaymentPercent"
                    min={10}
                    max={80}
                    step={5}
                    suffix="%"
                    watch={watch}
                  />
                  
                  <SliderInput
                    label="Interest Rate"
                    register={register}
                    name="interestRate"
                    min={6}
                    max={12}
                    step={0.25}
                    suffix="% p.a."
                    watch={watch}
                  />
                  
                  <SliderInput
                    label="Loan Tenure"
                    register={register}
                    name="loanTenure"
                    min={5}
                    max={30}
                    step={1}
                    suffix=" years"
                    watch={watch}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Results (3 columns) - Sticky on desktop */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 lg:self-start">
            {/* Key Metrics Dashboard */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-emerald-600" />
                Key Performance Metrics
              </h2>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ResultCard
                  title="Net Rental Yield"
                  value={`${results.netYield.toFixed(2)}%`}
                  subtitle="Annual return on investment"
                  icon={Percent}
                  trend={results.netYield > 5 ? 'positive' : results.netYield > 0 ? 'neutral' : 'negative'}
                />
                
                <ResultCard
                  title="Cash-on-Cash Return"
                  value={`${results.cashOnCashReturn.toFixed(2)}%`}
                  subtitle="Return on actual cash invested"
                  icon={PiggyBank}
                  trend={results.cashOnCashReturn > 8 ? 'positive' : results.cashOnCashReturn > 0 ? 'neutral' : 'negative'}
                />
                
                <ResultCard
                  title="Cap Rate"
                  value={`${results.capRate.toFixed(2)}%`}
                  subtitle="Property's intrinsic return"
                  icon={TrendingUp}
                  trend={results.capRate > 4 ? 'positive' : results.capRate > 0 ? 'neutral' : 'negative'}
                />
                
                <ResultCard
                  title="Monthly Cash Flow"
                  value={formatCurrency(results.monthlyCashFlow)}
                  subtitle={results.monthlyCashFlow > 0 ? 'Positive cash flow' : 'Negative cash flow'}
                  icon={DollarSign}
                  trend={results.monthlyCashFlow > 0 ? 'positive' : 'negative'}
                />
              </div>

              {/* 5-Year Projection Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg p-6 mt-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  <h3 className="text-xl font-bold">5-Year Wealth Projection</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">Total Equity Gained</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.fiveYearProjection.totalEquity)}</p>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">Total Cash Flow</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.fiveYearProjection.totalCashFlow)}</p>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">Total Wealth Created</p>
                    <p className="text-3xl font-bold">{formatCurrency(results.fiveYearProjection.totalWealth)}</p>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">Total ROI</p>
                    <p className="text-3xl font-bold">{results.fiveYearProjection.totalROI.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
              {/* 10-Year Projection Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">10-Year Property Value & Equity Projection</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={results.projectionData}>
                    <defs>
                      <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="year" stroke="#6b7280" />
                    <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} stroke="#6b7280" />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Area type="monotone" dataKey="Property Value" stroke="#10b981" fillOpacity={1} fill="url(#colorProperty)" />
                    <Area type="monotone" dataKey="Equity" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEquity)" />
                    <Line type="monotone" dataKey="Loan Balance" stroke="#ef4444" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Annual Expense Breakdown</h3>
                {results.expenseBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={results.expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {results.expenseBreakdown.map((entry, index) => (
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
            </div>

            {/* Investment Summary */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Investment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                  <span className="text-gray-700">Your Investment:</span>
                  <span className="font-bold text-gray-900 text-lg">{formatCurrency(results.totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual Rental Income:</span>
                  <span className="font-semibold text-emerald-600">{formatCurrency(results.annualRent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual Operating Expenses:</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(results.annualExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual EMI Payments:</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(results.annualEMI)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                  <span className="font-bold text-gray-800 text-lg">Net Annual Cash Flow:</span>
                  <span className={`font-bold text-xl ${results.annualCashFlow > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(results.annualCashFlow)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile: View Results Button */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
              <button
                onClick={() => {
                  const target = document.querySelector('.lg\\:col-span-3');
                  if (target) {
                    window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                  }
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
              >
                View Results Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
