import YAML from 'yaml';

import { useRegistries } from '@/react/portainer/registries/queries/useRegistries';
import { useEnvironmentRegistries } from '@/react/portainer/environments/queries/useEnvironmentRegistries';
import { useIsPureAdmin, useIsEnvironmentAdmin } from '@/react/hooks/useUser';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useDebouncedValue } from '@/react/hooks/useDebouncedValue';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { pluralize } from '@/react/common/string-utils';

import { TextTip } from '@@/Tip/TextTip';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Link } from '@@/Link';
import { InlineLoader } from '@@/InlineLoader';

interface PodSpec {
  serviceAccountName?: string;
}

interface KubeDocShape {
  metadata?: { namespace?: string };
  spec?: {
    serviceAccountName?: string;
    template?: { spec?: PodSpec };
    jobTemplate?: { spec?: { template?: { spec?: PodSpec } } };
  };
}

interface Props {
  /** Direct namespace — used by Helm views where namespace is explicitly selected. */
  namespace?: string;
  /** Used for detecting custom service accounts to avoid showing the notice when they are used. */
  manifestContent?: string;
  environmentId?: EnvironmentId;
}

export function K8sRegistryAccessNotice({
  namespace,
  manifestContent,
  environmentId: environmentIdProp,
}: Props) {
  const environmentIdFromRoute = useEnvironmentId(false);
  // useEnvironmentId(false) returns 0 when no endpointId in route params
  const environmentId =
    environmentIdProp ??
    (environmentIdFromRoute !== 0 ? environmentIdFromRoute : undefined);

  const debouncedContent = useDebouncedValue(manifestContent ?? '');
  const effectiveNamespace =
    namespace || getFirstNamespaceFromManifest(debouncedContent) || undefined;
  const hasCustomSA = manifestContent
    ? hasNonDefaultServiceAccount(debouncedContent)
    : false;

  const isPureAdmin = useIsPureAdmin();
  const { authorized: isEnvAdmin, isLoading: isEnvAdminLoading } =
    useIsEnvironmentAdmin();

  const allRegistriesQuery = useRegistries({
    hideDefault: true,
    enabled: !!effectiveNamespace,
    showError: false,
  });

  const nsRegistriesQuery = useEnvironmentRegistries(environmentId ?? 0, {
    namespace: effectiveNamespace,
    hideDefault: true,
    enabled: !!effectiveNamespace && environmentId !== undefined,
  });

  const isLoading =
    nsRegistriesQuery.isLoading ||
    (isPureAdmin && allRegistriesQuery.isLoading) ||
    isEnvAdminLoading;

  if (!effectiveNamespace || environmentId === undefined) {
    return null;
  }

  // show hidden text tip to avoid layout shift when changing namespaces
  if (isLoading) {
    return (
      <TextTip
        color="blue"
        className="pointer-events-none invisible"
        inline={false}
      >
        <InlineLoader size="xs">正在加载……</InlineLoader>
      </TextTip>
    );
  }

  const allRegistries = allRegistriesQuery.data ?? [];
  const nsRegistries = nsRegistriesQuery.data ?? [];

  // Ignore when custom service accounts are known to be used
  if (nsRegistries.length > 0 && hasCustomSA) {
    return null;
  }

  // No registries configured (non admin roles don't get the list of all registries, so check for nsRegistries here too)
  if (allRegistries.length === 0 && nsRegistries.length === 0) {
    return (
      <TextTip color="blue" inline={false}>
        以下命名空间未配置镜像仓库：“{effectiveNamespace}
        ”。
        {isPureAdmin ? (
          <>
            {' '}
            要自动拉取私有镜像，{' '}
            <Link
              to="portainer.registries.new"
              data-cy="add-registry-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              添加镜像仓库
            </Link>{' '}
            和{' '}
            <Link
              to="kubernetes.registries"
              params={{ endpointId: environmentId }}
              data-cy="setup-registry-access-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              设置镜像仓库访问权限
            </Link>{' '}
            进行部署。
          </>
        ) : (
          ' To pull private images automatically, contact your Portainer administrator to add a registry and set up registry access.'
        )}
      </TextTip>
    );
  }

  // Registries available but namespace has no registry access
  if (nsRegistries.length === 0) {
    return (
      <TextTip color="blue" inline={false}>
        以下命名空间未配置镜像仓库访问权限：“
        {effectiveNamespace}
        ”。
        {isEnvAdmin ? (
          <>
            {' '}
            要自动拉取私有镜像，{' '}
            <Link
              to="kubernetes.registries"
              params={{ endpointId: environmentId }}
              data-cy="setup-registry-access-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              设置镜像仓库访问权限
            </Link>
            进行部署。
          </>
        ) : (
          ' To pull private images automatically, contact your Portainer administrator to set up registry access.'
        )}
      </TextTip>
    );
  }

  // Registries available and accessible to this namespace
  const registryCount = nsRegistries.length;

  return (
    <TextTip color="blue" inline={false}>
      <TooltipWithChildren
        message={
          <ul className="list-disk mb-0 !pl-4">
            {nsRegistries.map((r) => (
              <li key={r.Id}>
                {r.Name}: {r.URL}
              </li>
            ))}
          </ul>
        }
      >
        <span className="cursor-help underline">
          {registryCount} {pluralize(registryCount, 'registry', 'registries')}
        </span>
      </TooltipWithChildren>{' '}
      可用于命名空间“{effectiveNamespace}”——从{' '}
      {pluralize(registryCount, 'this registry', 'these registries')}{' '}
      将自动生效（使用非默认服务账户时除外）。
      {isEnvAdmin && (
        <>
          {' '}
          <Link
            to="kubernetes.registries"
            params={{ endpointId: environmentId }}
            data-cy="manage-registry-access-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            管理访问权限
          </Link>
        </>
      )}
    </TextTip>
  );
}

export function getFirstNamespaceFromManifest(
  manifest: string
): string | undefined {
  return manifest
    .split('---')
    .flatMap((doc) => {
      try {
        const parsed: unknown = YAML.parse(doc);
        if (!isKubeDocShape(parsed)) {
          return [];
        }
        return parsed.metadata?.namespace ? [parsed.metadata.namespace] : [];
      } catch {
        return [];
      }
    })
    .at(0);
}

export function hasNonDefaultServiceAccount(manifest: string): boolean {
  return manifest.split('---').some((doc) => {
    try {
      const parsed: unknown = YAML.parse(doc);
      if (!isKubeDocShape(parsed)) {
        return false;
      }
      const sa = getPodSpecServiceAccountName(parsed);
      return !!sa && sa !== 'default';
    } catch {
      return false;
    }
  });
}

function isKubeDocShape(value: unknown): value is KubeDocShape {
  return value !== null && typeof value === 'object';
}

function getPodSpecServiceAccountName(doc: KubeDocShape): string | undefined {
  return (
    doc.spec?.serviceAccountName ||
    doc.spec?.template?.spec?.serviceAccountName ||
    doc.spec?.jobTemplate?.spec?.template?.spec?.serviceAccountName
  );
}
