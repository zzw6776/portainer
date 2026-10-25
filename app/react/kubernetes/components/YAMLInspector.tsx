import { useMemo, useState } from 'react';
import YAML from 'yaml';
import { Minus, Plus } from 'lucide-react';

import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { AutomationTestingProps } from '@/types';

import { WebEditorForm } from '@@/WebEditorForm';
import { Button } from '@@/buttons';
import { BETeaserButton } from '@@/BETeaserButton';
import { Alert } from '@@/Alert';
import { Loading } from '@@/Widget/Loading';

type Props = {
  identifier: string;
  data: string;
  hideMessage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
} & AutomationTestingProps;

export function YAMLInspector({
  identifier,
  data,
  hideMessage,
  'data-cy': dataCy,
  isLoading,
  isError,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const yaml = useMemo(() => cleanYamlUnwantedFields(data), [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Alert color="error">加载 YAML 时出错</Alert>;
  }

  return (
    <div>
      <WebEditorForm
        data-cy={dataCy}
        value={yaml}
        textTip={
          hideMessage
            ? undefined
            : 'Define or paste the content of your manifest here'
        }
        readonly
        hideTitle
        id={identifier}
        type="yaml"
        height={expanded ? '800px' : '500px'}
        onChange={() => {}} // all kube yaml inspectors in CE are read only
      />
      <div className="flex items-center justify-between py-5">
        <Button
          icon={expanded ? Minus : Plus}
          data-cy={`expand-collapse-yaml-${identifier}`}
          color="default"
          className="!ml-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </Button>
        <BETeaserButton
          featureId={FeatureId.K8S_EDIT_YAML}
          heading="Apply YAML changes"
          message="调用 Kubernetes API 修补相关资源，以应用您在 YAML 编辑器中所做的更改。YAML 中删除资源或意外新增资源的操作将被忽略。请注意，标记为系统命名空间中的资源无法编辑。"
          buttonText="应用更改"
          data-cy="yaml-inspector-apply-changes-teaser-button"
        />
      </div>
    </div>
  );
}

export function cleanYamlUnwantedFields(yml: string) {
  try {
    const ymls = yml.split('---');
    const cleanYmls = ymls.map((yml) => {
      const y = YAML.parse(yml);
      if (y.metadata) {
        const { managedFields, resourceVersion, ...metadata } = y.metadata;
        y.metadata = metadata;
      }
      return YAML.stringify(y);
    });
    return cleanYmls.join('---\n');
  } catch (e) {
    return yml;
  }
}
