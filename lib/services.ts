// Mock HTTP services and Types for the Range component

export interface NormalRangeResponse {
  min: number;
  max: number;
}

export interface FixedRangeResponse {
  rangeValues: number[];
}

/**
 * Mock service for Exercise 1: Normal Range
 * Returns minimum and maximum values for the range
 */
export async function fetchNormalRange(): Promise<NormalRangeResponse> {
  return {
    min: 1,
    max: 100,
  };
}

/**
 * Mock service for Exercise 2: Fixed Values Range
 * Returns an array of fixed values
 */
export async function fetchFixedRange(): Promise<FixedRangeResponse> {
  return {
    rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
  };
}
