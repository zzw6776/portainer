import { SchemaOf, string as yupString } from 'yup';

type ValidationData = {
  existingNames: string[];
  isEdit: boolean;
  originalName?: string;
};

export function appNameValidation(
  validationData?: ValidationData
): SchemaOf<string> {
  return yupString()
    .required('此字段是必填项。')
    .test('is-unique', '所选命名空间中已存在同名应用。', (appName) => {
      if (!validationData || !appName) {
        return true;
      }
      // if creating, check if the name is unique
      if (!validationData.isEdit) {
        return !validationData.existingNames.includes(appName);
      }
      // if editing, the original name will be in the list of existing names
      // remove it before checking if the name is unique
      const updatedExistingNames = validationData.existingNames.filter(
        (name) => name !== validationData.originalName
      );
      return !updatedExistingNames.includes(appName);
    })
    .test(
      'is-valid',
      "此字段只能包含小写字母、数字或 '-'，最多 63 个字符，必须以字母开头并以字母或数字结尾（例如 'my-name' 或 'abc-123'）。",
      (appName) => {
        if (!appName) {
          return true;
        }
        return /^[a-z]([a-z0-9-]{0,61}[a-z0-9])?$/g.test(appName);
      }
    );
}
