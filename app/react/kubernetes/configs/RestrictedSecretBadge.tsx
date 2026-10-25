import { Badge } from '@@/Badge';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

export function RestrictedSecretBadge() {
  return (
    <TooltipWithChildren message="只能查看您本人在 Portainer 中创建的 Secret 详情">
      <div className="min-w-min">
        <Badge type="warn">受限</Badge>
      </div>
    </TooltipWithChildren>
  );
}
