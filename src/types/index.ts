export interface LocalityArea {
  id: string;
  name: string;
  rate: number;
}

export interface PayRaise {
  year: number;
  percentage: number;
}

export interface PayCeiling {
  year: number;
  amount: number;
}

export const BASE_PAY_CEILING_2025 = 195200;

// MRA based on birth year
export const getMRA = (birthYear: number): number => {
  if (birthYear < 1948) return 55;
  if (birthYear < 1953) return 55 + ((birthYear - 1948) * 2) / 12;
  if (birthYear < 1964) return 56;
  if (birthYear < 1970) return 56 + ((birthYear - 1964) * 2) / 12;
  return 57;
};

// Calculate pay ceiling for future years based on average raise
export const calculateFuturePayCeiling = (year: number, baseRaise: number = AVERAGE_HISTORICAL_RAISE): number => {
  const yearDiff = year - 2025;
  if (yearDiff <= 0) return BASE_PAY_CEILING_2025;
  return BASE_PAY_CEILING_2025 * Math.pow(1 + baseRaise / 100, yearDiff);
};

export interface RetirementEligibility {
  mra: number;
  eligibleMRA10: boolean;
  eligibleImmediate: boolean;
  eligibleDeferred: boolean;
  mandatoryRetirement?: boolean;
}

export interface PplEvent {
  month: number;
  year: number;
}

export interface Benefits {
  fehb: number;
  fegli: number;
  fers: {
    basic: number;
    tsp_match: number;
    tsp_contribution: number;
  };
  leave: {
    annual: number;
    sick: number;
    ppl?: {
      total: number;
      events: PplEvent[];
    };
  };
}

export interface LongTermProjection {
  year: number;
  basePay: number;
  totalCompensation: number;
  benefits: Benefits;
  cumulativeTsp: number;
  cumulativePension: number;
  pplValue?: number; // PPL value for this specific year
}

export interface CompensationResult {
  basePay: number;
  localityPay: number;
  benefits: Benefits;
  total: number;
  projections?: LongTermProjection[];
  initialTspBalance?: number;
}

export interface TspProjection {
  year: number;
  balance: number;
  contribution: number;
  employerMatch: number;
  growth: number;
}

export const HISTORICAL_PAY_RAISES: PayRaise[] = [
  { year: 2025, percentage: 1.7 },
  { year: 2024, percentage: 4.7 },
  { year: 2023, percentage: 4.1 },
  { year: 2022, percentage: 2.2 },
  { year: 2021, percentage: 1.0 },
  { year: 2020, percentage: 2.6 },
  { year: 2019, percentage: 1.4 },
  { year: 2018, percentage: 1.4 },
  { year: 2017, percentage: 1.0 },
  { year: 2016, percentage: 1.0 },
  { year: 2015, percentage: 1.0 },
  { year: 2014, percentage: 1.0 },
  { year: 2013, percentage: 0.0 },
  { year: 2012, percentage: 0.0 },
  { year: 2011, percentage: 0.0 },
  { year: 2010, percentage: 1.5 },
  { year: 2009, percentage: 2.9 },
  { year: 2008, percentage: 2.5 }
];

// Average pay raise over the last 18 years (excluding 0% years)
export const AVERAGE_HISTORICAL_RAISE = Math.round(
  (HISTORICAL_PAY_RAISES
    .filter(raise => raise.percentage > 0)
    .reduce((acc, curr) => acc + curr.percentage, 0) / 
    HISTORICAL_PAY_RAISES.filter(raise => raise.percentage > 0).length) * 10
) / 10; // Round to 1 decimal place
