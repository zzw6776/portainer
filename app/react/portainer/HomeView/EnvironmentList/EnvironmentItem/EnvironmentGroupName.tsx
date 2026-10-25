import { LayoutGrid } from 'lucide-react';

export function EnvironmentGroupName({ groupName }: { groupName?: string }) {
  return (
    <span className="small text-muted vertical-center">
      <LayoutGrid aria-hidden="true" className="icon icon-xs" /> 组：{' '}
      {groupName || '未分配'}
    </span>
  );
}
