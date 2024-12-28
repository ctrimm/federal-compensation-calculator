// src/utils/retirement.ts
const TSP_MAX = 23500; // 2025 TSP limit

export const calculateTSP = (basePay: number, contributionPercent: number) => {
  const maxTspContributionForSalary = basePay * (contributionPercent / 100);
  const actualTspContribution = Math.min(maxTspContributionForSalary, TSP_MAX);
  const govMatchPercent = Math.min(contributionPercent, 5);
  const govMatchAmount = basePay * (govMatchPercent / 100);

  return {
    contribution: actualTspContribution,
    match: govMatchAmount
  };
};

export const calculateFERS = (basePay: number) => {
  return basePay * 0.01;
};
