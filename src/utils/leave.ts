// src/utils/leave.ts
const HOURS_PER_YEAR = 2080;

const getAnnualLeaveHours = (yearsOfService: number): number => {
  if (yearsOfService < 3) return 104; // 4 hours per PP (13 days)
  if (yearsOfService < 15) return 160; // 6 hours per PP (20 days)
  return 208; // 8 hours per PP (26 days)
};

export const calculateLeaveValue = (basePay: number, yearsOfService: number = 0) => {
  const annualLeaveHours = getAnnualLeaveHours(yearsOfService);
  return {
    annual: basePay / HOURS_PER_YEAR * annualLeaveHours,
    sick: basePay / HOURS_PER_YEAR * 104 // Sick leave is always 4 hours per PP
  };
};
