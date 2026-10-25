import { getInstanceType } from '../../../nodeUtils';

import { columnHelper } from './helper';

export const instanceType = columnHelper.accessor(
  (row) => getInstanceType(row) ?? '',
  {
    header: '实例类型',
    id: 'instanceType',
    cell: ({ getValue }) => getValue() || '-',
  }
);
