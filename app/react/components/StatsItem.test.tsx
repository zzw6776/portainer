import { render, screen } from '@testing-library/react';

import {
  ContainerStats,
  CPUStats,
  GpuStats,
  MemoryStats,
  NodeStats,
} from './StatsItem';

describe('StatsItem', () => {
  describe('NodeStats', () => {
    it('renders node count with NODES label', () => {
      render(<NodeStats value={3} />);
      expect(screen.getByText('3')).toBeVisible();
      expect(screen.getByText('节点')).toBeVisible();
    });
  });

  describe('CPUStats', () => {
    it('renders CPU count with CORES label', () => {
      render(<CPUStats value={8} />);
      expect(screen.getByText('8')).toBeVisible();
      expect(screen.getByText('核心')).toBeVisible();
    });
  });

  describe('MemoryStats', () => {
    it('renders memory value with MEMORY label', () => {
      render(<MemoryStats value="8 GB" />);
      expect(screen.getByText('8 GB')).toBeVisible();
      expect(screen.getByText('内存')).toBeVisible();
    });
  });

  describe('GpuStats', () => {
    it('renders GPU count with GPUS label', () => {
      render(<GpuStats value={4} />);
      expect(screen.getByText('4')).toBeVisible();
      expect(screen.getByText('GPU')).toBeVisible();
    });
  });

  describe('ContainerStats', () => {
    it('renders running/total containers with a CONTAINERS label', () => {
      render(<ContainerStats total={5} running={3} stopped={2} />);
      expect(screen.getByText('3 / 5')).toBeVisible();
      expect(screen.getByText('容器')).toBeVisible();
    });

    it('exposes running and total counts to assistive technology', () => {
      render(<ContainerStats total={5} running={3} stopped={2} />);
      expect(screen.getByText('5 个容器，3 个运行中')).toBeInTheDocument();
    });

    it('falls back to running+stopped when total is zero', () => {
      render(<ContainerStats total={0} running={2} stopped={1} />);
      expect(screen.getByText('2 / 3')).toBeVisible();
    });
  });
});
