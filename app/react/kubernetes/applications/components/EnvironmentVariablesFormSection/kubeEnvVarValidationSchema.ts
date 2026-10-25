import { SchemaOf, array, bool, object, string } from 'yup';

import { EnvVar } from '@@/form-components/EnvironmentVariablesFieldset/types';
import { buildUniquenessTest } from '@@/form-components/validate-unique';

export function kubeEnvVarValidationSchema(): SchemaOf<EnvVar[]> {
  return array(
    object({
      name: string()
        .required('环境变量名称为必填项')
        .matches(
          /^[a-zA-Z][a-zA-Z0-9_.-]*$/,
          `此字段只能包含字母、数字、'_'、'-' 或 '.'，且不能以数字开头（例如 'my.env-name'、'MY_ENV.NAME' 或 'MyEnvName1'`
        ),
      value: string().default(''),
      needsDeletion: bool().default(false),
      isNew: bool().default(false),
    })
  ).test(
    'unique',
    '此环境变量已定义',
    buildUniquenessTest(() => '此环境变量已定义', 'name')
  );
}
