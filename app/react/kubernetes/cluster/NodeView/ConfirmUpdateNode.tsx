import { ModalType } from '@@/modals';
import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmUpdateNode(
  taintsWarning: boolean,
  labelsWarning: boolean,
  cordonWarning: boolean,
  drainWarning: boolean
) {
  let message;
  if (taintsWarning && !labelsWarning) {
    message =
      'Changes to taints will immediately deschedule applications running on this node without the corresponding tolerations. Do you wish to continue?';
  } else if (!taintsWarning && labelsWarning) {
    message =
      'Removing or changing a label that is used might prevent applications from being scheduled on this node in the future. Do you wish to continue?';
  } else if (taintsWarning && labelsWarning) {
    message = (
      <>
        <p>更改污点后，当前节点上没有相应容忍的应用将立即被取消调度。</p>
        <p>移除或更改正在使用的标签，可能导致应用以后无法调度到此节点。</p>
        <p>是否继续？</p>
      </>
    );
  } else if (cordonWarning) {
    message =
      'Marking this node as unschedulable will effectively cordon the node and prevent any new workload from being scheduled on that node. Are you sure?';
  } else if (drainWarning) {
    message =
      'Draining this node will cause all workloads to be evicted from that node. This might lead to some service interruption. Are you sure?';
  }

  return confirm({
    title: '确定吗？',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('更新', 'primary'),
  });
}
