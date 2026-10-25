import { SchemaOf, boolean, number, object } from 'yup';

import { nanNumberSchema } from '@/react-tools/yup-schemas';

import { AutoScalingFormValues } from './types';

type ValidationData = {
  autoScalerOverflow: boolean;
};

export function autoScalingValidation(
  validationData?: ValidationData
): SchemaOf<AutoScalingFormValues> {
  const { autoScalerOverflow } = validationData || {};
  return object({
    isUsed: boolean().required(),
    minReplicas: number().when('isUsed', (isUsed: boolean) =>
      isUsed
        ? nanNumberSchema('最小实例数是必填项。')
            .required('最小实例数是必填项。')
            .min(1, '最小实例数必须大于 0。')
            .test(
              'maxReplicas',
              '最小实例数必须小于最大实例数。',
              // eslint-disable-next-line func-names
              function (this, value?: number): boolean {
                if (!value) {
                  return true;
                }
                const { maxReplicas } = this.parent as AutoScalingFormValues;
                return !maxReplicas || value < maxReplicas;
              }
            )
        : number()
    ),
    maxReplicas: number().when('isUsed', (isUsed: boolean) =>
      isUsed
        ? nanNumberSchema('最大实例数是必填项。')
            .required('最大实例数是必填项。')
            .test(
              'minReplicas',
              '最大实例数必须大于最小实例数。',
              // eslint-disable-next-line func-names
              function (this, value?: number): boolean {
                if (!value) {
                  return false;
                }
                const { minReplicas } = this.parent as AutoScalingFormValues;
                return !minReplicas || value > minReplicas;
              }
            )
            .test(
              'overflow',
              '此应用将超出可用资源，请减少最大实例数或资源预留。',
              () => !autoScalerOverflow
            )
        : number()
    ),
    targetCpuUtilizationPercentage: number().when(
      'isUsed',
      (isUsed: boolean) =>
        isUsed
          ? nanNumberSchema('目标 CPU 利用率百分比是必填项。')
              .min(0, '目标 CPU 使用率必须大于 0。')
              .max(100, '目标 CPU 使用率必须小于 100。')
              .required('目标 CPU 利用率百分比是必填项。')
          : number()
    ),
  });
}
