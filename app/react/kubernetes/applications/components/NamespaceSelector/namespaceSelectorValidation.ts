import { SchemaOf, string } from 'yup';

type ValidationData = {
  hasQuota: boolean;
  isResourceQuotaCapacityExceeded: boolean;
  namespaceOptionCount: number;
  isEnvironmentAdmin: boolean;
};

const emptyValue = '你无权访问任何命名空间，请联系管理员获取命名空间访问权限。';

export function namespaceSelectorValidation(
  validationData?: ValidationData
): SchemaOf<string> {
  const {
    hasQuota,
    isResourceQuotaCapacityExceeded,
    namespaceOptionCount,
    isEnvironmentAdmin,
  } = validationData || {};
  return string()
    .required(emptyValue)
    .typeError(emptyValue)
    .test(
      'resourceQuotaCapacityExceeded',
      `This namespace has exhausted its resource capacity and you will not be able to deploy the application.${
        isEnvironmentAdmin ? '' : ' 请联系管理员扩展命名空间容量。'
      }`,
      () => {
        const hasQuotaExceeded = hasQuota && isResourceQuotaCapacityExceeded;
        return !hasQuotaExceeded;
      }
    )
    .test('namespaceOptionCount', emptyValue, () => !!namespaceOptionCount);
}
