import { getNodeGroup } from '../../../nodeUtils';

import { columnHelper } from './helper';

export const nodeGroup = columnHelper.accessor(
  (row) => getNodeGroup(row) ?? '',
  {
    header: '节点组',
    id: 'nodeGroup',
    cell: ({ getValue }) => getValue() || '-',
  }
);
