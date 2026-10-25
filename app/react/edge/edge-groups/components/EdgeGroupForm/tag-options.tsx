import { Tag } from 'lucide-react';

import { BoxSelectorOption } from '@@/BoxSelector';

export const tagOptions: ReadonlyArray<BoxSelectorOption<boolean>> = [
  {
    id: 'or-selector',
    value: true,
    label: '部分匹配',
    description: '关联至少匹配一个所选标签的环境',
    icon: Tag,
    iconType: 'badge',
  },
  {
    id: 'and-selector',
    value: false,
    label: '全部匹配',
    description: '关联同时匹配所有所选标签的环境',
    icon: Tag,
    iconType: 'badge',
  },
];
