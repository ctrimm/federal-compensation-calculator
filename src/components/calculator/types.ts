import { PplEvent } from '../../types';

export interface BasicInputProps {
  gsLevel: string;
  setGsLevel: (value: string) => void;
  step: string;
  setStep: (value: string) => void;
  locality: string;
  setLocality: (value: string) => void;
  serviceYears: number;
  setServiceYears: (value: number) => void;
  serviceMonths: number;
  setServiceMonths: (value: number) => void;
  currentAge: number;
  setCurrentAge: (value: number) => void;
  tspContribution: number;
  setTspContribution: (value: number) => void;
  tspGrowthRate: number;
  setTspGrowthRate: (value: number) => void;
  retirementAge: number;
  setRetirementAge: (value: number) => void;
  initialTspBalance: number;
  setInitialTspBalance: (value: number) => void;
}

export interface FineTuningProps {
  pplEvents: PplEvent[];
  setPplEvents: (events: PplEvent[]) => void;
  useBlanketRaise: boolean;
  setUseBlanketRaise: (value: boolean) => void;
  blanketRaiseValue: number;
  setBlanketRaiseValue: (value: number) => void;
  futureRaises: number[];
  setFutureRaises: (raises: number[]) => void;
  futureRaiseYears: number;
  setFutureRaiseYears: (value: number) => void;
  AVERAGE_HISTORICAL_RAISE: number;
}

export interface CompensationBreakdownProps {
  compDetails: any; // TODO: Add proper type
  showTooltip: string | null;
  setShowTooltip: (value: string | null) => void;
  tooltips: Record<string, string>;
}

export interface ProjectionsProps {
  compDetails: any; // TODO: Add proper type
}

export interface RetirementProps extends ProjectionsProps {}

export interface AnalysisProps extends ProjectionsProps {}
