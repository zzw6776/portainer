import { useFormikContext } from 'formik';

import { useDockerComposeSchema } from '@/react/hooks/useDockerComposeSchema/useDockerComposeSchema';

import { TextTip } from '@@/Tip/TextTip';
import { WebEditorForm } from '@@/WebEditorForm';

import { DeploymentType } from '../../types';

import { FormValues } from './types';

export function ComposeForm({
  handleContentChange,
  hasKubeEndpoint,
  handleVersionChange,
  versionOptions,
}: {
  hasKubeEndpoint: boolean;
  handleContentChange: (type: DeploymentType, content: string) => void;
  handleVersionChange: (newVersion: number) => void;
  versionOptions: number[] | undefined;
}) {
  const { errors, values } = useFormikContext<FormValues>();
  const { data: dockerComposeSchema } = useDockerComposeSchema();

  return (
    <>
      {hasKubeEndpoint && (
        <TextTip>
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

      <WebEditorForm
        data-cy="compose-editor"
        value={values.content}
        type="yaml"
        schema={dockerComposeSchema}
        id="compose-editor"
        textTip="Define or paste the content of your docker compose file here"
        onChange={(value) => handleContentChange(DeploymentType.Compose, value)}
        error={errors.content}
        readonly={hasKubeEndpoint}
        versions={versionOptions}
        onVersionChange={handleVersionChange}
      >
        <div>
          有关 Compose 文件格式的更多信息，请参阅{' '}
          <a
            href="https://docs.docker.com/reference/compose-file/"
            target="_blank"
            rel="noreferrer"
          >
            官方文档
          </a>
          进行部署。
        </div>
      </WebEditorForm>
    </>
  );
}
