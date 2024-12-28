// src/utils/calculations.ts
import { CompensationResult } from '../types';
import { calculateBasePay, calculateLocalityPay } from './base-pay';
import { calculateTSP, calculateFERS } from './retirement';
import { calculateFEHB, calculateFEGLI } from './insurance';
import { calculateLeaveValue } from './leave';

export const calculateTotalCompensation = (
  gsLevel: number, 
  step: number, 
  localityRate: number,
  tspContribution: number = 5
): CompensationResult => {
  const basePay = calculateBasePay(gsLevel, step);
  const localityPay = calculateLocalityPay(basePay, localityRate);
  const tsp = calculateTSP(basePay, tspContribution);
  const fers = calculateFERS(basePay);
  const fehb = calculateFEHB(basePay);
  const fegli = calculateFEGLI(basePay);
  const leave = calculateLeaveValue(basePay);

  return {
    basePay,
    localityPay,
    benefits: {
      fehb,
      fegli,
      fers: {
        basic: fers,
        tsp_match: tsp.match,
        tsp_contribution: tsp.contribution
      },
      leave
    },
    total: basePay + localityPay + fehb + fegli + fers + tsp.match + leave.annual + leave.sick
  };
};
