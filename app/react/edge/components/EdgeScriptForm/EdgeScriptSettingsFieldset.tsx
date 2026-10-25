import { useFormikContext, Field } from 'formik';

import { GroupField } from '@/react/portainer/environments/common/MetadataFieldset/GroupsField';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';
import { TagSelector } from '@@/TagSelector';

import { EdgeGroupsSelector } from '../../edge-stacks/components/EdgeGroupsSelector';

import { ScriptFormValues } from './types';

interface Props {
  hideIdGetter?: boolean;
  showMetaFields?: boolean;
}

export function EdgeScriptSettingsFieldset({
  hideIdGetter,
  showMetaFields,
}: Props) {
  const { values, setFieldValue, errors } =
    useFormikContext<ScriptFormValues>();

  return (
    <>
      {showMetaFields && (
        <>
          <GroupField name="group" />

          <EdgeGroupsSelector
            value={values.edgeGroupsIds}
            onChange={(value) => setFieldValue('edgeGroupsIds', value)}
            isGroupVisible={(group) => !group.Dynamic}
            horizontal
          />

          <TagSelector
            value={values.tagsIds}
            onChange={(value) => setFieldValue('tagsIds', value)}
          />
        </>
      )}

      {!hideIdGetter && (
        <>
          <FormControl
            label="边缘 ID 生成器"
            tooltip="输入一条用于生成唯一边缘 ID 的单行 Bash 命令，例如“uuidgen”或“uuid”。命令结果将赋值给环境变量“PORTAINER_EDGE_ID”。"
            inputId="edge-id-generator-input"
            required
            errors={errors.edgeIdGenerator}
          >
            <Input
              type="text"
              value={values.edgeIdGenerator}
              name="edgeIdGenerator"
              placeholder="例如 uuidgen"
              id="edge-id-generator-input"
              onChange={(e) => setFieldValue(e.target.name, e.target.value)}
              data-cy="edge-id-generator-input"
            />
          </FormControl>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                <code>PORTAINER_EDGE_ID</code> 环境变量是边缘 Agent 成功连接
                Portainer 的必要条件
              </TextTip>
            </div>
          </div>
        </>
      )}

      <FormControl
        label="环境变量"
        tooltip="以逗号分隔的环境变量列表；变量值将从部署 Agent 的主机读取。"
        inputId="env-variables-input"
      >
        <Field
          name="envVars"
          as={Input}
          placeholder="例如 foo=bar"
          id="env-variables-input"
        />
      </FormControl>

      <TextTip color="orange" className="icon-orange mb-2">
        出于安全考虑，只能访问名称以“PORTAINER_”开头的环境变量。
      </TextTip>

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.allowSelfSignedCertificates}
            data-cy="allow-self-signed-certs-switch"
            onChange={(value) =>
              setFieldValue('allowSelfSignedCertificates', value)
            }
            label="允许自签名证书"
            labelClass="col-sm-3 col-lg-2"
            tooltip="允许自签名证书后，边缘 Agent 通过 HTTPS 连接 Portainer 时将忽略域名验证。"
          />
        </div>
      </div>
    </>
  );
}
