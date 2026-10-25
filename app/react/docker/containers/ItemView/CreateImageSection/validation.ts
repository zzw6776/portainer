import { useMemo } from 'react';
import { SchemaOf, object } from 'yup';

import { imageConfigValidation } from '@@/ImageConfigFieldset';

import { FormValues } from './types';

export function useValidation(
  isDockerhubRateLimited: boolean
): SchemaOf<FormValues> {
  return useMemo(
    () =>
      object({
        config: imageConfigValidation().test(
          'rate-limits',
          '已超过速率限制',
          () => !isDockerhubRateLimited
        ),
      }),
    [isDockerhubRateLimited]
  );
}
