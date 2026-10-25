import { StackType } from '../types';

const dockerTexts = {
  editor: {
    placeholder: '在此定义或粘贴 Docker Compose 文件内容',
    description: (
      <p>
        有关 Compose 文件格式的更多信息，请参阅{' '}
        <a
          href="https://docs.docker.com/reference/compose-file/"
          target="_blank"
          rel="noreferrer"
        >
          官方文档
        </a>
        进行部署。
      </p>
    ),
  },
  upload: 'You can upload a Compose file from your computer.',
} as const;

export const textByType = {
  [StackType.DockerCompose]: dockerTexts,
  [StackType.DockerSwarm]: dockerTexts,
  [StackType.Kubernetes]: {
    editor: {
      placeholder: '在此定义或粘贴清单文件内容',
      description: (
        <>
          <p>
            模板可用于部署任意类型的 Kubernetes
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
        </>
      ),
    },
    upload: 'You can upload a Manifest file from your computer.',
  },
} as const;
