import { SwitchField } from '@@/form-components/SwitchField';

import { FormValues } from './types';

export function DeploymentOptions({
  setFieldValue,
  values,
}: {
  values: FormValues;
  setFieldValue: <T>(field: string, value: T) => void;
}) {
  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.prePullImage}
            name="prePullImage"
            label="预先拉取镜像"
            tooltip="启用后，将在开始部署前预先拉取镜像。这适用于镜像下载可能延迟或中断、进而导致部署失败的场景。"
            labelClass="col-sm-3 col-lg-2"
            onChange={(value) => setFieldValue('prePullImage', value)}
            data-cy="pre-pull-images-switch"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.retryDeploy}
            name="retryDeploy"
            label="重试部署"
            tooltip="启用后，如果首次部署失败，边缘 Agent 可以重试部署。"
            labelClass="col-sm-3 col-lg-2"
            onChange={(value) => setFieldValue('retryDeploy', value)}
            data-cy="retry-deployment-switch"
          />
        </div>
      </div>
    </>
  );
}
