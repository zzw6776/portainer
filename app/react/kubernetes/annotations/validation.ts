import { SchemaOf, array, object, string } from 'yup';

import { buildUniquenessTest } from '@@/form-components/validate-unique';

import { Annotation } from './types';

const re = /^([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$/;

export const annotationsSchema: SchemaOf<Annotation[]> = array(
  getAnnotationValidation()
).test(
  'unique',
  '不允许重复的键。',
  buildUniquenessTest(() => '不允许重复的键。', 'key')
);

function getAnnotationValidation(): SchemaOf<Annotation> {
  return object({
    key: string()
      .required('键为必填项。')
      .test('is-valid', (value, { createError }) => {
        if (!value) {
          return true;
        }
        const keySegments = value.split('/');
        if (keySegments.length > 2) {
          return createError({
            message: '允许使用由斜杠（/）分隔的两部分：可选前缀和名称。',
          });
        }
        if (keySegments.length === 2) {
          if (keySegments[0].length > 253) {
            return createError({
              message: '前缀（斜杠之前的部分）不能超过 253 个字符。',
            });
          }
          if (keySegments[1].length > 63) {
            return createError({
              message: '名称（斜杠后的部分）不能超过 63 个字符。',
            });
          }
          if (!re.test(keySegments[1])) {
            return createError({
              message:
                '必须以字母或数字开头和结尾，中间只能包含连字符、下划线、字母和数字。',
            });
          }
        } else if (keySegments.length === 1) {
          if (keySegments[0].length > 63) {
            return createError({
              message:
                '名称（斜杠后的部分；若无斜杠则为唯一部分）不能超过 63 个字符。',
            });
          }
          if (!re.test(keySegments[0])) {
            return createError({
              message:
                '必须以字母或数字开头和结尾，中间只能包含连字符、下划线、字母和数字。',
            });
          }
        }
        return true;
      }),
    value: string().required('值为必填项。'),
    id: string().required('ID 为必填项。'),
  });
}
