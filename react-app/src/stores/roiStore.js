import { create } from 'zustand';

/**
 * Calculate remaining loan balance after a certain number of years
 * @param {number} loanAmount - Initial loan amount
 * @param {number} monthlyEMI - Monthly EMI payment
 * @param {number} interestRate - Annual interest rate (percentage)
 * @param {number} loanTenure - Total loan tenure in years
 * @param {number} yearsPaid - Number of years already paid
 * @returns {number} - Remaining loan balance
 */
const calculateRemainingLoanBalance = (loanAmount, monthlyEMI, interestRate, loanTenure, yearsPaid) => {
  if (!loanAmount || loanAmount <= 0 || !monthlyEMI || monthlyEMI <= 0) {
    return 0;
  }
  
  const monthlyInterestRate = interestRate / 100 / 12;
  const paymentsInYears = yearsPaid * 12;
  const totalPayments = loanTenure * 12;
  const remainingPayments = totalPayments - paymentsInYears;
  
  if (remainingPayments <= 0) {
    return 0;
  }
  
  const compound = Math.pow(1 + monthlyInterestRate, remainingPayments);
  return monthlyEMI * ((compound - 1) / (monthlyInterestRate * compound));
};

/**
 * ROI Calculator Store
 * Manages calculation results and business logic for NRI Property ROI Calculator
 */
const useROIStore = create((set) => ({
  // Currency state
  currency: 'INR',
  exchangeRate: 83, // Default INR to USD rate
  
  // Calculation results
  results: {
    // Monthly metrics
    monthlyRent: 0,
    monthlyEMI: 0,
    monthlyMaintenance: 0,
    monthlyManagementFee: 0,
    monthlyCashFlow: 0,
    
    // Annual metrics
    annualRent: 0,
    annualEMI: 0,
    annualExpenses: 0,
    annualManagementFee: 0,
    annualMaintenance: 0,
    netOperatingIncome: 0,
    annualCashFlow: 0,
    
    // Investment metrics
    downPaymentAmount: 0,
    loanAmount: 0,
    totalInvestment: 0,
    
    // ROI metrics
    netYield: 0,
    cashOnCashReturn: 0,
    capRate: 0,
    
    // Projections
    fiveYearProjection: {
      totalEquity: 0,
      totalCashFlow: 0,
      totalWealth: 0,
      totalROI: 0,
    },
    
    // Chart data
    projectionData: [],
    expenseBreakdown: [],
    cashFlowBreakdown: [],
  },
  
  // Actions
  setCurrency: (currency) => set({ currency }),
  
  setExchangeRate: (rate) => set({ exchangeRate: rate }),
  
  /**
   * Main calculation function - calculates all ROI metrics
   * @param {Object} data - Form data from React Hook Form
   */
  calculateROI: (data) => {
    try {
      const {
        purchasePrice = 0,
        monthlyRent = 0,
        annualAppreciation = 5,
        propertyManagementFee = 8,
        monthlyMaintenance = 0,
        hasLoan = false,
        downPaymentPercent = 20,
        interestRate = 8.5,
        loanTenure = 20,
      } = data;
      
      // Basic calculations
      const downPaymentAmount = hasLoan 
        ? (purchasePrice * downPaymentPercent) / 100 
        : purchasePrice;
      const loanAmount = hasLoan ? purchasePrice - downPaymentAmount : 0;
      const totalInvestment = downPaymentAmount;
      
      // Income calculations
      const annualRent = monthlyRent * 12;
      
      // EMI Calculation (using standard EMI formula)
      let monthlyEMI = 0;
      let annualEMI = 0;
      
      if (hasLoan && loanAmount > 0 && interestRate > 0) {
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTenure * 12;
        const compound = Math.pow(1 + monthlyInterestRate, numberOfPayments);
        monthlyEMI = (loanAmount * monthlyInterestRate * compound) / (compound - 1);
        annualEMI = monthlyEMI * 12;
      }
      
      // Expense calculations
      const annualMaintenance = monthlyMaintenance * 12;
      const annualManagementFee = (annualRent * propertyManagementFee) / 100;
      const annualExpenses = annualMaintenance + annualManagementFee;
      
      // Net Operating Income (NOI) - Before debt service
      const netOperatingIncome = annualRent - annualExpenses;
      
      // Cash Flow calculations
      const monthlyCashFlow = (netOperatingIncome / 12) - monthlyEMI;
      const annualCashFlow = netOperatingIncome - annualEMI;
      
      // ROI Metrics
      
      // 1. Net Yield - Annual return on total investment
      const netYield = totalInvestment > 0 
        ? (annualCashFlow / totalInvestment) * 100 
        : 0;
      
      // 2. Cash-on-Cash Return - In this context, it's identical to net yield
      // Both measure annual cash flow as a percentage of actual cash invested
      // In more complex scenarios, they might differ based on tax considerations
      const cashOnCashReturn = netYield;
      
      // 3. Cap Rate - Property's potential return without financing
      const capRate = purchasePrice > 0 
        ? (netOperatingIncome / purchasePrice) * 100 
        : 0;
      
      // 5-Year Wealth Projection
      const appreciationMultiplier = Math.pow(1 + annualAppreciation / 100, 5);
      const futurePropertyValue = purchasePrice * appreciationMultiplier;
      
      // Calculate remaining loan balance after 5 years
      const remainingLoanBalance = hasLoan 
        ? calculateRemainingLoanBalance(loanAmount, monthlyEMI, interestRate, loanTenure, 5)
        : 0;
      
      const totalEquity = futurePropertyValue - remainingLoanBalance;
      const totalCashFlow = annualCashFlow * 5;
      const totalWealth = totalEquity - totalInvestment + totalCashFlow;
      const totalROI = totalInvestment > 0 
        ? (totalWealth / totalInvestment) * 100 
        : 0;
      
      // Generate 10-year projection data for charts
      const projectionData = [];
      for (let year = 0; year <= 10; year++) {
        const yearMultiplier = Math.pow(1 + annualAppreciation / 100, year);
        const propertyValue = purchasePrice * yearMultiplier;
        const cumulativeCashFlow = annualCashFlow * year; // Keep negative values to show realistic scenarios
        
        // Calculate loan balance for each year using helper function
        const loanBalance = hasLoan 
          ? calculateRemainingLoanBalance(loanAmount, monthlyEMI, interestRate, loanTenure, year)
          : 0;
        
        const equity = propertyValue - loanBalance;
        
        projectionData.push({
          year: year === 0 ? 'Now' : `Y${year}`,
          'Property Value': Math.round(propertyValue),
          'Equity': Math.round(equity),
          'Loan Balance': Math.round(loanBalance),
          'Cumulative Cash Flow': Math.round(cumulativeCashFlow),
        });
      }
      
      // Expense Breakdown for pie chart
      const expenseBreakdown = [
        { name: 'EMI', value: Math.round(annualEMI), color: '#8b5cf6' },
        { name: 'Maintenance', value: Math.round(annualMaintenance), color: '#f59e0b' },
        { name: 'Management Fee', value: Math.round(annualManagementFee), color: '#10b981' },
      ].filter(item => item.value > 0);
      
      // Cash Flow Breakdown
      const cashFlowBreakdown = [
        { name: 'Rental Income', value: Math.round(annualRent), color: '#10b981' },
        { name: 'Operating Expenses', value: Math.round(annualExpenses), color: '#ef4444' },
        { name: 'Loan Payment', value: Math.round(annualEMI), color: '#8b5cf6' },
      ].filter(item => item.value > 0);
      
      // Update store with results
      set({
        results: {
          // Monthly metrics
          monthlyRent,
          monthlyEMI,
          monthlyMaintenance,
          monthlyManagementFee: annualManagementFee / 12,
          monthlyCashFlow,
          
          // Annual metrics
          annualRent,
          annualEMI,
          annualExpenses,
          annualManagementFee,
          annualMaintenance,
          netOperatingIncome,
          annualCashFlow,
          
          // Investment metrics
          downPaymentAmount,
          loanAmount,
          totalInvestment,
          
          // ROI metrics
          netYield,
          cashOnCashReturn,
          capRate,
          
          // Projections
          fiveYearProjection: {
            totalEquity,
            totalCashFlow,
            totalWealth,
            totalROI,
          },
          
          // Chart data
          projectionData,
          expenseBreakdown,
          cashFlowBreakdown,
        },
      });
    } catch (error) {
      console.error('ROI Calculation Error:', error);
      // Set default/empty results on error
      set({
        results: {
          monthlyRent: 0,
          monthlyEMI: 0,
          monthlyMaintenance: 0,
          monthlyManagementFee: 0,
          monthlyCashFlow: 0,
          annualRent: 0,
          annualEMI: 0,
          annualExpenses: 0,
          annualManagementFee: 0,
          annualMaintenance: 0,
          netOperatingIncome: 0,
          annualCashFlow: 0,
          downPaymentAmount: 0,
          loanAmount: 0,
          totalInvestment: 0,
          netYield: 0,
          cashOnCashReturn: 0,
          capRate: 0,
          fiveYearProjection: {
            totalEquity: 0,
            totalCashFlow: 0,
            totalWealth: 0,
            totalROI: 0,
          },
          projectionData: [],
          expenseBreakdown: [],
          cashFlowBreakdown: [],
        },
      });
    }
  },
}));

export default useROIStore;
