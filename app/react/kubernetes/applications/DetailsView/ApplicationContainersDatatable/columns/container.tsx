import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { BarChart, FileText, Terminal } from 'lucide-react';

import { Authorized } from '@/react/hooks/useUser';
import { pluralize } from '@/react/common/string-utils';

import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip';
import { ExternalLink } from '@@/ExternalLink';
import { Link } from '@@/Link';
import { Icon } from '@@/Icon';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

import { ContainerRowData } from '../types';

const columnHelper = createColumnHelper<ContainerRowData>();

const name = columnHelper.accessor('name', {
  header: '名称',
  id: 'name',
  cell: ({ row: { original: container } }) => (
    <div className="flex justify-between gap-2">
      <span>{container.name}</span>
      <ContainerTypeBadge container={container} />
    </div>
  ),
});

function ContainerTypeBadge({ container }: { container: ContainerRowData }) {
  if (container.isSidecar) {
    return (
      <Badge type="info">
        边车容器
        <Tooltip
          message={
            <>
              <ExternalLink
                to="https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/"
                data-cy="sidecar-link"
              >
                边车容器
              </ExternalLink>{' '}
              会与主应用一起持续运行，并在其他容器之前启动。
            </>
          }
        />
      </Badge>
    );
  }

  if (container.isInit) {
    return (
      <Badge type="info">
        使用 Init 进程 (Init)
        <Tooltip
          message={
            <>
              <ExternalLink
                to="https://kubernetes.io/docs/concepts/workloads/pods/init-containers/"
                data-cy="init-link"
              >
                初始化容器
              </ExternalLink>{' '}
              会在主应用容器启动前运行并完成。
            </>
          }
        />
      </Badge>
    );
  }

  return null;
}

const image = columnHelper.accessor('image', {
  header: '镜像',
  cell: ({ getValue }) => (
    <div className="max-w-xs truncate" title={getValue()}>
      {getValue()}
    </div>
  ),
});

const imagePullPolicy = columnHelper.accessor('imagePullPolicy', {
  header: '镜像拉取策略',
  id: 'imagePullPolicy',
});

const status = columnHelper.accessor('status', {
  header: '状态',
  cell: StatusCell,
});

function StatusCell({
  getValue,
}: CellContext<ContainerRowData, ContainerRowData['status']>) {
  const statusData = getValue();

  return (
    <Badge type={statusData.type}>
      <div className="flex items-center gap-1">
        <span>
          {statusData.status}
          {statusData.restartCount &&
            ` (Restarted ${statusData.restartCount} ${pluralize(
              statusData.restartCount,
              'time'
            )})`}
        </span>
      </div>
      {statusData.message && <Tooltip message={statusData.message} />}
    </Badge>
  );
}

function buildActionsColumn(isServerMetricsEnabled: boolean) {
  return columnHelper.accessor(() => '', {
    header: '操作',
    enableSorting: false,
    cell: ({ row: { original: container } }) => (
      <div className="flex gap-x-2">
        {container.status.status.includes('Running') &&
          isServerMetricsEnabled && (
            <Link
              className="flex items-center gap-1"
              to="kubernetes.applications.application.stats"
              params={{ pod: container.podName, container: container.name }}
              data-cy={`application-container-stats-${container.name}`}
            >
              <TooltipWithChildren message="查看统计信息" position="top">
                <Icon icon={BarChart} />
              </TooltipWithChildren>
            </Link>
          )}
        {container.status.hasLogs !== false && (
          <Link
            className="flex items-center gap-1"
            to="kubernetes.applications.application.logs"
            params={{ pod: container.podName, container: container.name }}
            data-cy={`application-container-logs-${container.name}`}
          >
            <TooltipWithChildren message="查看日志" position="top">
              <Icon icon={FileText} />
            </TooltipWithChildren>
          </Link>
        )}
        {container.status.status.includes('Running') && (
          <Authorized authorizations="K8sApplicationConsoleRW">
            <Link
              className="flex items-center gap-1"
              to="kubernetes.applications.application.console"
              params={{ pod: container.podName, container: container.name }}
              data-cy={`application-container-console-${container.name}`}
            >
              <TooltipWithChildren message="打开控制台" position="top">
                <Icon icon={Terminal} />
              </TooltipWithChildren>
            </Link>
          </Authorized>
        )}
      </div>
    ),
  });
}

export function getContainerColumns(isServerMetricsEnabled: boolean) {
  return [
    name,
    image,
    imagePullPolicy,
    status,
    buildActionsColumn(isServerMetricsEnabled),
  ];
}
