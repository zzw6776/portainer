import { LayoutGrid } from 'lucide-react';

import { UNASSIGNED_GROUP_NAME } from '@/react/portainer/environments/environment-groups/utils/getPlatformLabel';

export function EnvironmentGroupName({ groupName }: { groupName?: string }) {
  return (
    <span className="small text-muted vertical-center">
      <LayoutGrid aria-hidden="true" className="icon icon-xs" /> 组：{' '}
      {groupName === UNASSIGNED_GROUP_NAME ? '未分配' : groupName || '未分配'}
    </span>
  );
}
