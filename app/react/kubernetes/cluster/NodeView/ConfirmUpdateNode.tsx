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
      '更改污点会立即取消调度此节点上没有相应容忍规则的应用。是否继续？';
  } else if (!taintsWarning && labelsWarning) {
    message =
      '移除或更改正在使用的标签，可能导致应用以后无法调度到此节点。是否继续？';
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
      '将此节点标记为不可调度会封锁该节点，阻止新的工作负载调度到此节点。确定继续吗？';
  } else if (drainWarning) {
    message =
      '排空此节点会驱逐其上的所有工作负载，可能造成服务中断。确定继续吗？';
  }

  return confirm({
    title: '确定吗？',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('更新', 'primary'),
  });
}
