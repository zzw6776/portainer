import { useDockerComposeSchema } from '@/react/hooks/useDockerComposeSchema/useDockerComposeSchema';

import { InlineLoader } from '@@/InlineLoader';
import { WebEditorForm } from '@@/WebEditorForm';

export function DockerContentField({
  error,
  onChange,
  readonly,
  value,
  isLoading,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readonly?: boolean;
  isLoading?: boolean;
}) {
  const dockerComposeSchemaQuery = useDockerComposeSchema();

  if (isLoading || dockerComposeSchemaQuery.isInitialLoading) {
    return <InlineLoader>正在加载堆栈内容……</InlineLoader>;
  }

  return (
    <WebEditorForm
      id="stack-creation-editor"
      value={value}
      onChange={onChange}
      type="yaml"
      textTip="Define or paste the content of your docker compose file here"
      error={error}
      readonly={readonly}
      schema={dockerComposeSchemaQuery.data}
      data-cy="stack-creation-editor"
    >
      有关 Compose 文件格式的更多信息，请参阅{' '}
      <a
        href="https://docs.docker.com/reference/compose-file/"
        target="_blank"
        rel="noreferrer"
      >
        官方文档
      </a>
      进行部署。
    </WebEditorForm>
  );
}
