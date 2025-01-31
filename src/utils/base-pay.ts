// src/utils/base-pay.ts
import { BASE_PAY_CEILING_2025, calculateFuturePayCeiling, AVERAGE_HISTORICAL_RAISE } from '../types';

type GSPayTable = {
  [key: number]: number[];
};

const currentYear = new Date().getFullYear();

const gsPayTable: GSPayTable = {
  1: [21403, 22117, 22828, 23535, 24246, 24678, 25381, 26091, 26114, 26775],
  2: [24075, 24690, 25485, 26114, 26435, 27188, 27941, 28694, 29447, 30200],
  3: [26275, 27151, 28027, 28903, 29779, 30655, 31531, 32407, 33283, 34159],
  4: [29497, 30480, 31463, 32446, 33429, 34412, 35395, 36378, 37361, 38344],
  5: [32991, 34090, 35189, 36288, 37387, 38486, 39585, 40684, 41783, 42882],
  6: [36769, 37995, 39221, 40447, 41673, 42899, 44125, 45351, 46577, 47803],
  7: [40858, 42220, 43582, 44944, 46306, 47668, 49030, 50392, 51754, 53116],
  8: [45297, 46807, 48317, 49827, 51337, 52847, 54357, 55867, 57377, 58887],
  9: [50112, 51783, 53454, 55125, 56796, 58467, 60138, 61809, 63480, 65151],
  10: [55246, 57088, 58930, 60772, 62614, 64456, 66298, 68140, 69982, 71824],
  11: [60733, 62758, 64783, 66808, 68833, 70858, 72883, 74908, 76933, 78958],
  12: [72750, 75175, 77600, 80025, 82450, 84875, 87300, 89725, 92150, 94575],
  13: [86524, 89408, 92292, 95176, 98060, 100944, 103828, 106712, 109596, 112480],
  14: [102221, 105628, 109035, 112442, 115849, 119256, 122663, 126070, 129477, 132884],
  15: [120264, 124273, 128282, 132291, 136300, 140309, 144318, 148327, 152336, 156345],
};

export const calculateBasePay = (
  gsLevel: number, 
  step: number, 
  year: number = currentYear,
  baseRaise: number = AVERAGE_HISTORICAL_RAISE
): number => {
  const rawBasePay = Number((gsPayTable[gsLevel]?.[step - 1] || 0).toFixed(2));
  const ceiling = calculateFuturePayCeiling(year, baseRaise);
  return Math.min(rawBasePay, ceiling);
};

export const calculateLocalityPay = (
  basePay: number, 
  localityRate: number, 
  year: number = currentYear,
  baseRaise: number = AVERAGE_HISTORICAL_RAISE
): number => {
  const rawLocalityPay = Number((basePay * (localityRate / 100)).toFixed(2));
  const ceiling = calculateFuturePayCeiling(year, baseRaise);
  // Total pay (base + locality) cannot exceed ceiling
  return Math.min(rawLocalityPay, ceiling - basePay);
};

// Calculate total pay with ceiling enforcement
export const calculateTotalPay = (
  gsLevel: number, 
  step: number, 
  localityRate: number, 
  year: number = currentYear,
  baseRaise: number = AVERAGE_HISTORICAL_RAISE
): { basePay: number; localityPay: number } => {
  const rawBasePay = calculateBasePay(gsLevel, step, year, baseRaise);
  const rawLocalityPay = calculateLocalityPay(rawBasePay, localityRate, year, baseRaise);
  const totalPay = rawBasePay + rawLocalityPay;
  const ceiling = calculateFuturePayCeiling(year, baseRaise);

  if (totalPay <= ceiling) {
    return { basePay: rawBasePay, localityPay: rawLocalityPay };
  }

  // If total exceeds ceiling, adjust locality pay down
  const adjustedLocalityPay = ceiling - rawBasePay;
  return { basePay: rawBasePay, localityPay: Math.max(0, adjustedLocalityPay) };
};
