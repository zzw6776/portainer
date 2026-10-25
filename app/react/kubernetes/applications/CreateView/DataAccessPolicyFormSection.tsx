import { Box, Boxes } from 'lucide-react';

import { BoxSelector, BoxSelectorOption } from '@@/BoxSelector';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { AppDataAccessPolicy } from '../types';

interface Props {
  isEdit: boolean;
  persistedFoldersUseExistingVolumes: boolean;
  value: AppDataAccessPolicy;
  onChange(value: AppDataAccessPolicy): void;
}

export function DataAccessPolicyFormSection({
  isEdit,
  persistedFoldersUseExistingVolumes,
  value,
  onChange,
}: Props) {
  const options = getOptions(value, isEdit, persistedFoldersUseExistingVolumes);

  return (
    <FormSection title="数据访问策略" titleSize="sm">
      <TextTip color="blue">指定数据在各实例之间的使用方式。</TextTip>
      <BoxSelector
        slim
        options={options}
        value={value}
        onChange={onChange}
        radioName="data_access_policy"
      />
    </FormSection>
  );
}

function getOptions(
  value: AppDataAccessPolicy,
  isEdit: boolean,
  persistedFoldersUseExistingVolumes: boolean
): ReadonlyArray<BoxSelectorOption<AppDataAccessPolicy>> {
  return [
    {
      value: 'Isolated',
      id: 'data_access_isolated',
      icon: Boxes,
      iconType: 'badge',
      label: '隔离',
      description: '应用将以 StatefulSet 部署，每个实例使用各自的数据',
      tooltip: () =>
        isEdit || persistedFoldersUseExistingVolumes
          ? '不允许更改数据访问策略'
          : '',
      disabled: () =>
        (isEdit && value !== 'Isolated') || persistedFoldersUseExistingVolumes,
    },
    {
      value: 'Shared',
      id: 'data_access_shared',
      icon: Box,
      iconType: 'badge',
      label: '共享',
      description: '应用将以 Deployment 部署，并共享存储访问',
      tooltip: () => {
        if (persistedFoldersUseExistingVolumes) {
          return '不允许更改数据访问策略';
        }
        return '';
      },
      disabled: () => isEdit && value !== 'Shared',
    },
  ] as const;
}
