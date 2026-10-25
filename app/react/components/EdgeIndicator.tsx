import { Activity } from 'lucide-react';

import { isoDateFromTimestamp } from '@/portainer/filters/filters';
import { Environment } from '@/react/portainer/environments/types';

import { EnvironmentStatusBadgeItem } from './EnvironmentStatusBadgeItem';

interface Props {
  showLastCheckInDate?: boolean;
  environment: Environment;
}

export function EdgeIndicator({
  environment,
  showLastCheckInDate = false,
}: Props) {
  const associated = !!environment.EdgeID;
  if (!associated) {
    return (
      <span role="status" aria-label="edge-status">
        <EnvironmentStatusBadgeItem aria-label="未关联">
          <span className="whitespace-nowrap">未关联</span>
        </EnvironmentStatusBadgeItem>
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label="edge-status"
      className="flex items-center gap-1"
    >
      {showLastCheckInDate && !!environment.LastCheckInDate && (
        <span
          className="small text-muted vertical-center"
          aria-label="edge-last-checkin"
          title="边缘设备上次签入"
        >
          <Activity className="icon icon-sm space-right" aria-hidden="true" />
          {isoDateFromTimestamp(environment.LastCheckInDate)}
        </span>
      )}
    </span>
  );
}
