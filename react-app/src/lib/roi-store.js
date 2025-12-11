import { create } from "zustand"

const initialResults = {
  monthlyCashFlow: 0,
  monthlyManagementFee: 0,
  monthlyMaintenanceCost: 0,
  monthlyNetIncome: 0,
  annualGrossRent: 0,
  annualNetIncome: 0,
  annualAppreciation: 0,
  netYield: 0,
  grossYield: 0,
  capRate: 0,
  fiveYearEquityGain: 0,
  fiveYearCashFlow: 0,
  fiveYearTotalWealth: 0,
  totalInvestment: 0,
  yearlyProjection: [],
  isCashFlowPositive: true,
}

export const useROIStore = create((set) => ({
  results: initialResults,
  currency: "INR",

  setCurrency: (currency) => set({ currency }),

  calculateROI: (data) => {
    const { purchasePrice, monthlyRent, annualAppreciation, managementFeePercent, maintenanceCharges } = data

    // Monthly costs
    const monthlyManagementFee = (monthlyRent * managementFeePercent) / 100
    const monthlyMaintenanceCost = maintenanceCharges

    const monthlyNetIncome = monthlyRent - monthlyManagementFee - monthlyMaintenanceCost
    const monthlyCashFlow = monthlyNetIncome

    // Annual metrics
    const annualGrossRent = monthlyRent * 12
    const annualNetIncome = monthlyCashFlow * 12
    const annualAppreciationAmount = (purchasePrice * annualAppreciation) / 100

    // Key yields and returns (no loan involved)
    const grossYield = purchasePrice > 0 ? (annualGrossRent / purchasePrice) * 100 : 0
    const netYield = purchasePrice > 0 ? (annualNetIncome / purchasePrice) * 100 : 0
    const capRate =
      purchasePrice > 0
        ? ((annualGrossRent - (monthlyMaintenanceCost + monthlyManagementFee) * 12) / purchasePrice) * 100
        : 0

    // 5-Year projection (full equity since no loan)
    const yearlyProjection = []
    let cumulativeCashFlow = 0
    let currentPropertyValue = purchasePrice

    for (let year = 1; year <= 5; year++) {
      currentPropertyValue = currentPropertyValue * (1 + annualAppreciation / 100)
      cumulativeCashFlow += annualNetIncome
      const equity = currentPropertyValue
      const totalWealth = equity + cumulativeCashFlow

      yearlyProjection.push({
        year,
        propertyValue: Math.round(currentPropertyValue),
        equity: Math.round(equity),
        cumulativeCashFlow: Math.round(cumulativeCashFlow),
        totalWealth: Math.round(totalWealth),
      })
    }

    const fiveYearEquityGain = yearlyProjection[4]?.equity - purchasePrice || 0
    const fiveYearCashFlow = cumulativeCashFlow
    const fiveYearTotalWealth = fiveYearEquityGain + fiveYearCashFlow

    set({
      results: {
        monthlyCashFlow,
        monthlyManagementFee,
        monthlyMaintenanceCost,
        monthlyNetIncome,
        annualGrossRent,
        annualNetIncome,
        annualAppreciation: annualAppreciationAmount,
        netYield,
        grossYield,
        capRate,
        fiveYearEquityGain,
        fiveYearCashFlow,
        fiveYearTotalWealth,
        totalInvestment: purchasePrice,
        yearlyProjection,
        isCashFlowPositive: monthlyCashFlow >= 0,
      },
    })
  },
}))
