// src/utils/insurance.ts
export const calculateFEHB = (basePay: number) => {
  return basePay * 0.07;
};

export const calculateFEGLI = (basePay: number) => {
  return basePay * 0.002;
};
