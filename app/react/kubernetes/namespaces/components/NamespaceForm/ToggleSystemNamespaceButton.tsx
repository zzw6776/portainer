import { notifySuccess } from '@/portainer/services/notifications';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { LoadingButton } from '@@/buttons';
import { confirmUpdate } from '@@/modals/confirm';

import { useToggleSystemNamespaceMutation } from '../../queries/useToggleSystemNamespace';

export function ToggleSystemNamespaceButton({
  isSystemNamespace,
  isEdit,
  environmentId,
  namespaceName,
}: {
  isSystemNamespace: boolean;
  isEdit: boolean;
  environmentId: EnvironmentId;
  namespaceName: string;
}) {
  const toggleSystemNamespaceMutation = useToggleSystemNamespaceMutation(
    environmentId,
    namespaceName
  );
  if (!isEdit) {
    return null;
  }

  return (
    <LoadingButton
      onClick={markUnmarkAsSystem}
      className="!ml-0"
      data-cy="mark-as-system-button"
      color="default"
      type="button"
      loadingText={
        isSystemNamespace
          ? '正在取消系统命名空间标记'
          : '正在标记为系统命名空间'
      }
      isLoading={toggleSystemNamespaceMutation.isLoading}
    >
      {isSystemNamespace ? '取消系统标记' : '标记为系统'}
    </LoadingButton>
  );

  async function markUnmarkAsSystem() {
    const confirmed = await confirmMarkUnmarkAsSystem(isSystemNamespace);
    if (confirmed) {
      toggleSystemNamespaceMutation.mutate(!isSystemNamespace, {
        onSuccess: () => {
          notifySuccess('成功', '命名空间更新成功');
        },
      });
    }
  }
}

async function confirmMarkUnmarkAsSystem(isSystemNamespace: boolean) {
  const message = isSystemNamespace
    ? '取消此命名空间的系统标记后，非管理员用户可根据访问控制设置管理它及其中的资源。确定继续吗？'
    : '将此命名空间标记为系统命名空间后，非管理员用户将无法管理它及其中的资源。确定继续吗？';

  return new Promise((resolve) => {
    confirmUpdate(message, resolve);
  });
}
