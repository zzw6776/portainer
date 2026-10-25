import { useFormikContext } from 'formik';

import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { Input } from '@@/form-components/Input';
import { FormControl } from '@@/form-components/FormControl';
import { SwitchField } from '@@/form-components/SwitchField';

import { IntervalField } from '../../components/IntervalField';
import { PollingIntervalScopeTip } from '../../components/PollingIntervalScopeTip';
import { FormValues } from '../type';

import { Authentication } from './Authentication';
import { ConnectionTest } from './ConnectionTest';

export function ConfigureGit() {
  const { values, setFieldValue, errors } = useFormikContext<FormValues>();

  if (values.type !== 'git') {
    return null;
  }

  return (
    <div className="grid">
      <FormControl
        inputId="repository-url-input"
        label="仓库 URL"
        required
        errors={errors.git?.url}
        tooltip="输入 Git 仓库的完整 URL"
      >
        <Input
          id="repository-url-input"
          value={values.git.url}
          data-cy="repository-url-input"
          placeholder="https://github.com/org/repo"
          required
          onChange={({ target: { value } }) => setFieldValue('git.url', value)}
        />
      </FormControl>

      <SwitchField
        label="跳过 TLS 验证"
        labelClass="col-sm-3 col-lg-2"
        name="TLSSkipVerify"
        checked={values.git.tlsSkipVerify || false}
        onChange={(value) => setFieldValue('git.tlsSkipVerify', value)}
        tooltip="启用后，将跳过对自签名证书的 TLS 验证。"
        data-cy="tls-skip-verify"
      />

      <Authentication />

      <SwitchField
        label="启用轮询"
        labelClass="col-sm-3 col-lg-2"
        name="polling-enabled"
        checked={values.git.polling.enabled}
        onChange={(value) => setFieldValue('git.polling.enabled', value)}
        tooltip="启用后，Portainer 会定期拉取此仓库以检测更改。"
        data-cy="source-polling-switch"
      />

      {values.git.polling.enabled && (
        <div className="mb-0 mt-4">
          <IntervalField
            value={values.git.polling.interval}
            onChange={(value) => setFieldValue('git.polling.interval', value)}
            errors={errors.git?.polling?.interval}
          />
          {!isBE && <PollingIntervalScopeTip />}
        </div>
      )}

      <ConnectionTest />
    </div>
  );
}
