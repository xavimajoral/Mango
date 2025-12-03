import Image from 'next/image';
import Link from 'next/link';
import styles from '@/app/css/sharedPages.module.css';
import { type FixedRangeResponse, fetchFixedRange } from '@/lib/services';
import logo from '@/public/img/mango.svg';
import Exercise2 from './Exercise2';

export default async function Exercise2Page() {
  let rangeData: FixedRangeResponse | undefined;
  let error: string | null = null;

  try {
    rangeData = await fetchFixedRange();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load range data';
  }

  const header = (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src={logo}
          className={styles.image}
          width={108}
          height={18}
          alt="Mango"
          unoptimized
        />
      </Link>
      <h1 className={styles.title}>Exercise 2: Fixed Values Range</h1>
    </header>
  );

  if (error || !rangeData || rangeData.rangeValues.length === 0) {
    return (
      <>
        {header}
        <main className={styles.main}>
          <p className={styles.error}>
            Error: {error || 'Failed to load data'}
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      {header}
      <Exercise2 rangeData={rangeData} />
    </>
  );
}
