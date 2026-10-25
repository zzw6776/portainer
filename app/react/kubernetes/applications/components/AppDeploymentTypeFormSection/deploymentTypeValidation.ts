import { SchemaOf, mixed } from 'yup';

import { DeploymentType } from '../../types';

type ValidationData = {
  isQuotaExceeded: boolean;
};

export function deploymentTypeValidation(
  validationData?: ValidationData
): SchemaOf<DeploymentType> {
  return mixed()
    .oneOf(['Replicated', 'Global'])
    .test(
      'exhaused',
      `此应用将超出可用资源，请检查资源预留或实例数。`,
      (value) => {
        // ignore this validation if the user has selected Replicated, in this case, the isQuotaExceeded will below the instance count input
        if (value === 'Replicated') {
          return true;
        }
        return !validationData?.isQuotaExceeded;
      }
    );
}
