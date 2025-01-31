// src/utils/calculations.ts
import { CompensationResult, LongTermProjection, AVERAGE_HISTORICAL_RAISE, PplEvent } from '../types';
import { calculateBasePay, calculateLocalityPay, calculateTotalPay } from './base-pay';
import { calculateTSP, calculateFERS } from './retirement';
import { calculateFEHB, calculateFEGLI } from './insurance';
import { calculateLeaveValue, calculateYearsOfService, isPPLEventInYear } from './leave';

const FEHB_GROWTH_RATE = 0.05; // 5% annual healthcare cost increase

export const calculateTotalCompensation = (
  gsLevel: number, 
  step: number, 
  localityRate: number,
  tspContribution: number = 5,
  serviceYears: number = 0,
  serviceMonths: number = 0,
  pplEvents: PplEvent[] = [],
  futureRaises: number[] = [],
  tspGrowthRate: number = 7,
  retirementAge: number = 62,
  currentAge: number = 30,
  useBlanketRaise: boolean = false,
  blanketRaiseValue: number = AVERAGE_HISTORICAL_RAISE,
  initialTspBalance: number = 0
): CompensationResult => {
  const yearsOfService = calculateYearsOfService(serviceYears, serviceMonths);
  const { basePay, localityPay } = calculateTotalPay(gsLevel, step, localityRate);
  const tsp = calculateTSP(basePay, tspContribution);
  const fers = calculateFERS(basePay);
  const fehb = calculateFEHB(basePay);
  const fegli = calculateFEGLI(basePay);
  const leave = calculateLeaveValue(basePay, yearsOfService, pplEvents);

  // Always calculate projections
  const projections = calculateProjections(
    basePay,
    localityRate,
    tspContribution,
    yearsOfService,
    futureRaises,
    tspGrowthRate,
    pplEvents,
    gsLevel,
    step,
    useBlanketRaise,
    blanketRaiseValue,
    initialTspBalance
  );

  const pplTotal = leave.ppl?.total || 0;

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
    total: basePay + localityPay + fehb + fegli + fers + tsp.match + leave.annual + leave.sick + pplTotal,
    projections
  };
};

const calculateProjections = (
  currentBasePay: number,
  localityRate: number,
  tspContribution: number,
  currentYearsOfService: number,
  futureRaises: number[],
  tspGrowthRate: number,
  pplEvents: PplEvent[],
  gsLevel: number,
  step: number,
  useBlanketRaise: boolean = false,
  blanketRaiseValue: number = AVERAGE_HISTORICAL_RAISE,
  initialTspBalance: number = 0
): LongTermProjection[] => {
  let projections: LongTermProjection[] = [];
  let cumulativeTsp = initialTspBalance;
  let currentPay = currentBasePay;
  const currentYear = new Date().getFullYear();

  for (let year = 0; year < 30; year++) {
    const thisYear = currentYear + year;

    // Calculate raise percentage for this year
    const raisePercentage = useBlanketRaise 
      ? blanketRaiseValue 
      : (futureRaises[year] ?? AVERAGE_HISTORICAL_RAISE);
    
    // Apply raise to base pay
    let raisedBasePay = currentPay * (1 + raisePercentage / 100);

    // Get pay ceiling and locality adjustment using historical average
    const { basePay: ceilingBasePay, localityPay: ceilingLocalityPay } = 
      calculateTotalPay(gsLevel, step, localityRate, thisYear, AVERAGE_HISTORICAL_RAISE);
    
    // Use the lower of the raised pay or ceiling base pay
    currentPay = Math.min(raisedBasePay, ceilingBasePay);

    // Calculate locality pay proportionally
    const currentLocalityPay = (currentPay / ceilingBasePay) * ceilingLocalityPay;

    console.log(`Year ${thisYear} pay calculation:`, {
      currentPayBefore: currentPay,
      raisePercentage,
      raisedBasePay,
      ceilingBasePay,
      ceilingLocalityPay,
      finalBasePay: currentPay,
      finalLocalityPay: currentLocalityPay,
      totalPay: currentPay + currentLocalityPay
    });


    // Calculate benefits for this year
    const yearlyTsp = calculateTSP(currentPay, tspContribution);
    const yearlyFers = calculateFERS(currentPay);
    const yearlyFehb = calculateFEHB(currentPay) * Math.pow(1 + FEHB_GROWTH_RATE, year);
    const yearlyFegli = calculateFEGLI(currentPay);
    
    // Filter PPL events for this year
    const yearPplEvents = pplEvents.filter(event => isPPLEventInYear(event, thisYear));
    const yearlyLeave = calculateLeaveValue(currentPay, currentYearsOfService + year, yearPplEvents);

    // Calculate TSP growth
    const tspContributionTotal = yearlyTsp.contribution + yearlyTsp.match;
    const previousBalance = cumulativeTsp;
    const tspGrowthAmount = previousBalance * (tspGrowthRate / 100);
    cumulativeTsp = previousBalance + tspGrowthAmount + tspContributionTotal;

    console.log(`Year ${thisYear} TSP calculation:`, {
      previousBalance,
      contribution: yearlyTsp.contribution,
      employerMatch: yearlyTsp.match,
      growthAmount: tspGrowthAmount,
      newBalance: cumulativeTsp
    });

    // Calculate pension value (1% per year of service)
    const pensionPercentage = Math.min(currentYearsOfService + year, 30) / 100;
    const yearlyPension = currentPay * pensionPercentage;

    const benefits = {
      fehb: yearlyFehb,
      fegli: yearlyFegli,
      fers: {
        basic: yearlyFers,
        tsp_match: yearlyTsp.match,
        tsp_contribution: yearlyTsp.contribution
      },
      leave: yearlyLeave
    };

    const pplValue = yearlyLeave.ppl?.total || 0;

    const totalCompensation = 
      currentPay + 
      currentLocalityPay +
      yearlyFehb + 
      yearlyFegli + 
      yearlyFers + 
      yearlyTsp.match + 
      yearlyLeave.annual + 
      yearlyLeave.sick +
      pplValue;

    console.log(`Year ${thisYear} benefits:`, {
      yearlyFehb,
      yearlyFegli,
      yearlyFers,
      yearlyTsp: yearlyTsp.match,
      yearlyLeave: yearlyLeave.annual + yearlyLeave.sick,
      pplValue,
      totalCompensation
    });

    projections.push({
      year: thisYear,
      basePay: currentPay,
      totalCompensation,
      benefits,
      cumulativeTsp,
      cumulativePension: yearlyPension,
      pplValue
    });
  }

  return projections;
};
