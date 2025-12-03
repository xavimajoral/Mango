import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.prompt
global.prompt = vi.fn();

// Mock window.getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 1000,
  height: 50,
  top: 0,
  left: 0,
  bottom: 50,
  right: 1000,
  x: 0,
  y: 0,
  toJSON: vi.fn(),
}));
