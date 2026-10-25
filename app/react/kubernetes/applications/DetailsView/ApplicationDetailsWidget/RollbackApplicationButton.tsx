import { Pod } from 'kubernetes-types/core/v1';
import { RotateCcw } from 'lucide-react';
import { useRouter } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import { Authorized } from '@/react/hooks/useUser';
import { notifySuccess, notifyError } from '@/portainer/services/notifications';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';
import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Tooltip } from '@@/Tip/Tooltip';

import {
  applicationIsKind,
  getRollbackPatchPayload,
  matchLabelsToLabelSelectorValue,
} from '../../utils';
import { Application } from '../../types';
import { appDeployMethodLabel } from '../../constants';
import { useApplicationRevisionList } from '../../queries/useApplicationRevisionList';
import { usePatchApplicationMutation } from '../../queries/usePatchApplicationMutation';

type Props = {
  environmentId: EnvironmentId;
  namespace: string;
  appName: string;
  app?: Application;
};

export function RollbackApplicationButton({
  environmentId,
  namespace,
  appName,
  app,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const labelSelector = applicationIsKind<Pod>('Pod', app)
    ? ''
    : matchLabelsToLabelSelectorValue(app?.spec?.selector);
  const appRevisionListQuery = useApplicationRevisionList(
    environmentId,
    namespace,
    appName,
    app?.metadata?.uid,
    labelSelector,
    app?.kind
  );
  const appRevisionList = appRevisionListQuery.data;
  const appRevisions = appRevisionList?.items;
  const appDeployMethod =
    app?.metadata?.labels?.[appDeployMethodLabel] || 'application form';

  const patchAppMutation = usePatchApplicationMutation(
    environmentId,
    namespace,
    appName
  );

  const isRollbackNotAvailable =
    !app ||
    !appRevisions ||
    appRevisions?.length < 2 ||
    appDeployMethod !== 'application form' ||
    patchAppMutation.isLoading;

  const rollbackButton = (
    <Button
      ng-if="!ctrl.isExternalApplication()"
      type="button"
      color="light"
      size="small"
      className="!ml-0"
      disabled={isRollbackNotAvailable}
      onClick={() => rollbackApplication()}
      data-cy="k8sAppDetail-rollbackButton"
    >
      <Icon icon={RotateCcw} className="mr-1" />
      {t('kubernetes.applications.rollback')}
    </Button>
  );

  return (
    <Authorized authorizations="K8sApplicationDetailsW">
      <div className="flex gap-x-2">
        {isRollbackNotAvailable ? (
          <TooltipWithChildren message="当前没有可用的历史配置，无法回滚">
            <span>{rollbackButton}</span>
          </TooltipWithChildren>
        ) : (
          rollbackButton
        )}
        <Tooltip message="只支持一级回滚。例如，从 v2 回滚到 v1 后再次回滚，将回到 v2。请注意，服务变更和自动扩缩容规则变更不在回滚范围内，这是 Kubernetes 的原生行为。" />
      </div>
    </Authorized>
  );

  async function rollbackApplication() {
    // exit early if the application is a pod or there are no revisions
    if (
      !app?.kind ||
      applicationIsKind<Pod>('Pod', app) ||
      !appRevisionList?.items?.length
    ) {
      return;
    }

    // confirm the action
    const confirmed = await confirm({
      title: '确定吗？',
      modalType: ModalType.Warn,
      confirmButton: buildConfirmButton('回滚'),
      message: '将应用回滚到以前的配置可能导致服务中断。是否继续？',
    });
    if (!confirmed) {
      return;
    }

    try {
      const patch = getRollbackPatchPayload(app, appRevisionList);
      patchAppMutation.mutateAsync(
        {
          appKind: app.kind,
          patch,
          contentType:
            app.kind === 'Deployment'
              ? 'application/json-patch+json'
              : 'application/strategic-merge-patch+json',
        },
        {
          onSuccess: () => {
            notifySuccess(
              t('common.success'),
              t('kubernetes.applications.notifications.rolled_back')
            );
            router.stateService.reload();
          },
          onError: (error) =>
            notifyError('失败', error as Error, '无法回滚应用'),
        }
      );
    } catch (error) {
      notifyError('失败', error as Error);
    }
  }
}
