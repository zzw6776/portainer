import { DeploymentType } from '@/react/edge/edge-stacks/types';

import { BoxSelector } from '@@/BoxSelector';
import { BoxSelectorOption } from '@@/BoxSelector/types';
import {
  compose,
  kubernetes,
} from '@@/BoxSelector/common-options/deployment-methods';

interface Props {
  value: DeploymentType;
  onChange(value: DeploymentType): void;
  hasDockerEndpoint: boolean;
  hasKubeEndpoint: boolean;
  allowKubeToSelectCompose?: boolean;
  error?: string;
}

export function EdgeStackDeploymentTypeSelector({
  value,
  onChange,
  hasDockerEndpoint,
  hasKubeEndpoint,
  allowKubeToSelectCompose,
  error,
}: Props) {
  const deploymentOptions: BoxSelectorOption<DeploymentType>[] = [
    {
      ...compose,
      value: DeploymentType.Compose,
      disabled: () => !allowKubeToSelectCompose && hasKubeEndpoint,
      tooltip: () =>
        hasKubeEndpoint ? '此选项不能用于 Edge Kubernetes 环境' : '',
    },
    {
      ...kubernetes,
      value: DeploymentType.Kubernetes,
      disabled: () => hasDockerEndpoint,
      tooltip: () =>
        hasDockerEndpoint ? '此选项不能用于 Edge Docker 环境' : '',
      iconType: 'logo',
    },
  ];

  return (
    <>
      <div className="col-sm-12 form-section-title"> 部署类型</div>
      <BoxSelector
        radioName="deploymentType"
        value={value}
        options={deploymentOptions}
        onChange={onChange}
        error={error}
      />
    </>
  );
}
