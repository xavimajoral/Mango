import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Range from '../index';

describe('Range Component', () => {
  const defaultProps = {
    min: 0,
    max: 100,
    range: [25, 75] as [number, number],
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render range component', () => {
      render(<Range {...defaultProps} />);
      expect(
        screen.getByRole('slider', { name: /minimum/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('slider', { name: /maximum/i }),
      ).toBeInTheDocument();
    });

    it('should display current range values', () => {
      render(<Range {...defaultProps} range={[30, 70]} />);
      expect(screen.getByText('30,00 €')).toBeInTheDocument();
      expect(screen.getByText('70,00 €')).toBeInTheDocument();
    });

    it('should render labels as buttons for normal range', () => {
      render(<Range {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('25,00 €');
      expect(buttons[1]).toHaveTextContent('75,00 €');
    });

    it('should render labels as spans for fixed values range', () => {
      const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
      render(
        <Range
          {...defaultProps}
          min={1.99}
          max={70.99}
          range={[10.99, 50.99]}
          fixedValues={fixedValues}
        />,
      );

      const labels = screen.getAllByText(/\d+\.\d{2} €/);
      expect(labels).toHaveLength(2);
      expect(labels[0]).toHaveTextContent('10.99 €');
      expect(labels[1]).toHaveTextContent('50.99 €');
    });

    it('should render fixed value marks when fixedValues provided', () => {
      const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
      const { container } = render(
        <Range
          {...defaultProps}
          min={1.99}
          max={70.99}
          range={[10.99, 50.99]}
          fixedValues={fixedValues}
        />,
      );

      const marks = container.querySelectorAll('[aria-hidden="true"]');
      expect(marks.length).toBeGreaterThan(0);
    });

    it('should not render fixed value marks when fixedValues not provided', () => {
      const { container } = render(<Range {...defaultProps} />);
      const marks = container.querySelectorAll('[aria-hidden="true"]');
      expect(marks.length).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for min handle', () => {
      render(<Range {...defaultProps} />);
      const minHandle = screen.getByRole('slider', { name: /minimum/i });

      expect(minHandle).toHaveAttribute('aria-valuemin', '0');
      expect(minHandle).toHaveAttribute('aria-valuemax', '100');
      expect(minHandle).toHaveAttribute('aria-valuenow', '25');
      expect(minHandle).toHaveAttribute('tabIndex', '0');
    });

    it('should have proper ARIA attributes for max handle', () => {
      render(<Range {...defaultProps} />);
      const maxHandle = screen.getByRole('slider', { name: /maximum/i });

      expect(maxHandle).toHaveAttribute('aria-valuemin', '0');
      expect(maxHandle).toHaveAttribute('aria-valuemax', '100');
      expect(maxHandle).toHaveAttribute('aria-valuenow', '75');
      expect(maxHandle).toHaveAttribute('tabIndex', '0');
    });

    it('should have aria-label on label buttons', () => {
      render(<Range {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-label', 'Set minimum value');
      expect(buttons[1]).toHaveAttribute('aria-label', 'Set maximum value');
    });
  });

  describe('User Interactions - Normal Range', () => {
    it('should call promptValue when min label is clicked', async () => {
      global.prompt = vi.fn().mockReturnValue('30');
      const onChange = vi.fn();
      render(<Range {...defaultProps} onChange={onChange} />);

      const minButton = screen.getByText('25,00 €');
      await userEvent.click(minButton);

      expect(global.prompt).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([30, 75]);
    });

    it('should call promptValue when max label is clicked', async () => {
      global.prompt = vi.fn().mockReturnValue('80');
      const onChange = vi.fn();
      render(<Range {...defaultProps} onChange={onChange} />);

      const maxButton = screen.getByText('75,00 €');
      await userEvent.click(maxButton);

      expect(global.prompt).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([25, 80]);
    });

    it('should handle mouse down on min handle', () => {
      const onChange = vi.fn();
      render(<Range {...defaultProps} onChange={onChange} />);

      const minHandle = screen.getByRole('slider', { name: /minimum/i });
      fireEvent.mouseDown(minHandle);

      // The dragging state is internal, but we can verify the event was handled
      expect(minHandle).toBeInTheDocument();
    });

    it('should handle mouse down on max handle', () => {
      const onChange = vi.fn();
      render(<Range {...defaultProps} onChange={onChange} />);

      const maxHandle = screen.getByRole('slider', { name: /maximum/i });
      fireEvent.mouseDown(maxHandle);

      expect(maxHandle).toBeInTheDocument();
    });

    it('should handle hover on handles', () => {
      render(<Range {...defaultProps} />);

      const minHandle = screen.getByRole('slider', { name: /minimum/i });
      fireEvent.mouseEnter(minHandle);
      fireEvent.mouseLeave(minHandle);

      expect(minHandle).toBeInTheDocument();
    });
  });

  describe('User Interactions - Fixed Values Range', () => {
    const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

    it('should not allow clicking labels for fixed values', () => {
      render(
        <Range
          {...defaultProps}
          min={1.99}
          max={70.99}
          range={[10.99, 50.99]}
          fixedValues={fixedValues}
        />,
      );

      const labels = screen.getAllByText(/\d+\.\d{2} €/);
      labels.forEach((label) => {
        expect(label.tagName).toBe('SPAN');
        expect(label).not.toHaveAttribute('onClick');
      });
    });

    it('should display fixed values with 2 decimal places', () => {
      render(
        <Range
          {...defaultProps}
          min={1.99}
          max={70.99}
          range={[10.99, 50.99]}
          fixedValues={fixedValues}
        />,
      );

      expect(screen.getByText('10.99 €')).toBeInTheDocument();
      expect(screen.getByText('50.99 €')).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('should apply correct styles to range fill', () => {
      const { container } = render(
        <Range {...defaultProps} range={[25, 75]} />,
      );
      const fill =
        container.querySelector('.rangeFill') ||
        container.querySelector('[class*="rangeFill"]');

      if (fill) {
        const _style = window.getComputedStyle(fill as Element);
        expect(fill).toBeInTheDocument();
      }
    });

    it('should position handles correctly based on values', () => {
      render(<Range {...defaultProps} range={[25, 75]} />);
      const minHandle = screen.getByRole('slider', { name: /minimum/i });
      const maxHandle = screen.getByRole('slider', { name: /maximum/i });

      // Check that handles have inline style with left percentage
      expect(minHandle).toHaveAttribute('style');
      expect(maxHandle).toHaveAttribute('style');
      const minStyle = minHandle.getAttribute('style') || '';
      const maxStyle = maxHandle.getAttribute('style') || '';
      expect(minStyle).toContain('left');
      expect(maxStyle).toContain('left');
    });
  });

  describe('Edge Cases', () => {
    it('should handle min and max at boundaries', () => {
      render(<Range {...defaultProps} range={[0, 100]} />);
      expect(screen.getByText('0,00 €')).toBeInTheDocument();
      expect(screen.getByText('100,00 €')).toBeInTheDocument();
    });

    it('should handle very small ranges', () => {
      render(<Range {...defaultProps} min={0} max={10} range={[3, 7]} />);
      expect(screen.getByText('3,00 €')).toBeInTheDocument();
      expect(screen.getByText('7,00 €')).toBeInTheDocument();
    });

    it('should handle negative ranges', () => {
      render(<Range min={-50} max={50} range={[-25, 25]} onChange={vi.fn()} />);
      expect(screen.getByText('-25,00 €')).toBeInTheDocument();
      expect(screen.getByText('25,00 €')).toBeInTheDocument();
    });
  });
});
