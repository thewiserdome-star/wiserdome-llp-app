import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calculator, TrendingUp, DollarSign, PiggyBank, Home, IndianRupee, Percent, Calendar } from 'lucide-react';
import useROIStore from '../stores/roiStore';

// Reusable SliderInput Component with React Hook Form integration - Modern FinTech Design
const SliderInput = ({ label, register, name, min = 0, max = 100, step = 1, suffix = '%', watch }) => {
  const value = watch(name);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-500">{label}</label>
        <span className="text-sm font-semibold text-indigo-600">
          {Number(value || 0).toLocaleString('en-IN')}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        {...register(name, { valueAsNumber: true })}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{min.toLocaleString('en-IN')}{suffix}</span>
        <span>{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  );
};

// ResultCard Component for Key Metrics - Modern FinTech aesthetic with subtle depth
const ResultCard = ({ title, value, subtitle, icon: Icon, trend = 'neutral' }) => {
  const trendColor = trend === 'positive' ? 'text-emerald-600' : trend === 'negative' ? 'text-rose-600' : 'text-slate-600';
  const bgColor = trend === 'positive' ? 'bg-emerald-50' : trend === 'negative' ? 'bg-rose-50' : 'bg-slate-50';
  
  return (
    <div className={`${bgColor} rounded-xl p-6 hover:shadow-md transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${trendColor} mb-2`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`${trend === 'positive' ? 'bg-emerald-100' : trend === 'negative' ? 'bg-rose-100' : 'bg-slate-100'} p-3 rounded-lg`}>
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
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-xl shadow-lg">
              <Calculator className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold font-semibold text-slate-900 mb-3">
            NRI Property ROI Calculator
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Calculate comprehensive returns on your Indian real estate investment with professional-grade analytics
          </p>
        </div>

        {/* Main Content - Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Inputs */}
          <div className="flex-1 lg:max-w-md flex flex-col gap-6">
            {/* Property Details Card */}
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-indigo-600" />
                Property Details
              </h2>

              {/* Purchase Price with Icon Inside */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Purchase Price
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    {...register('purchasePrice', { valueAsNumber: true })}
                    className="w-full bg-slate-50 border-0 rounded-lg pl-11 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter purchase price"
                  />
                </div>
              </div>

              {/* Monthly Rent with Icon Inside */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Expected Monthly Rent
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    {...register('monthlyRent', { valueAsNumber: true })}
                    className="w-full bg-slate-50 border-0 rounded-lg pl-11 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter monthly rent"
                  />
                </div>
              </div>

              {/* Monthly Maintenance with Icon Inside */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Society Maintenance (Monthly)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    {...register('monthlyMaintenance', { valueAsNumber: true })}
                    className="w-full bg-slate-50 border-0 rounded-lg pl-11 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter monthly maintenance"
                  />
                </div>
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
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6">
              <div className="mb-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register('hasLoan')}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded transition-all"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                    Taking a loan for this property?
                  </span>
                </label>
              </div>

              {/* Loan Details - Conditional */}
              {hasLoan && (
                <div className="flex flex-col gap-4 p-6 bg-indigo-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-indigo-600" />
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

          {/* Right Side - Results */}
          <div className="flex-1 flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
            {/* Hero Metric - Net Rental Yield with Gradient */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-6 text-white">
              <div className="text-center">
                <p className="text-sm font-medium text-white/80 mb-2">Net Rental Yield</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <p className="text-5xl font-bold">
                    {results.netYield.toFixed(2)}%
                  </p>
                  {results.netYield > 0 && (
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-white/90">
                  {results.monthlyCashFlow > 0 ? `${formatCurrency(results.monthlyCashFlow)} monthly income` : 'Update inputs to see yield'}
                </p>
              </div>
            </div>

            {/* Key Metrics Dashboard */}
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Key Performance Metrics
              </h2>

              {/* Metrics Flex Layout */}
              <div className="flex flex-col gap-4 mb-6">
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
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg p-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-xl font-semibold">5-Year Wealth Projection</h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <p className="text-white/80 text-sm">Total Equity Gained</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.fiveYearProjection.totalEquity)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/80 text-sm">Total Cash Flow</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.fiveYearProjection.totalCashFlow)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/80 text-sm">Total Wealth Created</p>
                    <p className="text-3xl font-bold">{formatCurrency(results.fiveYearProjection.totalWealth)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/80 text-sm">Total ROI</p>
                    <p className="text-3xl font-bold">{results.fiveYearProjection.totalROI.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-col gap-6">
              {/* 10-Year Projection Chart */}
              <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">10-Year Property Value & Equity Projection</h3>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="year" stroke="#9ca3af" axisLine={false} />
                    <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} stroke="#9ca3af" axisLine={false} />
                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                    <Legend />
                    <Area type="monotone" dataKey="Property Value" stroke="#10b981" fillOpacity={1} fill="url(#colorProperty)" />
                    <Area type="monotone" dataKey="Equity" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEquity)" />
                    <Line type="monotone" dataKey="Loan Balance" stroke="#ef4444" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Annual Expense Breakdown</h3>
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
                      <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500 text-center py-12">No expenses to display</p>
                )}
              </div>
            </div>

            {/* Investment Summary */}
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Investment Summary</h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center pb-3">
                  <span className="text-slate-500 text-sm">Your Investment:</span>
                  <span className="font-semibold text-slate-900 text-lg">{formatCurrency(results.totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Annual Rental Income:</span>
                  <span className="font-semibold text-emerald-600">{formatCurrency(results.annualRent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Annual Operating Expenses:</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(results.annualExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Annual EMI Payments:</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(results.annualEMI)}</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="font-semibold text-slate-900 text-base">Net Annual Cash Flow:</span>
                  <span className={`font-bold text-xl ${results.annualCashFlow > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(results.annualCashFlow)}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Invest?</h3>
              <p className="text-slate-500 text-sm mb-6">Get expert insights and a comprehensive property audit</p>
              <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl motion-safe:transform motion-safe:hover:-translate-y-0.5">
                Get Detailed Property Audit
              </button>
            </div>

            {/* Mobile: Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl z-50" role="complementary" aria-label="Quick results summary">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-slate-500">Monthly Cash Flow</p>
                  <p className={`text-2xl font-bold ${results.monthlyCashFlow > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(results.monthlyCashFlow)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const target = document.querySelector('.flex-1.flex.flex-col.gap-6');
                    if (target) {
                      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                      window.scrollTo({ 
                        top: target.offsetTop - 80, 
                        behavior: prefersReducedMotion ? 'auto' : 'smooth' 
                      });
                    }
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                  aria-label="Scroll to detailed results section"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
