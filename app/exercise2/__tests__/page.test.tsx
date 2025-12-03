import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as services from '@/lib/services';
import Exercise2 from '../page';

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

describe('Exercise2 Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with data from server component', async () => {
    const rangeData = {
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    };
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      expect(
        screen.getByText(/Exercise 2: Fixed Values Range/i),
      ).toBeInTheDocument();
    });
  });

  it('should display range data after loading', async () => {
    const rangeData = {
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    };
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      expect(
        screen.getByText(/Exercise 2: Fixed Values Range/i),
      ).toBeInTheDocument();
    });
  });

  it('should display available fixed values', async () => {
    const rangeData = {
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    };
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      expect(screen.getByText(/Available Values:/i)).toBeInTheDocument();
      const minValues = screen.getAllByText(/1.99 €/i);
      const maxValues = screen.getAllByText(/70.99 €/i);
      expect(minValues.length).toBeGreaterThan(0);
      expect(maxValues.length).toBeGreaterThan(0);
    });
  });

  it('should display selected range', async () => {
    const rangeData = {
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    };
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      expect(screen.getByText(/Selected Range:/i)).toBeInTheDocument();
    });
  });

  it('should render Range component with fixedValues prop', async () => {
    const rangeData = {
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    };
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise2();
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

  it('should initialize with first and last fixed values', async () => {
    const rangeData = {
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    };
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      expect(screen.getByText(/1.99 € - 70.99 €/i)).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    vi.spyOn(services, 'fetchFixedRange').mockRejectedValueOnce(
      new Error('Network error'),
    );

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it('should have navigation link to home', async () => {
    const rangeData = {
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    };
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /mango/i });
      expect(link).toHaveAttribute('href', '/');
    });
  });

  it('should display instructions text', async () => {
    const rangeData = {
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    };
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      expect(
        screen.getByText(/Drag the handles to select from fixed price values/i),
      ).toBeInTheDocument();
    });
  });

  it('should handle empty rangeValues array', async () => {
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce({
      rangeValues: [],
    });

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it('should display all fixed values in available values list', async () => {
    const rangeData = {
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    };
    vi.spyOn(services, 'fetchFixedRange').mockResolvedValueOnce(rangeData);

    const page = await Exercise2();
    render(page);

    await waitFor(() => {
      const availableValuesText =
        screen.getByText(/Available Values:/i).parentElement?.textContent;
      expect(availableValuesText).toContain('1.99 €');
      expect(availableValuesText).toContain('5.99 €');
      expect(availableValuesText).toContain('10.99 €');
      expect(availableValuesText).toContain('30.99 €');
      expect(availableValuesText).toContain('50.99 €');
      expect(availableValuesText).toContain('70.99 €');
    });
  });
});
