import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmRedeploy() {
  return confirm({
    title: '',
    message: (
      <>
        当前有一个或多个应用正在使用此数据卷。
        <br /> 需要重新部署这些应用才能使更改生效。是否立即重新调度？
      </>
    ),
    confirmButton: buildConfirmButton('重新部署应用'),
    cancelButtonLabel: '稍后再处理',
  });
}
