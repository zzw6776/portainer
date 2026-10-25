import { Formik, Form } from 'formik';
import { Laptop, Network } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@uirouter/react';
import { boolean, object, SchemaOf, string } from 'yup';

import {
  validation as urlValidation,
  buildDefaultValue as buildUrlDefaultValue,
  PortainerUrlField,
} from '@/react/portainer/common/PortainerUrlField';
import {
  useSettings,
  useUpdateSettingsMutation,
} from '@/react/portainer/settings/queries/useSettings';
import { EnabledWaitingRoomSwitch } from '@/react/portainer/settings/EdgeComputeView/AutomaticEdgeEnvCreation/EnableWaitingRoomSwitch';
import { ConnectivityTestModal } from '@/react/edge/components/ConnectivityTestModal/ConnectivityTestModal';
import { notifySuccess } from '@/portainer/services/notifications';

import { Switch } from '@@/form-components/SwitchField/Switch';
import { FormControl } from '@@/form-components/FormControl';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { Button } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';

interface FormValues {
  EnableEdgeComputeFeatures: boolean;
  EdgePortainerUrl: string;
  EnableWaitingRoom: boolean;
}

export function InitEdgeView() {
  const router = useRouter();
  const updateSettingsMutation = useUpdateSettingsMutation();
  const settingsQuery = useSettings();
  const [isConnectivityModalOpen, setIsConnectivityModalOpen] = useState(false);

  // Prefill the form from the saved settings when they are set (e.g. from the
  // startup CLI flags), falling back to the browser-derived default otherwise.
  const settings = settingsQuery.data;
  const initialValues: FormValues = {
    EnableEdgeComputeFeatures: settings?.EnableEdgeComputeFeatures ?? false,
    EdgePortainerUrl: settings?.EdgePortainerUrl || buildUrlDefaultValue(),
    EnableWaitingRoom: settings ? !settings.TrustOnFirstConnect : true,
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container">
        <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
          <Widget>
            <WidgetTitle icon={Laptop} title="设置边缘计算" />

            <WidgetBody loading={settingsQuery.isLoading}>
              <p className="text-muted">
                边缘计算使 Portainer
                能够管理无法直接访问的环境，例如远程设备、位于 NAT
                或防火墙后的环境，以及网络连接不稳定的站点。
              </p>
              <ul className="text-muted ml-4 list-disc">
                <li>
                  通过安全的反向隧道接入边缘代理，无需在远端开放入站端口。
                </li>
                <li>从单个 Portainer 实例向多个边缘环境部署堆栈和任务。</li>
              </ul>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnMount
              >
                {({ values, errors, setFieldValue, isValid }) => (
                  <Form className="form-horizontal mt-4" noValidate>
                    <FormControl
                      inputId="edge_enable"
                      label="启用边缘计算功能"
                      size="small"
                      errors={errors.EnableEdgeComputeFeatures}
                    >
                      <Switch
                        id="edge_enable"
                        data-cy="init-edge-enable-switch"
                        name="edge_enable"
                        className="space-right"
                        checked={values.EnableEdgeComputeFeatures}
                        onChange={(e) =>
                          setFieldValue('EnableEdgeComputeFeatures', e)
                        }
                      />
                    </FormControl>

                    {values.EnableEdgeComputeFeatures && (
                      <>
                        <TextTip color="blue" className="mb-2">
                          边缘代理将使用此 URL 访问当前 Portainer
                          实例。该地址已根据浏览器自动填写，请确认代理所在位置能够访问。之后可在“设置
                          &gt; 边缘计算”中修改。
                        </TextTip>

                        <PortainerUrlField
                          fieldName="EdgePortainerUrl"
                          required
                        />

                        <div className="form-group">
                          <div className="col-sm-12">
                            <Button
                              color="default"
                              icon={Network}
                              onClick={() => setIsConnectivityModalOpen(true)}
                              data-cy="init-edge-test-connectivity-button"
                              className="!ml-0"
                            >
                              测试连通性
                            </Button>
                          </div>
                        </div>

                        {isConnectivityModalOpen && (
                          <ConnectivityTestModal
                            portainerUrl={values.EdgePortainerUrl}
                            onDismiss={() => setIsConnectivityModalOpen(false)}
                          />
                        )}

                        <EnabledWaitingRoomSwitch />

                        <TextTip color="blue" className="mb-2">
                          启用后，新边缘代理需在“边缘计算 &gt;
                          等候室”中手动批准后才能关联；禁用后，代理首次连接时会自动受信任。
                        </TextTip>
                      </>
                    )}

                    <div className="form-group mt-5">
                      <div className="col-sm-12 flex gap-2">
                        <LoadingButton
                          disabled={!isValid}
                          data-cy="init-edge-submit-button"
                          isLoading={updateSettingsMutation.isLoading}
                          loadingText="正在保存……"
                        >
                          {values.EnableEdgeComputeFeatures
                            ? 'Enable and continue'
                            : 'Continue'}
                        </LoadingButton>

                        <Button
                          type="button"
                          color="light"
                          onClick={goToWizard}
                          data-cy="init-edge-skip-button"
                        >
                          跳过
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </div>
  );

  function goToWizard() {
    router.stateService.go('portainer.wizard');
  }

  function handleSubmit(values: FormValues) {
    if (!values.EnableEdgeComputeFeatures) {
      goToWizard();
      return;
    }

    updateSettingsMutation.mutate(
      {
        EnableEdgeComputeFeatures: true,
        EdgePortainerUrl: values.EdgePortainerUrl,
        TrustOnFirstConnect: !values.EnableWaitingRoom,
      },
      {
        onSuccess() {
          notifySuccess('成功', '边缘计算已启用');
          goToWizard();
        },
      }
    );
  }
}

function validationSchema(): SchemaOf<FormValues> {
  return object({
    EnableEdgeComputeFeatures: boolean().default(false),
    EnableWaitingRoom: boolean().default(true),
    EdgePortainerUrl: string()
      .default('')
      .when('EnableEdgeComputeFeatures', {
        is: true,
        then: () => urlValidation(),
      }),
  });
}
