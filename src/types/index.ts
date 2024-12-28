export interface LocalityArea {
  id: string;
  name: string;
  rate: number;
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
  };
}

export interface CompensationResult {
  basePay: number;
  localityPay: number;
  benefits: Benefits;
  total: number;
}
