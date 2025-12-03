'use client';

import { useState } from 'react';
import styles from '@/app/css/sharedPages.module.css';
import Range from '@/components/Range';
import type { NormalRangeResponse } from '@/lib/services';

interface Exercise1ClientProps {
  rangeData: NormalRangeResponse;
}

export default function Exercise1({ rangeData }: Exercise1ClientProps) {
  const [value, setValue] = useState<[number, number]>([
    rangeData.min,
    rangeData.max,
  ]);

  return (
    <main className={styles.main}>
      <p className={styles.intro}>
        Drag the handles or click on the labels to set new values.
        <br />
        The range is from {rangeData.min.toFixed(2)} € to{' '}
        {rangeData.max.toFixed(2)} €.
      </p>
      <div className={styles.rangeContainer}>
        <Range
          min={rangeData.min}
          max={rangeData.max}
          range={value}
          onChange={setValue}
        />
      </div>
      <p className={styles.rangeResult}>
        <strong>Current Range: </strong>
        {value[0].toFixed(2)} € - {value[1].toFixed(2)} €
      </p>
    </main>
  );
}
