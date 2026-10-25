import { List, Tag } from 'lucide-react';

import { BoxSelectorOption } from '@@/BoxSelector';

export const groupTypeOptions: ReadonlyArray<BoxSelectorOption<boolean>> = [
  {
    id: 'static-group',
    value: false,
    label: '静态',
    description: '手动选择边缘环境',
    icon: List,
    iconType: 'badge',
  },
  {
    id: 'dynamic-group',
    value: true,
    label: '动态',
    description: '通过标签自动关联环境',
    icon: Tag,
    iconType: 'badge',
  },
] as const;
