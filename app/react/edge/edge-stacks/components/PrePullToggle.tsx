import { SwitchField } from '@@/form-components/SwitchField';

export function PrePullToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <SwitchField
          checked={value}
          data-cy="kube-edge-stack-pre-pull-switch"
          name="prePullImage"
          label="预先拉取镜像"
          tooltip="启用后，镜像成功拉取时将执行重新部署。"
          labelClass="col-sm-3 col-lg-2"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
