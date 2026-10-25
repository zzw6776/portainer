import {
  AlertTriangle,
  CheckCircle,
  type LucideIcon,
  Loader2,
  XCircle,
  MinusCircle,
  PauseCircle,
} from 'lucide-react';

import { Icon, IconMode } from '@@/Icon';
import { Tooltip } from '@@/Tip/Tooltip';

import { DecoratedEdgeStack, StatusSummary, SummarizedStatus } from './types';

export function EdgeStackStatus({
  edgeStack,
}: {
  edgeStack: DecoratedEdgeStack;
}) {
  const { StatusSummary } = edgeStack;

  const { icon, label, mode, spin, tooltip } = getStatus(StatusSummary);

  return (
    <div className="mx-auto inline-flex items-center gap-2">
      {icon && <Icon icon={icon} spin={spin} mode={mode} />}
      {label}
      {tooltip && <Tooltip message={tooltip} />}
    </div>
  );
}

function getStatus(summary?: StatusSummary): {
  label: string;
  icon?: LucideIcon;
  spin?: boolean;
  mode?: IconMode;
  tooltip?: string;
} {
  if (!summary) {
    return {
      label: '不可用',
      icon: MinusCircle,
      mode: 'secondary',
      tooltip: '状态摘要不可用',
    };
  }
  const { Status, Reason } = summary;

  switch (Status) {
    case SummarizedStatus.Deploying:
      return {
        label: '正在部署',
        icon: Loader2,
        spin: true,
        mode: 'primary',
      };
    case SummarizedStatus.Failed:
      return {
        label: '失败',
        icon: XCircle,
        mode: 'danger',
      };
    case SummarizedStatus.Paused:
      return {
        label: '已暂停',
        icon: PauseCircle,
        mode: 'warning',
      };
    case SummarizedStatus.PartiallyRunning:
      return {
        label: '部分运行中',
        icon: AlertTriangle,
        mode: 'warning',
      };
    case SummarizedStatus.Completed:
      return {
        label: '已完成',
        icon: CheckCircle,
        mode: 'success',
      };
    case SummarizedStatus.Running:
      return {
        label: '运行中',
        icon: CheckCircle,
        mode: 'success',
      };
    case SummarizedStatus.Unavailable:
    default:
      return {
        label: '不可用',
        icon: MinusCircle,
        mode: 'secondary',
        tooltip: Reason,
      };
  }
}
