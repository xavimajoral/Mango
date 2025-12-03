import Image from 'next/image';
import Link from 'next/link';
import styles from '@/app/css/rootPage.module.css';
import logo from '@/public/img/mango.svg';

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <Image
          className={styles.image}
          src={logo}
          width={108}
          height={18}
          alt="Mango"
          unoptimized
        />
        <h1 className={styles.title}>Mango Range Component Assessment</h1>
      </header>
      <main className={styles.main}>
        <nav className={styles.navigation}>
          <Link href="/exercise1" className={styles.button}>
            Exercise 1: Normal Range
          </Link>
          <Link href="/exercise2" className={styles.button}>
            Exercise 2: Fixed Values Range
          </Link>
        </nav>
      </main>
    </>
  );
}
