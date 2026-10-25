import { PencilIcon } from 'lucide-react';
import { Secret } from 'kubernetes-types/core/v1';

import { Registry } from '@/react/portainer/registries/types/registry';

import { Badge } from '@@/Badge';
import { Button } from '@@/buttons/Button';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

import { ImagePullSecretBadge } from './ImagePullSecretBadge';

const MAX_VISIBLE_SECRETS = 5;

type ImagePullSecret = {
  name: string;
  secret: Secret | undefined;
  registry: Registry | undefined;
};

type Props = {
  imagePullSecrets: ImagePullSecret[];
  namespace: string;
  isDefaultServiceAccount: boolean;
  canEdit: boolean;
  isSystem?: boolean;
  onEdit: () => void;
};

export function ImagePullSecretsList({
  imagePullSecrets,
  namespace,
  isDefaultServiceAccount,
  canEdit,
  isSystem,
  onEdit,
}: Props) {
  const visibleSecrets = imagePullSecrets.slice(0, MAX_VISIBLE_SECRETS);
  const hiddenSecrets = imagePullSecrets.slice(MAX_VISIBLE_SECRETS);

  return (
    <div className="flex items-center gap-2">
      {visibleSecrets.length > 0 ? (
        <div className="flex h-fit flex-wrap gap-1">
          {visibleSecrets.map((imagePullSecret) => (
            <ImagePullSecretBadge
              key={imagePullSecret.name}
              secretName={imagePullSecret.name}
              namespace={namespace}
              secret={imagePullSecret.secret}
              registry={imagePullSecret.registry}
            />
          ))}
          {hiddenSecrets.length > 0 && (
            <TooltipWithChildren
              message={hiddenSecrets.map((secret) => secret.name).join(', ')}
            >
              <span>
                <Badge type="muted" className="min-w-max cursor-default">
                  + {hiddenSecrets.length} 更多
                </Badge>
              </span>
            </TooltipWithChildren>
          )}
        </div>
      ) : (
        <ImagePullSecretsEmptyState
          isDefaultServiceAccount={isDefaultServiceAccount}
        />
      )}
      {canEdit && !isSystem && (
        <Button
          color="light"
          size="small"
          icon={PencilIcon}
          onClick={onEdit}
          data-cy="k8sSADetail-imagePullSecrets-edit"
          className="h-[34px]"
        >
          编辑
        </Button>
      )}
    </div>
  );
}

function ImagePullSecretsEmptyState({
  isDefaultServiceAccount,
}: {
  isDefaultServiceAccount: boolean;
}) {
  return (
    <span className="text-muted">
      {isDefaultServiceAccount ? (
        <>
          未配置镜像拉取 Secret。此命名空间中未明确指定服务账户的 Pod 必须{' '}
          <code>imagePullSecrets</code> 手动指定。在此添加 Secret 后，Pod
          可自动拉取镜像。
        </>
      ) : (
        <>
          未配置镜像拉取 Secret。使用此服务账户的 Pod 必须{' '}
          <code>imagePullSecrets</code> 手动指定。在此添加 Secret
          后，使用此服务账户的 Pod 可自动拉取镜像。
        </>
      )}
    </span>
  );
}
