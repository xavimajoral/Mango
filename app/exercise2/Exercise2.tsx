'use client';

import { useState } from 'react';
import styles from '@/app/css/sharedPages.module.css';
import Range from '@/components/Range';
import type { FixedRangeResponse } from '@/lib/services';

interface Exercise2ClientProps {
  rangeData: FixedRangeResponse;
}

export default function Exercise2({ rangeData }: Exercise2ClientProps) {
  const [value, setValue] = useState<[number, number]>([
    rangeData.rangeValues[0],
    rangeData.rangeValues[rangeData.rangeValues.length - 1],
  ]);

  const min = Math.min(...rangeData.rangeValues);
  const max = Math.max(...rangeData.rangeValues);

  return (
    <main className={styles.main}>
      <p className={styles.intro}>
        Drag the handles to select from fixed price values.
      </p>
      <div className={styles.rangeContainer}>
        <Range
          min={min}
          max={max}
          fixedValues={rangeData.rangeValues}
          range={value}
          onChange={setValue}
        />
      </div>
      <div className={styles.rangeResult}>
        <p>
          <strong>Available Values: </strong>
          {rangeData.rangeValues.map((val) => `${val.toFixed(2)} €`).join(', ')}
        </p>
        <p style={{ marginBottom: '0' }}>
          <strong>Selected Range: </strong>
          {`${value[0].toFixed(2)} € - ${value[1].toFixed(2)} €`}
        </p>
      </div>
    </main>
  );
}
