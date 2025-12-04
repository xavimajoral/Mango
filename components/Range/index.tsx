'use client';

import styles from './Range.module.css';
import { useRange } from './useRange';

export interface RangeProps {
  min: number;
  max: number;
  range: [number, number];
  onChange: (range: [number, number]) => void;
  fixedValues?: number[];
}

export default function Range({
  min,
  max,
  range,
  onChange,
  fixedValues,
}: RangeProps) {
  const {
    rangeRef,
    isDragging,
    hoveredHandle,
    setHoveredHandle,
    handleMouseDown,
    handleTouchStart,
    promptValue,
    valueToPercentage,
  } = useRange({ min, max, range, onChange, fixedValues });

  const [minValue, maxValue] = range;
  const minPercentage = valueToPercentage(minValue);
  const maxPercentage = valueToPercentage(maxValue);

  const getClassName = (handle: 'min' | 'max') => {
    const base = `${styles.handle} ${styles[`handle${handle === 'min' ? 'Min' : 'Max'}`]}`;
    const isHovered = hoveredHandle === handle || isDragging === handle;
    const isActive = isDragging === handle;
    return `${base} ${isHovered ? styles.handleHover : ''} ${isActive ? styles.handleDragging : ''}`.trim();
  };

  const normalRangeLabels = (
    <>
      <button
        type="button"
        className={styles.label}
        onClick={() => promptValue('min')}
        aria-label="Set minimum value"
      >
        {`${minValue},00 €`}
      </button>
      <button
        type="button"
        className={styles.label}
        onClick={() => promptValue('max')}
        aria-label="Set maximum value"
      >
        {`${maxValue},00 €`}
      </button>
    </>
  );

  const fixedRangeLabels = (
    <>
      <span className={`${styles.label} ${styles.labelStatic}`}>
        {`${minValue.toFixed(2)} €`}
      </span>
      <span className={`${styles.label} ${styles.labelStatic}`}>
        {`${maxValue.toFixed(2)} €`}
      </span>
    </>
  );

  const fixedRangeMarks = fixedValues?.map((fixedValue) => {
    const percentage = valueToPercentage(fixedValue);
    return (
      <div
        key={fixedValue}
        className={styles.fixedValueMark}
        style={{ left: `${percentage}%` }}
        aria-hidden="true"
      />
    );
  });

  return (
    <div className={styles.rangeWrapper}>
      <div className={styles.labels}>
        {fixedValues ? fixedRangeLabels : normalRangeLabels}
      </div>
      <div ref={rangeRef} className={styles.rangeTrack}>
        {fixedValues && fixedRangeMarks}
        <div
          className={styles.rangeFill}
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />
        {(['min', 'max'] as const).map((type) => {
          const value = type === 'min' ? minValue : maxValue;
          const percentage = type === 'min' ? minPercentage : maxPercentage;
          return (
            <div
              key={type}
              className={getClassName(type)}
              style={{ left: `${percentage}%` }}
              onMouseDown={(e) => handleMouseDown(type, e)}
              onTouchStart={(e) => handleTouchStart(type, e)}
              onMouseEnter={() => setHoveredHandle(type)}
              onMouseLeave={() => setHoveredHandle(null)}
              role="slider"
              aria-label={`${type === 'min' ? 'Minimum' : 'Maximum'} value`}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value}
              tabIndex={0}
            />
          );
        })}
      </div>
    </div>
  );
}
