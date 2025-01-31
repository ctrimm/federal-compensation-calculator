import { PplEvent } from '../types';

const HOURS_PER_YEAR = 2080;
const WEEKS_PER_YEAR = 52;
const HOURS_PER_WEEK = 40;
const PPL_WEEKS = 12; // 12 weeks of Paid Parental Leave

const getAnnualLeaveHours = (yearsOfService: number): number => {
  if (yearsOfService < 3) return 104; // 4 hours per PP (13 days)
  if (yearsOfService < 15) return 160; // 6 hours per PP (20 days)
  return 208; // 8 hours per PP (26 days)
};

export const calculatePPLValue = (basePay: number): number => {
  const weeklyPay = basePay / WEEKS_PER_YEAR;
  return weeklyPay * PPL_WEEKS;
};

export const calculateLeaveValue = (
  basePay: number, 
  yearsOfService: number = 0,
  pplEvents: PplEvent[] = []
) => {
  const annualLeaveHours = getAnnualLeaveHours(yearsOfService);
  const hourlyRate = basePay / HOURS_PER_YEAR;
  const pplValue = calculatePPLValue(basePay);
  
  return {
    annual: hourlyRate * annualLeaveHours,
    sick: hourlyRate * 104, // Sick leave is always 4 hours per PP
    ppl: pplEvents.length > 0 ? {
      total: pplValue * pplEvents.length,
      events: pplEvents
    } : undefined
  };
};

// Convert years and months to decimal years
export const calculateYearsOfService = (years: number, months: number): number => {
  return years + (months / 12);
};

// Check if PPL event occurs in a given year
export const isPPLEventInYear = (event: PplEvent, year: number): boolean => {
  return event.year === year;
};
