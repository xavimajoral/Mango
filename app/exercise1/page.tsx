import Image from 'next/image';
import Link from 'next/link';
import styles from '@/app/css/sharedPages.module.css';
import { fetchNormalRange, type NormalRangeResponse } from '@/lib/services';
import logo from '@/public/img/mango.svg';
import Exercise1 from './Exercise1';

export default async function Exercise1Page() {
  let rangeData: NormalRangeResponse | undefined;
  let error: string | null = null;

  try {
    rangeData = await fetchNormalRange();
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
      <h1 className={styles.title}>Exercise 1: Normal Range</h1>
    </header>
  );

  if (error || !rangeData) {
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
      <Exercise1 rangeData={rangeData} />
    </>
  );
}
