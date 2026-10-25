import { getNodeLabelStrings } from '../../../nodeUtils';

import { BadgeListCell } from './BadgeListCell';
import { columnHelper } from './helper';

export const labels = columnHelper.accessor(
  (row) => getNodeLabelStrings(row).join(' '),
  {
    header: '标签',
    id: 'labels',
    enableSorting: false,
    cell: ({ row: { original: node } }) => (
      <BadgeListCell values={getNodeLabelStrings(node)} />
    ),
  }
);
