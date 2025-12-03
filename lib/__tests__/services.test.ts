import { describe, expect, it } from 'vitest';
import {
  type FixedRangeResponse,
  fetchFixedRange,
  fetchNormalRange,
  type NormalRangeResponse,
} from '../services';

describe('Services', () => {
  describe('fetchNormalRange', () => {
    it('should return normal range response with min and max', async () => {
      const result = await fetchNormalRange();

      expect(result).toEqual({
        min: 1,
        max: 100,
      });
      expect(result.min).toBe(1);
      expect(result.max).toBe(100);
    });

    it('should have correct type', async () => {
      const result: NormalRangeResponse = await fetchNormalRange();

      expect(typeof result.min).toBe('number');
      expect(typeof result.max).toBe('number');
    });
  });

  describe('fetchFixedRange', () => {
    it('should return fixed range response with array of values', async () => {
      const result = await fetchFixedRange();

      expect(result).toEqual({
        rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
      });
      expect(result.rangeValues).toHaveLength(6);
    });

    it('should have correct type', async () => {
      const result: FixedRangeResponse = await fetchFixedRange();

      expect(Array.isArray(result.rangeValues)).toBe(true);
      expect(result.rangeValues.every((v) => typeof v === 'number')).toBe(true);
    });

    it('should return values in ascending order', async () => {
      const result = await fetchFixedRange();

      const sorted = [...result.rangeValues].sort((a, b) => a - b);
      expect(result.rangeValues).toEqual(sorted);
    });

    it('should return all values as numbers', async () => {
      const result = await fetchFixedRange();

      result.rangeValues.forEach((value) => {
        expect(typeof value).toBe('number');
        expect(Number.isFinite(value)).toBe(true);
      });
    });
  });
});
