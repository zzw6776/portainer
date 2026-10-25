import { Badge } from '@@/Badge';

export function EdgeStackBadge({ className }: { className?: string }) {
  return (
    <Badge type="success" className={className}>
      边缘堆栈
    </Badge>
  );
}
