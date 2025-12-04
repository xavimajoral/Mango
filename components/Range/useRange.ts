import { useCallback, useEffect, useRef, useState } from 'react';

interface UseRangeProps {
  min: number;
  max: number;
  range: [number, number];
  onChange: (range: [number, number]) => void;
  fixedValues?: number[];
}

export function useRange({
  min,
  max,
  range,
  onChange,
  fixedValues,
}: UseRangeProps) {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<'min' | 'max' | null>(
    null,
  );
  const rangeRef = useRef<HTMLDivElement>(null);

  const [minValue, maxValue] = range;
  const MIN_GAP = 6;

  const valueToPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = (handle: 'min' | 'max', e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleTouchStart = (handle: 'min' | 'max', e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  // Prompt new value on clicking the label for Exercise 1
  const promptValue = (type: 'min' | 'max') => {
    const currentValue = type === 'min' ? minValue : maxValue;
    const input = prompt(
      `Enter new ${type === 'min' ? 'minimum' : 'maximum'} value:`,
      Math.round(currentValue).toString(),
    );

    if (input === null) {
      return;
    }

    const numValue = parseInt(input, 10);
    if (Number.isNaN(numValue) || !Number.isFinite(numValue)) {
      return;
    }

    if (type === 'min') {
      const newMin = Math.max(min, Math.min(numValue, maxValue - MIN_GAP));
      onChange([newMin, maxValue]);
    } else {
      const newMax = Math.min(max, Math.max(numValue, minValue + MIN_GAP));
      onChange([minValue, newMax]);
    }
  };

  // Helper function to get clamped value from a mouse or touch event
  const getClampedValue = useCallback(
    (e: MouseEvent | TouchEvent): number | null => {
      if (!rangeRef.current) {
        return null;
      }
      const rect = rangeRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      if (clientX === undefined) {
        return null;
      }
      const percentage = ((clientX - rect.left) / rect.width) * 100;
      const rawValue = min + (percentage / 100) * (max - min);
      return Math.max(min, Math.min(max, rawValue));
    },
    [min, max],
  );

  // Helper function to setup and cleanup drag event listeners
  const setupDragListeners = useCallback(
    (handleMove: (e: MouseEvent | TouchEvent) => void) => {
      const handleMouseMove = (e: MouseEvent) => handleMove(e);
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        handleMove(e);
      };
      const handleMouseUp = () => setIsDragging(null);
      const handleTouchEnd = () => setIsDragging(null);

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.body.classList.add('dragging');

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.body.classList.remove('dragging');
      };
    },
    [],
  );

  // Set the range when the user is dragging the handle for the normal range scenario
  useEffect(() => {
    if (!isDragging || (fixedValues && fixedValues.length > 0)) {
      return;
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clampedValue = getClampedValue(e);
      if (clampedValue === null) {
        return;
      }

      const rounded = Math.round(clampedValue);

      if (isDragging === 'min') {
        const newMin = Math.max(min, Math.min(rounded, maxValue - MIN_GAP));
        onChange([newMin, maxValue]);
      } else if (isDragging === 'max') {
        const newMax = Math.min(max, Math.max(rounded, minValue + MIN_GAP));
        onChange([minValue, newMax]);
      }
    };

    return setupDragListeners(handleMove);
  }, [
    isDragging,
    min,
    max,
    minValue,
    maxValue,
    onChange,
    fixedValues,
    getClampedValue,
    setupDragListeners,
  ]);

  // Set the range when the user is dragging the handle for the fixed values scenario
  useEffect(() => {
    if (!isDragging || !fixedValues || fixedValues.length === 0) {
      return;
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clampedValue = getClampedValue(e);
      if (clampedValue === null) {
        return;
      }

      const nearestIndex = fixedValues.reduce((closestIndex, value, index) => {
        const currentDist = Math.abs(value - clampedValue);
        const closestDist = Math.abs(fixedValues[closestIndex] - clampedValue);
        return currentDist < closestDist ? index : closestIndex;
      }, 0);

      if (isDragging === 'min') {
        const maxIndex = fixedValues.indexOf(maxValue);
        const newMinIndex = Math.min(nearestIndex, maxIndex - 1);
        onChange([fixedValues[newMinIndex], maxValue]);
      } else if (isDragging === 'max') {
        const minIndex = fixedValues.indexOf(minValue);
        const newMaxIndex = Math.max(nearestIndex, minIndex + 1);
        onChange([minValue, fixedValues[newMaxIndex]]);
      }
    };

    return setupDragListeners(handleMove);
  }, [
    isDragging,
    minValue,
    maxValue,
    onChange,
    fixedValues,
    getClampedValue,
    setupDragListeners,
  ]);

  return {
    rangeRef,
    isDragging,
    hoveredHandle,
    setHoveredHandle,
    handleMouseDown,
    handleTouchStart,
    promptValue,
    valueToPercentage,
  };
}
