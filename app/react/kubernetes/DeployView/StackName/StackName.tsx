import { useMemo } from 'react';

import { useIsEdgeAdmin } from '@/react/hooks/useUser';

import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';
import { Tooltip } from '@@/Tip/Tooltip';
import { AutocompleteSelect } from '@@/form-components/AutocompleteSelect';
import { FormError } from '@@/form-components/FormError';

type Props = {
  stackName: string;
  setStackName: (name: string) => void;
  stacks?: string[];
  inputClassName?: string;
  textTip?: string;
  error?: string;
};

export function StackName({
  stackName,
  setStackName,
  stacks = [],
  inputClassName,
  textTip = "Enter or select a 'stack' name to group multiple deployments together, or else leave empty to ignore.",
  error = '',
}: Props) {
  const isAdminQuery = useIsEdgeAdmin();
  const stackResults = useMemo(
    () => stacks.filter((stack) => stack.includes(stackName ?? '')),
    [stacks, stackName]
  );

  const { isAdmin } = isAdminQuery;

  const tooltip = (
    <>
      可以指定堆栈名称，为希望归组的资源添加标签，包括
      Deployment、DaemonSet、StatefulSet 和 Pod。
      {isAdmin && (
        <>
          <br />
          可以将堆栈名称留空，也可以通过以下位置完全关闭 Kubernetes 堆栈功能：{' '}
          <Link
            to="portainer.settings"
            target="_blank"
            data-cy="k8s-deploy-stack-input-settings-link"
          >
            Kubernetes 设置
          </Link>
          进行部署。
        </>
      )}
    </>
  );

  return (
    <>
      {textTip ? (
        <TextTip className="mb-4" color="blue">
          {textTip}
        </TextTip>
      ) : null}
      <div className="form-group">
        <label
          htmlFor="stack_name"
          className="col-lg-2 col-sm-3 control-label text-left"
        >
          堆栈
          <Tooltip message={tooltip} setHtmlMessage />
        </label>
        <div className={inputClassName || 'col-sm-9 col-lg-10'}>
          <AutocompleteSelect
            searchResults={stackResults?.map((result) => ({
              value: result,
              label: result,
            }))}
            value={stackName ?? ''}
            onChange={setStackName}
            placeholder="例如 myStack"
            inputId="stack_name"
            data-cy="k8s-deploy-stack-input"
          />
          {error ? <FormError>{error}</FormError> : null}
        </div>
      </div>
    </>
  );
}
