import { SchemaOf, array, object, number, string } from 'yup';

import { Registry } from '@/react/portainer/registries/types/registry';

export const registriesValidationSchema: SchemaOf<Registry[]> = array(
  object({
    Id: number().required('Registry ID 为必填项。'),
    Name: string().required('镜像仓库名称为必填项。'),
  }) as unknown as SchemaOf<Registry>
  // the only needed value is actually the id. SchemaOf throw a ts error if we don't cast to SchemaOf<Registry>
);
