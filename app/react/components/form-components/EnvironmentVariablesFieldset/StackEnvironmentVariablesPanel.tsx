import { ComponentProps } from 'react';

import { Alert } from '@@/Alert';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';

import { EnvironmentVariablesFieldset } from './EnvironmentVariablesFieldset';
import { EnvironmentVariablesPanel } from './EnvironmentVariablesPanel';

type FieldsetProps = ComponentProps<typeof EnvironmentVariablesFieldset>;

export function StackEnvironmentVariablesPanel({
  onChange,
  values,
  errors,
  isFoldable = false,
  showHelpMessage,
}: {
  isFoldable?: boolean;
  showHelpMessage?: boolean;
} & FieldsetProps) {
  return (
    <EnvironmentVariablesPanel
      explanation={
        <div>
          可以使用{' '}
          <a
            href={`${useDocsUrl(
              '/user/docker/stacks/add#environment-variables'
            )}`}
            target="_blank"
            data-cy="stack-env-vars-help-link"
            rel="noreferrer noopener"
          >
            Compose 文件中的环境变量
          </a>
          。下方设置的环境变量值将用于替换 Compose 文件中的变量。也可以在
          Compose 文件中引用 stack.env 文件，该文件包含环境变量及其值（例如
          TAG=v1.5）。
        </div>
      }
      onChange={onChange}
      values={values}
      errors={errors}
      isFoldable={isFoldable}
      showHelpMessage={showHelpMessage}
      alertMessage={
        <div className="flex p-4">
          <Alert color="info" className="col-sm-12">
            <div>
              <p>
                <strong>stack.env 文件操作</strong>
              </p>
              <div>
                通过以下方式部署时： <strong>Git 仓库</strong>，stack.env
                文件必须已存在于 Git 仓库中。
              </div>
              <div>
                通过以下方式部署时： <strong>Web 编辑器</strong>,{' '}
                <strong>上传</strong> 或 <strong>自定义模板部署</strong>
                ，系统会根据下方设置自动创建 stack.env 文件。
              </div>
            </div>
          </Alert>
        </div>
      }
    />
  );
}
