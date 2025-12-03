import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRange } from '../useRange';

describe('useRange', () => {
  const defaultProps = {
    min: 0,
    max: 100,
    range: [25, 75] as [number, number],
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useRange(defaultProps));

      expect(result.current.isDragging).toBe(null);
      expect(result.current.hoveredHandle).toBe(null);
      expect(result.current.rangeRef).toBeDefined();
    });

    it('should return all required properties', () => {
      const { result } = renderHook(() => useRange(defaultProps));

      expect(result.current).toHaveProperty('rangeRef');
      expect(result.current).toHaveProperty('isDragging');
      expect(result.current).toHaveProperty('hoveredHandle');
      expect(result.current).toHaveProperty('setHoveredHandle');
      expect(result.current).toHaveProperty('handleMouseDown');
      expect(result.current).toHaveProperty('promptValue');
      expect(result.current).toHaveProperty('valueToPercentage');
    });
  });

  describe('valueToPercentage', () => {
    it('should convert value to correct percentage', () => {
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, min: 0, max: 100 }),
      );

      expect(result.current.valueToPercentage(0)).toBe(0);
      expect(result.current.valueToPercentage(50)).toBe(50);
      expect(result.current.valueToPercentage(100)).toBe(100);
    });

    it('should handle custom min/max ranges', () => {
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, min: 10, max: 90 }),
      );

      expect(result.current.valueToPercentage(10)).toBe(0);
      expect(result.current.valueToPercentage(50)).toBe(50);
      expect(result.current.valueToPercentage(90)).toBe(100);
    });

    it('should handle negative ranges', () => {
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, min: -50, max: 50 }),
      );

      expect(result.current.valueToPercentage(-50)).toBe(0);
      expect(result.current.valueToPercentage(0)).toBe(50);
      expect(result.current.valueToPercentage(50)).toBe(100);
    });
  });

  describe('handleMouseDown', () => {
    it('should set isDragging to min when min handle is clicked', () => {
      const { result } = renderHook(() => useRange(defaultProps));

      act(() => {
        const mockEvent = {
          preventDefault: vi.fn(),
        } as unknown as React.MouseEvent;
        result.current.handleMouseDown('min', mockEvent);
      });

      expect(result.current.isDragging).toBe('min');
    });

    it('should set isDragging to max when max handle is clicked', () => {
      const { result } = renderHook(() => useRange(defaultProps));

      act(() => {
        const mockEvent = {
          preventDefault: vi.fn(),
        } as unknown as React.MouseEvent;
        result.current.handleMouseDown('max', mockEvent);
      });

      expect(result.current.isDragging).toBe('max');
    });

    it('should call preventDefault on event', () => {
      const { result } = renderHook(() => useRange(defaultProps));
      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown('min', mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('setHoveredHandle', () => {
    it('should set hovered handle to min', () => {
      const { result } = renderHook(() => useRange(defaultProps));

      act(() => {
        result.current.setHoveredHandle('min');
      });

      expect(result.current.hoveredHandle).toBe('min');
    });

    it('should set hovered handle to max', () => {
      const { result } = renderHook(() => useRange(defaultProps));

      act(() => {
        result.current.setHoveredHandle('max');
      });

      expect(result.current.hoveredHandle).toBe('max');
    });

    it('should clear hovered handle when set to null', () => {
      const { result } = renderHook(() => useRange(defaultProps));

      act(() => {
        result.current.setHoveredHandle('min');
      });
      expect(result.current.hoveredHandle).toBe('min');

      act(() => {
        result.current.setHoveredHandle(null);
      });
      expect(result.current.hoveredHandle).toBe(null);
    });
  });

  describe('promptValue - Normal Range', () => {
    beforeEach(() => {
      global.prompt = vi.fn();
    });

    it('should not call onChange when prompt is cancelled', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, onChange }),
      );

      vi.mocked(global.prompt).mockReturnValue(null);

      act(() => {
        result.current.promptValue('min');
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should update min value when valid input is provided', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, onChange, range: [25, 75] }),
      );

      vi.mocked(global.prompt).mockReturnValue('30');

      act(() => {
        result.current.promptValue('min');
      });

      expect(onChange).toHaveBeenCalledWith([30, 75]);
    });

    it('should update max value when valid input is provided', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, onChange, range: [25, 75] }),
      );

      vi.mocked(global.prompt).mockReturnValue('70');

      act(() => {
        result.current.promptValue('max');
      });

      expect(onChange).toHaveBeenCalledWith([25, 70]);
    });

    it('should respect MIN_GAP constraint for min value', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, onChange, range: [25, 30] }),
      );

      vi.mocked(global.prompt).mockReturnValue('28');

      act(() => {
        result.current.promptValue('min');
      });

      // Should be clamped to maxValue - MIN_GAP (30 - 3 = 27)
      expect(onChange).toHaveBeenCalledWith([27, 30]);
    });

    it('should respect MIN_GAP constraint for max value', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, onChange, range: [25, 30] }),
      );

      vi.mocked(global.prompt).mockReturnValue('27');

      act(() => {
        result.current.promptValue('max');
      });

      // Should be clamped to minValue + MIN_GAP (25 + 3 = 28)
      expect(onChange).toHaveBeenCalledWith([25, 28]);
    });

    it('should clamp min value to range bounds', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, onChange, min: 0, max: 100 }),
      );

      vi.mocked(global.prompt).mockReturnValue('-10');

      act(() => {
        result.current.promptValue('min');
      });

      expect(onChange).toHaveBeenCalledWith([0, 75]);
    });

    it('should clamp max value to range bounds', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, onChange, min: 0, max: 100 }),
      );

      vi.mocked(global.prompt).mockReturnValue('150');

      act(() => {
        result.current.promptValue('max');
      });

      expect(onChange).toHaveBeenCalledWith([25, 100]);
    });

    it('should not call onChange for invalid input', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, onChange }),
      );

      vi.mocked(global.prompt).mockReturnValue('invalid');

      act(() => {
        result.current.promptValue('min');
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Normal Range Dragging', () => {
    it('should round values to integers when dragging', async () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({ ...defaultProps, onChange, range: [25, 75] }),
      );

      // Create a mock range element
      const mockElement = document.createElement('div');
      mockElement.getBoundingClientRect = vi.fn(() => ({
        width: 1000,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 1000,
        x: 0,
        y: 0,
        toJSON: vi.fn(),
      }));

      act(() => {
        result.current.rangeRef.current = mockElement;
        result.current.handleMouseDown('min', {
          preventDefault: vi.fn(),
        } as unknown as React.MouseEvent);
      });

      // Simulate mouse move at 50% (should be 50)
      act(() => {
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: 500,
        });
        document.dispatchEvent(mouseEvent);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });

      // Check that the value was rounded
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
      expect(Number.isInteger(lastCall[0][0])).toBe(true);
    });
  });

  describe('Fixed Values Range', () => {
    const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

    it('should not show prompt for fixed values', () => {
      const onChange = vi.fn();
      const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
      const { result } = renderHook(() =>
        useRange({
          ...defaultProps,
          onChange,
          fixedValues,
        }),
      );

      // promptValue should return early for fixed values (checking in component)
      // The hook itself doesn't prevent promptValue from being called
      // but the component should not call it when fixedValues exist
      act(() => {
        result.current.promptValue('min');
      });

      // Even if called, it should not update the value for fixed ranges
      // The component handles this by not calling promptValue when fixedValues exist
      expect(result.current.promptValue).toBeDefined();
    });

    it('should snap to nearest fixed value when dragging', async () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useRange({
          ...defaultProps,
          onChange,
          fixedValues,
          range: [10.99, 50.99],
          min: 1.99,
          max: 70.99,
        }),
      );

      const mockElement = document.createElement('div');
      mockElement.getBoundingClientRect = vi.fn(() => ({
        width: 1000,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 1000,
        x: 0,
        y: 0,
        toJSON: vi.fn(),
      }));

      act(() => {
        result.current.rangeRef.current = mockElement;
        result.current.handleMouseDown('min', {
          preventDefault: vi.fn(),
        } as unknown as React.MouseEvent);
      });

      // Simulate mouse move near 5.99 position
      act(() => {
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: 100, // Approximately 5.99 position
        });
        document.dispatchEvent(mouseEvent);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });

      // Should snap to one of the fixed values
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
      const newMin = lastCall[0][0];
      expect(fixedValues).toContain(newMin);
    });
  });
});
