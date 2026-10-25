import { Form, Formik } from 'formik';
import { Key } from 'lucide-react';
import { useState } from 'react';
import { SchemaOf, bool, object } from 'yup';

import { withHideOnExtension } from '@/react/hooks/withHideOnExtension';
import { notifySuccess } from '@/portainer/services/notifications';

import { Widget } from '@@/Widget';
import { LoadingButton } from '@@/buttons';
import {
  file,
  withFileExtension,
} from '@@/form-components/yup-file-validation';
import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { FileUploadField } from '@@/form-components/FileUpload';
import { SwitchField } from '@@/form-components/SwitchField';

import { useUpdateSSLConfigMutation } from '../useUpdateSSLConfigMutation';
import { useSSLSettings } from '../../queries/useSSLSettings';
import { useSettings, useUpdateSettingsMutation } from '../../queries';

interface FormValues {
  certFile?: File;
  keyFile?: File;
  forceHTTPS: boolean;
  forceSecureCookies: boolean;
}

export const SSLSettingsPanelWrapper = withHideOnExtension(SSLSettingsPanel);

function SSLSettingsPanel() {
  const settingsQuery = useSSLSettings();
  const secureSettingsQuery = useSettings((s) => s.ForceSecureCookies);
  const [reloadingPage, setReloadingPage] = useState(false);
  const sslMutation = useUpdateSSLConfigMutation();
  const settingsMutation = useUpdateSettingsMutation();

  if (!settingsQuery.data || !secureSettingsQuery.isSuccess) {
    return null;
  }

  const initialValues: FormValues = {
    certFile: undefined,
    keyFile: undefined,
    forceHTTPS: !settingsQuery.data.httpEnabled,
    forceSecureCookies: secureSettingsQuery.data,
  };

  const isLoading =
    sslMutation.isLoading || settingsMutation.isLoading || reloadingPage;

  return (
    <Widget>
      <Widget.Title icon={Key} title="SSL 证书" />
      <Widget.Body>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validation}
          validateOnMount
          enableReinitialize
        >
          {({ values, setFieldValue, isValid, errors, dirty }) => (
            <Form className="form-horizontal">
              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="orange">
                    强制仅使用 HTTPS 后，Portainer 将停止监听 HTTP
                    端口。所有使用 HTTP 的 Edge Agent 环境都将不可用。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <SwitchField
                    checked={values.forceHTTPS}
                    data-cy="settings-ssl-force-https-switch"
                    label="仅启用 HTTPS"
                    labelClass="col-sm-3 col-lg-2"
                    name="forceHTTPS"
                    onChange={(value) => setFieldValue('forceHTTPS', value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    强制使用安全 Cookie 适用于通过终止 TLS 的反向代理或
                    Kubernetes Ingress 访问 Portainer 的场景。若通过普通 HTTP
                    访问时强制使用安全 Cookie，将导致 Portainer 完全无法登录。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <SwitchField
                    checked={values.forceSecureCookies}
                    data-cy="settings-force-secure-cookies-switch"
                    label="强制使用安全 Cookie"
                    labelClass="col-sm-3 col-lg-2"
                    name="forceSecureCookies"
                    onChange={(value) =>
                      setFieldValue('forceSecureCookies', value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    提供新的 SSL 证书，以替换现有用于 HTTPS 连接的证书。
                  </TextTip>
                </div>
              </div>

              <FormControl
                label="SSL/TLS 证书"
                tooltip="选择 X.509 证书文件，通常为 crt、cer 或 pem 文件。"
                inputId="ca-cert-field"
                errors={errors.certFile}
              >
                <FileUploadField
                  inputId="ca-cert-field"
                  data-cy="ssl-cert-file-upload"
                  name="certFile"
                  onChange={(file) => setFieldValue('certFile', file)}
                  value={values.certFile}
                />
              </FormControl>

              <FormControl
                label="SSL/TLS 私钥"
                tooltip="选择私钥文件，通常为 key 或 pem 文件。"
                inputId="ca-cert-field"
                errors={errors.keyFile}
              >
                <FileUploadField
                  inputId="ca-cert-field"
                  data-cy="ssl-key-file-upload"
                  name="keyFile"
                  onChange={(file) => setFieldValue('keyFile', file)}
                  value={values.keyFile}
                />
              </FormControl>

              <div className="form-group">
                <div className="col-sm-12">
                  <LoadingButton
                    isLoading={isLoading}
                    data-cy="save-ssl-settings-button"
                    disabled={!dirty || !isValid}
                    loadingText={reloadingPage ? '正在重新加载' : '正在保存'}
                    className="!ml-0"
                  >
                    保存 SSL 设置
                  </LoadingButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Widget.Body>
    </Widget>
  );

  function handleSubmit({
    certFile,
    forceHTTPS,
    keyFile,
    forceSecureCookies,
  }: FormValues) {
    settingsMutation.mutate(
      { ForceSecureCookies: forceSecureCookies },
      {
        onSuccess: () => {
          notifySuccess('成功', '安全设置更新成功');
        },
      }
    );

    const sslChanged =
      certFile !== undefined ||
      keyFile !== undefined ||
      forceHTTPS !== !settingsQuery.data?.httpEnabled;

    if (sslChanged) {
      sslMutation.mutate(
        { certFile, httpEnabled: !forceHTTPS, keyFile },
        {
          async onSuccess() {
            await new Promise((resolve) => {
              setTimeout(resolve, 10000);
            });
            window.location.reload();
            setReloadingPage(true);
          },
        }
      );
    }
  }
}

function validation(): SchemaOf<FormValues> {
  return object({
    certFile: withFileExtension(file(), [
      'pem',
      'crt',
      'cer',
      'cert',
    ]).optional(),
    keyFile: withFileExtension(file(), ['pem', 'key']).optional(),
    forceHTTPS: bool().required(),
    forceSecureCookies: bool().required(),
  });
}
