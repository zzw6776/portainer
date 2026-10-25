import { Field, useFormikContext } from 'formik';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

import { useGetMetricsMutation } from '@/react/kubernetes/queries/useGetMetricsMutation';

import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { Switch } from '@@/form-components/SwitchField/Switch';
import { InlineLoader } from '@@/InlineLoader';

import { ConfigureFormValues } from './types';

type Props = {
  environmentId: number;
  value: boolean;
  error?: string;
};

export function EnableMetricsInput({ value, error, environmentId }: Props) {
  const { setFieldValue } = useFormikContext<ConfigureFormValues>();
  const [metricsFound, setMetricsFound] = useState<boolean>();
  const getMetricsMutation = useGetMetricsMutation();
  return (
    <div className="mb-4">
      <TextTip color="blue">
        <p>
          启用指标功能后，用户可以使用 Pod
          水平自动扩缩容，并查看容器和节点资源使用情况。此功能需要{' '}
          <a
            href="https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server"
            target="_blank"
            rel="noreferrer"
          >
            指标服务器
          </a>{' '}
          或{' '}
          <a
            href="https://github.com/kubernetes-sigs/prometheus-adapter"
            target="_blank"
            rel="noreferrer"
          >
            prometheus
          </a>{' '}
          正在集群中运行。
        </p>
        <p>
          之后即使禁用此功能，已部署且配置了自动扩缩容的应用仍会自动扩缩容；必须移除其自动扩缩容定义才能停止。
        </p>
      </TextTip>
      <FormControl
        label="启用依赖指标 API 的功能"
        className="mb-0"
        size="large"
        errors={error}
        inputId="kubeSetup-metricsToggle"
      >
        <Field
          name="useServerMetrics"
          as={Switch}
          checked={value}
          id="kubeSetup-metricsToggle"
          onChange={(checked: boolean) => {
            // if turning off, just set the value
            if (!checked) {
              setFieldValue('useServerMetrics', checked);
              return;
            }
            // if turning on, see if the metrics server is available, then set the value to on if it is
            getMetricsMutation.mutate(environmentId, {
              onSuccess: () => {
                setMetricsFound(true);
                setFieldValue('useServerMetrics', checked);
              },
              onError: () => {
                setMetricsFound(false);
              },
            });
          }}
          data-cy="kubeSetup-metricsToggle"
        />
      </FormControl>
      {getMetricsMutation.isLoading && (
        <InlineLoader size="sm">正在检查指标 API……</InlineLoader>
      )}
      {!getMetricsMutation.isLoading && (
        <>
          {metricsFound === false && (
            <TextTip color="red" icon={XCircle}>
              无法访问指标 API，请确认指标服务器已正确部署到该集群。
            </TextTip>
          )}
          {metricsFound === true && (
            <TextTip color="green" icon={CheckCircle}>
              已成功访问指标 API
            </TextTip>
          )}
        </>
      )}
    </div>
  );
}
