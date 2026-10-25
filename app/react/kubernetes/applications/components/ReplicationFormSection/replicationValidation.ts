import { SchemaOf, object } from 'yup';

import { nanNumberSchema } from '@/react-tools/yup-schemas';

import { ReplicaCountFormValues } from './types';

type ValidationData = {
  resourceReservationsOverflow: boolean;
  quotaExceeded: boolean;
  nonScalableStorage: string;
  supportScalableReplicaDeployment: boolean;
};

export function replicationValidation(
  validationData?: ValidationData
): SchemaOf<ReplicaCountFormValues> {
  const {
    resourceReservationsOverflow,
    quotaExceeded,
    nonScalableStorage,
    supportScalableReplicaDeployment,
  } = validationData || {};
  return object({
    replicaCount: nanNumberSchema('实例计数是必填项')
      .min(0, '实例数必须大于或等于 0。')
      .test(
        'overflow',
        '此应用将超出可用资源，请检查资源预留或实例数。',
        (value) => {
          // the user can't fix the error here with 1 replica. There are validation errors in the resource reservations section that are helpful in a case of resourceReservationsOverflow.
          if (value === 1) {
            return true;
          }
          return !resourceReservationsOverflow;
        }
      )
      .test(
        'quota',
        '此应用将超出可用存储，请检查持久化文件夹或实例数。',
        () => !quotaExceeded // must not have quota exceeded
      )
      .test(
        'scalable',
        `The following storage option(s) do not support concurrent access from multiples instances: ${nonScalableStorage}. You will not be able to scale that application.`,
        (value) => {
          if (!value || value <= 1) {
            return true;
          }
          return !!supportScalableReplicaDeployment;
        } // must have support scalable replica deployment
      )
      .required('实例计数是必填项.'),
  });
}
