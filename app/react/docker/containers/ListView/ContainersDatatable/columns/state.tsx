import clsx from 'clsx';
import { CellContext } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import i18n from '@/i18n';
import {
  type ContainerListViewModel,
  ContainerStatus,
} from '@/react/docker/containers/types';

import { filterHOC } from '@@/datatables/Filter';
import { multiple } from '@@/datatables/filter-types';

import { columnHelper } from './helper';

export const state = columnHelper.accessor('Status', {
  header: () => i18n.t('docker.containers.columns.state'),
  id: 'state',
  cell: StatusCell,
  enableColumnFilter: true,
  filterFn: multiple,
  meta: {
    filter: filterHOC('按状态筛选'),
  },
});

function StatusCell({
  getValue,
  row: { original: container },
}: CellContext<ContainerListViewModel, ContainerStatus>) {
  const { t } = useTranslation();
  const status = getValue();

  const hasHealthCheck = [
    ContainerStatus.Starting,
    ContainerStatus.Healthy,
    ContainerStatus.Unhealthy,
  ].includes(status);

  const statusClassName = getClassName();

  let transformedStatus = getStatusLabel(status);
  if (status === ContainerStatus.Exited) {
    transformedStatus = `${transformedStatus} - 退出代码 ${extractExitCode(
      container.StatusText
    )}`;
  }

  return (
    <span
      className={clsx('label', `label-${statusClassName}`, {
        interactive: hasHealthCheck,
      })}
      title={hasHealthCheck ? t('docker_containers.health_check_tooltip') : ''}
    >
      {transformedStatus}
    </span>
  );

  function getClassName() {
    switch (status) {
      case ContainerStatus.Paused:
      case ContainerStatus.Starting:
      case ContainerStatus.Unhealthy:
      case ContainerStatus.Restarting:
      case ContainerStatus.Removing:
        return 'warning';
      case ContainerStatus.Created:
        return 'info';
      case ContainerStatus.Stopped:
      case ContainerStatus.Dead:
      case ContainerStatus.Exited:
        return 'danger';
      case ContainerStatus.Healthy:
      case ContainerStatus.Running:
      default:
        return 'success';
    }
  }

  function extractExitCode(statusText: string) {
    const regex = /\((\d+)\)/;
    const match = statusText.match(regex);
    return match ? match[1] : '';
  }
}

function getStatusLabel(status: ContainerStatus) {
  const labels: Record<ContainerStatus, string> = {
    [ContainerStatus.Paused]: '已暂停',
    [ContainerStatus.Stopped]: '已停止',
    [ContainerStatus.Created]: '已创建',
    [ContainerStatus.Healthy]: '健康',
    [ContainerStatus.Unhealthy]: '不健康',
    [ContainerStatus.Starting]: '正在启动',
    [ContainerStatus.Running]: '运行中',
    [ContainerStatus.Dead]: '已失效',
    [ContainerStatus.Exited]: '已退出',
    [ContainerStatus.Restarting]: '正在重启',
    [ContainerStatus.Removing]: '正在移除',
  };

  return labels[status];
}
