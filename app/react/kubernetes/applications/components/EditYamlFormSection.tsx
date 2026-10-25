import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useEnvironmentDeploymentOptions } from '@/react/portainer/environments/queries/useEnvironment';
import { useAuthorizations } from '@/react/hooks/useUser';

import { WebEditorForm } from '@@/WebEditorForm';
import { TextTip } from '@@/Tip/TextTip';

type StackFileContent = string;

type Props = {
  values: StackFileContent;
  onChange: (values: StackFileContent) => void;
  isComposeFormat?: boolean;
};

export function EditYamlFormSection({
  values,
  onChange,
  isComposeFormat,
}: Props) {
  // check if the user is allowed to edit the yaml
  const environmentId = useEnvironmentId();
  const { data: deploymentOptions } =
    useEnvironmentDeploymentOptions(environmentId);
  const { authorized: roleHasAuth } = useAuthorizations('K8sYAMLW');
  const isAllowedToEdit = roleHasAuth && !deploymentOptions?.hideWebEditor;
  const formId = 'kubernetes-deploy-editor';

  return (
    <div>
      <WebEditorForm
        data-cy="k8s-yaml-editor"
        value={values}
        readonly={!isAllowedToEdit}
        titleContent={<TitleContent isComposeFormat={isComposeFormat} />}
        onChange={(values) => onChange(values)}
        id={formId}
        textTip="在此定义或粘贴清单文件内容"
        type="yaml"
      />
    </div>
  );
}

function TitleContent({ isComposeFormat }: { isComposeFormat?: boolean }) {
  return (
    <>
      {isComposeFormat && (
        <TextTip color="orange">
          <p>
            Portainer 不再支持{' '}
            <a
              href="https://docs.docker.com/reference/compose-file/"
              target="_blank"
              rel="noreferrer"
            >
              docker-compose
            </a>{' '}
            格式的 Kubernetes 部署清单，并已移除{' '}
            <a href="https://kompose.io/" target="_blank" rel="noreferrer">
              Kompose
            </a>{' '}
            转换工具。原因是 Kompose
            存在多项常见漏洞与披露（CVE），目前会带来安全风险。
          </p>
          <p>
            遗憾的是，尽管 Kompose 项目有维护者且属于
            CNCF，但目前维护并不活跃。版本发布非常少，新的拉取请求（包括我们提交的请求）需要数月才能合并，同时还在不断出现新的
            CVE。
          </p>
          <p>
            建议在沙箱环境中自行安装 Kompose，将 Docker Compose 文件转换为
            Kubernetes 清单，再使用这些清单部署应用。
          </p>
        </TextTip>
      )}
      {!isComposeFormat && (
        <TextTip color="blue">
          <p>
            此功能允许在该环境中部署任意 Kubernetes
            资源（Deployment、Secret、ConfigMap 等）。
          </p>
          <p>
            可在以下位置了解有关 Kubernetes 文件格式的更多信息：{' '}
            <a
              href="https://kubernetes.io/docs/concepts/overview/working-with-objects/"
              target="_blank"
              rel="noreferrer"
            >
              官方文档
            </a>
            进行部署。
          </p>
        </TextTip>
      )}
    </>
  );
}
