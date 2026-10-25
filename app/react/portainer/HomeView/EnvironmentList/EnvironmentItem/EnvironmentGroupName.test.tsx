import { render, screen } from '@testing-library/react';

import { EnvironmentGroupName } from './EnvironmentGroupName';

describe('EnvironmentGroupName', () => {
  it('renders the provided group name', () => {
    render(<EnvironmentGroupName groupName="Production" />);
    expect(screen.getByText(/Production/)).toBeVisible();
  });

  it('renders the localized fallback when no group name is provided', () => {
    render(<EnvironmentGroupName />);
    expect(screen.getByText(/未分配/)).toBeVisible();
  });

  it('localizes the unassigned group name returned by the API', () => {
    render(<EnvironmentGroupName groupName="Unassigned" />);
    expect(screen.getByText(/未分配/)).toBeVisible();
  });
});
