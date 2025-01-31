import React, { useState, useEffect } from 'react';
import { calculateTotalCompensation } from '../utils/calculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LocalityArea, CompensationResult, AVERAGE_HISTORICAL_RAISE, PplEvent, getMRA } from '../types';
import { InputTabs } from './calculator/InputTabs';
import { CompensationBreakdown } from './calculator/CompensationBreakdown';
import { Projections } from './calculator/Projections';
import { Retirement } from './calculator/Retirement';
import { Analysis } from './calculator/Analysis';

const CompensationCalculator: React.FC = () => {
  const [gsLevel, setGsLevel] = useState<string>('');
  const [step, setStep] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [totalComp, setTotalComp] = useState<number>(0);
  const [compDetails, setCompDetails] = useState<CompensationResult | null>(null);
  const [tspContribution, setTspContribution] = useState<number>(5);
  const [tspGrowthRate, setTspGrowthRate] = useState<number>(7);
  const [retirementAge, setRetirementAge] = useState<number>(62);
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [serviceYears, setServiceYears] = useState<number>(0);
  const [serviceMonths, setServiceMonths] = useState<number>(0);
  const [pplEvents, setPplEvents] = useState<PplEvent[]>([]);
  const [useBlanketRaise, setUseBlanketRaise] = useState<boolean>(false);
  const [blanketRaiseValue, setBlanketRaiseValue] = useState<number>(AVERAGE_HISTORICAL_RAISE);
  const [initialTspBalance, setInitialTspBalance] = useState<number>(0);
  const [futureRaises, setFutureRaises] = useState<number[]>([]);
  const [futureRaiseYears, setFutureRaiseYears] = useState<number>(3);

  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - currentAge;
  const mra = getMRA(birthYear);

  // Calculate retirement eligibility
  const yearsOfService = Math.round((serviceYears + (serviceMonths / 12)) * 10) / 10;
  const eligibleMRA10 = currentAge >= mra && yearsOfService >= 10;
  const eligibleImmediate = currentAge >= mra && yearsOfService >= 30;
  const eligibleDeferred = yearsOfService >= 5;

  // Format remaining years/service needed
  const formatRemaining = (value: number) => Math.ceil(value);

  const tooltips: Record<string, string> = {
    'Base Pay': "Base salary determined by GS level and step",
    'Locality Pay': "Additional pay based on your geographic location",
    'FEHB': "Federal Employees Health Benefits - Government pays ~72% of premiums",
    'FEGLI': "Federal Employees Group Life Insurance - Basic coverage at low cost",
    'FERS Basic': "Federal Employees Retirement System - Defined benefit pension plan",
    'TSP Match': "Government matches up to 5% of your base pay contribution",
    'Leave Value': "Monetary value of annual & sick leave accrual",
    'PPL Value': "Value of Paid Parental Leave events"
  };

  const localityAreas: LocalityArea[] = [
    { id: 'DC', name: 'Washington-Baltimore-Arlington, DC-MD-VA-WV-PA', rate: 32.49 },
    { id: 'SF', name: 'San Francisco-Oakland-San Jose, CA', rate: 42.74 },
    { id: 'NYC', name: 'New York-Newark, NY-NJ-CT-PA', rate: 35.28 },
  ];

  const handleCalculate = () => {
    if (!gsLevel || !step || !locality) return;
    
    const localityRate = localityAreas.find(l => l.id === locality)?.rate || 0;

    console.log('Calculating with:', {
      gsLevel,
      step,
      localityRate,
      tspContribution,
      serviceYears,
      serviceMonths,
      pplEvents,
      futureRaises,
      tspGrowthRate,
      retirementAge,
      currentAge,
      useBlanketRaise,
      blanketRaiseValue
    });

    const result = calculateTotalCompensation(
      parseInt(gsLevel), 
      parseInt(step), 
      localityRate,
      tspContribution,
      serviceYears,
      serviceMonths,
      pplEvents,
      futureRaises,
      tspGrowthRate,
      retirementAge,
      currentAge,
      useBlanketRaise,
      blanketRaiseValue,
      initialTspBalance
    );

    console.log('Calculation result:', {
      total: result.total,
      basePay: result.basePay,
      localityPay: result.localityPay,
      projections: {
        count: result.projections?.length,
        first: result.projections?.[0],
        last: result.projections?.[result.projections?.length - 1]
      }
    });

    setTotalComp(result.total);
    setCompDetails(result);
  };

  useEffect(() => {
    handleCalculate();
  }, [
    gsLevel, step, locality, tspContribution, serviceYears, serviceMonths,
    pplEvents, futureRaises, tspGrowthRate, retirementAge, currentAge,
    useBlanketRaise, blanketRaiseValue, initialTspBalance
  ]);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Federal Employee Total Compensation Calculator</CardTitle>
          <CardDescription>Calculate your total compensation package including benefits and locality pay</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Details</CardTitle>
          </CardHeader>
          <CardContent>
              <InputTabs
                gsLevel={gsLevel}
                setGsLevel={setGsLevel}
                step={step}
                setStep={setStep}
                locality={locality}
                setLocality={setLocality}
                serviceYears={serviceYears}
                setServiceYears={setServiceYears}
                serviceMonths={serviceMonths}
                setServiceMonths={setServiceMonths}
                currentAge={currentAge}
                setCurrentAge={setCurrentAge}
                tspContribution={tspContribution}
                setTspContribution={setTspContribution}
                tspGrowthRate={tspGrowthRate}
                setTspGrowthRate={setTspGrowthRate}
                retirementAge={retirementAge}
                setRetirementAge={setRetirementAge}
                initialTspBalance={initialTspBalance}
                setInitialTspBalance={setInitialTspBalance}
                pplEvents={pplEvents}
                setPplEvents={setPplEvents}
                useBlanketRaise={useBlanketRaise}
                setUseBlanketRaise={setUseBlanketRaise}
                blanketRaiseValue={blanketRaiseValue}
                setBlanketRaiseValue={setBlanketRaiseValue}
                futureRaises={futureRaises}
                setFutureRaises={setFutureRaises}
                futureRaiseYears={futureRaiseYears}
                setFutureRaiseYears={setFutureRaiseYears}
                localityAreas={localityAreas}
                currentYear={currentYear}
                mra={mra}
                eligibleMRA10={eligibleMRA10}
                eligibleImmediate={eligibleImmediate}
                eligibleDeferred={eligibleDeferred}
                formatRemaining={formatRemaining}
                yearsOfService={yearsOfService}
                AVERAGE_HISTORICAL_RAISE={AVERAGE_HISTORICAL_RAISE}
              />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>"Make Me Quit" Number</CardTitle>
            <CardDescription>Your total compensation package value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold text-center p-8">
              ${totalComp.toLocaleString()}
            </div>
            {compDetails && (
              <CompensationBreakdown
                compDetails={compDetails}
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
                tooltips={tooltips}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="mt-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="current">Current Benefits</TabsTrigger>
          <TabsTrigger value="projections">Future Growth</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Total Compensation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {compDetails && (
                  <Analysis compDetails={compDetails} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections">
          <Projections compDetails={compDetails} />
        </TabsContent>

        <TabsContent value="retirement">
          <Retirement compDetails={compDetails} />
        </TabsContent>

        <TabsContent value="details">
          <Analysis compDetails={compDetails} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompensationCalculator;
