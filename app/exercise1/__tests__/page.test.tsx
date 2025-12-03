import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as services from '@/lib/services';
import Exercise1 from '../page';

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    unoptimized,
    ...props
  }: {
    src: string;
    alt: string;
    unoptimized?: boolean;
  }) => <img src={src} alt={alt} {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('Exercise1 Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with data from server component', async () => {
    const rangeData = { min: 1, max: 100 };
    vi.spyOn(services, 'fetchNormalRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise1();
    const { container } = render(page);

    await waitFor(() => {
      expect(screen.getByText(/Exercise 1: Normal Range/i)).toBeInTheDocument();
    });
  });

  it('should display range data after loading', async () => {
    const rangeData = { min: 1, max: 100 };
    vi.spyOn(services, 'fetchNormalRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise1();
    render(page);

    await waitFor(() => {
      expect(screen.getByText(/The range is from/i)).toBeInTheDocument();
    });
  });

  it('should display current range values', async () => {
    const rangeData = { min: 1, max: 100 };
    vi.spyOn(services, 'fetchNormalRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise1();
    render(page);

    await waitFor(() => {
      expect(screen.getByText(/Current Range:/i)).toBeInTheDocument();
    });
  });

  it('should render Range component with correct props', async () => {
    const rangeData = { min: 1, max: 100 };
    vi.spyOn(services, 'fetchNormalRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise1();
    render(page);

    await waitFor(() => {
      expect(
        screen.getByRole('slider', { name: /minimum/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('slider', { name: /maximum/i }),
      ).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    vi.spyOn(services, 'fetchNormalRange').mockRejectedValueOnce(
      new Error('Network error'),
    );

    const page = await Exercise1();
    render(page);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it('should have navigation link to home', async () => {
    const rangeData = { min: 1, max: 100 };
    vi.spyOn(services, 'fetchNormalRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise1();
    render(page);

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /mango/i });
      expect(link).toHaveAttribute('href', '/');
    });
  });

  it('should initialize range with fetched data', async () => {
    const rangeData = { min: 1, max: 100 };
    vi.spyOn(services, 'fetchNormalRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise1();
    render(page);

    await waitFor(() => {
      const minValues = screen.getAllByText(/1,00 €/i);
      const maxValues = screen.getAllByText(/100,00 €/i);
      expect(minValues.length).toBeGreaterThan(0);
      expect(maxValues.length).toBeGreaterThan(0);
    });
  });

  it('should display instructions text', async () => {
    const rangeData = { min: 1, max: 100 };
    vi.spyOn(services, 'fetchNormalRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise1();
    render(page);

    await waitFor(() => {
      expect(
        screen.getByText(/Drag the handles or click on the labels/i),
      ).toBeInTheDocument();
    });
  });
});
