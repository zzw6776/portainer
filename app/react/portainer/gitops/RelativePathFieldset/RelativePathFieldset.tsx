import { useState } from 'react';
import { FormikErrors } from 'formik';

import {
  PathSelector,
  PathSelectorGitModel,
} from '@/react/portainer/gitops/ComposePathField/PathSelector';
import { dummyGitForm } from '@/react/portainer/gitops/RelativePathFieldset/utils';

import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { Input, Select } from '@@/form-components/Input';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';
import { InsightsBox } from '@@/InsightsBox';

import { RelativePathModel, getPerDevConfigsFilterType } from './types';

interface Props {
  values: RelativePathModel;
  gitModel?: PathSelectorGitModel;
  onChange: (value: RelativePathModel) => void;
  isEditing?: boolean;
  hideEdgeConfigs?: boolean;
  errors?: FormikErrors<RelativePathModel>;
}

export function RelativePathFieldset({
  values: value,
  gitModel,
  onChange = () => {},
  isEditing,
  hideEdgeConfigs,
  errors,
}: Props) {
  const [relativePathManuallyEnabled, setRelativePathManuallyEnabled] =
    useState(value.SupportRelativePath);

  const [relativePathForcedEnabled, setRelativePathForcedEnabled] = useState(
    value.SupportPerDeviceConfigs
  );

  const gitoptsEdgeConfigDocUrl = useDocsUrl(
    '/user/edge/stacks/add#gitops-edge-configurations'
  );

  const pathTipSwarm =
    'For relative path volumes use with Docker Swarm, you must have a network filesystem which all of your nodes can access.';
  const pathTipGitopsActive =
    'GitOps Edge configurations is active. When you set the ‘local filesystem path’, it will also be utilized for relative paths.';

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            name="EnableRelativePaths"
            data-cy="gitops-enable-relative-paths-switch"
            label="启用相对路径数据卷"
            labelClass="col-sm-3 col-lg-2"
            tooltip="启用后，可以在 Compose 文件中指定相对路径数据卷，Portainer 会从 Git 仓库拉取内容到堆栈部署的环境。"
            disabled={isEditing || relativePathForcedEnabled}
            checked={value.SupportRelativePath}
            onChange={(value) => {
              setRelativePathManuallyEnabled(value);
              handleChange({ SupportRelativePath: value });
            }}
          />
        </div>
      </div>

      {value.SupportRelativePath && (
        <>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                {relativePathForcedEnabled ? pathTipGitopsActive : pathTipSwarm}
              </TextTip>
            </div>
          </div>

          {(!relativePathForcedEnabled || hideEdgeConfigs) && (
            <div className="form-group">
              <div className="col-sm-12">
                <FormControl
                  label="本地文件系统路径"
                  errors={errors?.FilesystemPath}
                  required
                >
                  <Input
                    name="FilesystemPath"
                    data-cy="relative-path-filesystem-path-input"
                    placeholder="/mnt"
                    disabled={isEditing}
                    value={value.FilesystemPath}
                    onChange={(e) =>
                      handleChange({ FilesystemPath: e.target.value })
                    }
                  />
                </FormControl>
              </div>
            </div>
          )}
        </>
      )}

      {!hideEdgeConfigs && (
        <>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                启用后，对应的边缘 ID 将通过环境变量 PORTAINER_EDGE_ID 传递。
              </TextTip>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="EnablePerDeviceConfigs"
                data-cy="gitops-enable-per-device-configs-switch"
                label="GitOps 边缘配置"
                labelClass="col-sm-3 col-lg-2"
                tooltip="启用 GitOps 边缘配置后，可以在配置文件中定义相对路径数据卷。Portainer 会将文件夹名或文件名与 Portainer 边缘 ID 匹配，自动从 Git 仓库获取内容，并应用到堆栈部署的环境。"
                disabled={isEditing}
                checked={!!value.SupportPerDeviceConfigs}
                onChange={(v) => {
                  setRelativePathForcedEnabled(v);
                  handleChange({
                    SupportPerDeviceConfigs: v,
                    SupportRelativePath: v ? true : relativePathManuallyEnabled,
                  });
                }}
              />
            </div>
          </div>

          {value.SupportPerDeviceConfigs && (
            <>
              <InsightsBox
                content={
                  <p>
                    名为 <code>$&#123;PORTAINER_EDGE_ID&#125;.env</code> 和/或{' '}
                    <code>$&#123;PORTAINER_EDGE_GROUP&#125;.env</code> 且位于
                    config 文件夹内的文件将用于 Compose 文件变量替换。
                  </p>
                }
                header="GitOps 边缘配置"
                insightCloseId="edge-config-interpolation-info"
                className="mb-3"
              />

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">{pathTipSwarm}</TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl
                    label="本地文件系统路径"
                    errors={errors?.FilesystemPath}
                    required
                  >
                    <Input
                      name="FilesystemPath"
                      data-cy="per-device-configs-filesystem-path-input"
                      placeholder="/mnt"
                      disabled={isEditing}
                      value={value.FilesystemPath}
                      onChange={(e) =>
                        handleChange({ FilesystemPath: e.target.value })
                      }
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    指定配置所在的目录名称，以便使用 Git
                    仓库作为模板管理设备配置。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl
                    label="目录"
                    errors={errors?.PerDeviceConfigsPath}
                    inputId="per_device_configs_path_input"
                    required
                  >
                    <PathSelector
                      value={value.PerDeviceConfigsPath || ''}
                      onChange={(value) =>
                        handleChange({ PerDeviceConfigsPath: value })
                      }
                      placeholder="config"
                      model={gitModel || dummyGitForm}
                      readOnly={isEditing}
                      dirOnly
                      inputId="per_device_configs_path_input"
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    选择将配置与 Portainer 边缘 ID
                    匹配时使用的规则，可按单个设备匹配，也可按边缘组匹配。只有符合所选规则的配置才能通过相应路径访问；依赖这些配置的部署可能会发生错误。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl label="设备匹配规则">
                    <Select
                      value={value.PerDeviceConfigsMatchType}
                      data-cy="per-device-configs-match-type-select"
                      onChange={(e) =>
                        handleChange({
                          PerDeviceConfigsMatchType: getPerDevConfigsFilterType(
                            e.target.value
                          ),
                        })
                      }
                      options={[
                        {
                          label: '',
                          value: '',
                        },
                        {
                          label: '按文件名匹配 Portainer 边缘 ID',
                          value: 'file',
                        },
                        {
                          label: '按文件夹名匹配 Portainer 边缘 ID',
                          value: 'dir',
                        },
                      ]}
                      disabled={isEditing}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl label="组匹配规则">
                    <Select
                      value={value.PerDeviceConfigsGroupMatchType}
                      data-cy="per-device-configs-group-match-type-select"
                      onChange={(e) =>
                        handleChange({
                          PerDeviceConfigsGroupMatchType:
                            getPerDevConfigsFilterType(e.target.value),
                        })
                      }
                      options={[
                        {
                          label: '',
                          value: '',
                        },
                        {
                          label: '按文件名匹配边缘组',
                          value: 'file',
                        },
                        {
                          label: '按文件夹名匹配边缘组',
                          value: 'dir',
                        },
                      ]}
                      disabled={isEditing}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    <div>
                      可以将其作为镜像的环境变量使用：{' '}
                      <code>myapp:$&#123;PORTAINER_EDGE_ID&#125;</code> 或{' '}
                      <code>myapp:$&#123;PORTAINER_EDGE_GROUP&#125;</code>
                      。也可以将其用于数据卷的相对路径：{' '}
                      <code>
                        ./config/$&#123;PORTAINER_EDGE_ID&#125;:/myapp/config
                      </code>{' '}
                      或{' '}
                      <code>
                        ./config/$&#123;PORTAINER_EDGE_GROUP&#125;:/myapp/groupconfig
                      </code>
                      。更多文档请参阅{' '}
                      <a href={gitoptsEdgeConfigDocUrl}>此处</a>进行部署。
                    </div>
                  </TextTip>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );

  function handleChange(newValue: Partial<RelativePathModel>) {
    onChange({ ...value, ...newValue });
  }
}
