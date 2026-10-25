import { boolean, string, object, SchemaOf, TestContext } from 'yup';

import { ResourceQuotaFormValues } from './types';

export function getResourceQuotaValidationSchema(
  memoryLimit: number,
  cpuLimit: number
): SchemaOf<ResourceQuotaFormValues> {
  return object({
    enabled: boolean().required('资源配额启用状态为必填项。'),
    memory: string()
      .test(
        'non-negative-memory-validation',
        '现有命名空间的内存限制已超过集群可用量。设置此处的值之前，必须先减少命名空间中的配额（可能需要临时启用超额分配）。',
        () => nonNegativeLimit(memoryLimit)
      )
      .test(
        'memory-validation',
        `Value must be between 0 and ${memoryLimit}.`,
        memoryValidation
      ),
    cpu: string()
      .test(
        'non-negative-memory-validation',
        '现有命名空间的 CPU 限制已超过集群可用量。设置此处的值之前，必须先减少命名空间中的配额（可能需要临时启用超额分配）。',
        () => nonNegativeLimit(cpuLimit)
      )
      .test('cpu-validation', 'CPU 限制值为必填项。', cpuValidation),
  }).test('resource-quota-validation', '至少必须设置一项限制。', oneLimitSet);

  function oneLimitSet({
    enabled,
    memory,
    cpu,
  }: Partial<ResourceQuotaFormValues>) {
    return !enabled || (Number(memory) || 0) > 0 || (Number(cpu) || 0) > 0;
  }

  function nonNegativeLimit(limit: number) {
    return limit >= 0;
  }

  function memoryValidation(this: TestContext, memoryValue?: string) {
    const memory = Number(memoryValue) || 0;
    const { enabled } = this.parent;
    return !enabled || (memory >= 0 && memory <= memoryLimit);
  }

  function cpuValidation(this: TestContext, cpuValue?: string) {
    const cpu = Number(cpuValue) || 0;
    const { enabled } = this.parent;
    return !enabled || cpu >= 0;
  }
}
