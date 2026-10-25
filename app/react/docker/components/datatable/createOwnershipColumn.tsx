import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Eye, EyeOff, Users } from 'lucide-react';

import i18n from '@/i18n';
import { ResourceControlOwnership } from '@/react/portainer/access-control/types';

import { Icon } from '@@/Icon';

export interface IResource {
  ResourceControl?: {
    Ownership: ResourceControlOwnership;
  };
}

export function createOwnershipColumn<D extends IResource>(
  enableHiding = true
): ColumnDef<D, ResourceControlOwnership> {
  return {
    accessorFn: (row) =>
      row.ResourceControl?.Ownership || ResourceControlOwnership.ADMINISTRATORS,
    header: () => i18n.t('common.columns.ownership'),
    id: 'ownership',
    cell: OwnershipCell,
    enableHiding,
  };

  function OwnershipCell({
    getValue,
  }: CellContext<D, ResourceControlOwnership>) {
    const value = getValue();

    return (
      <span className="flex items-center gap-2">
        <Icon icon={ownershipIcon(value)} className="space-right" />
        {ownershipLabel(value)}
      </span>
    );
  }
}

export function ownershipLabel(ownership: ResourceControlOwnership) {
  switch (ownership) {
    case ResourceControlOwnership.PUBLIC:
      return '公开';
    case ResourceControlOwnership.PRIVATE:
      return '私有';
    case ResourceControlOwnership.RESTRICTED:
      return '受限';
    case ResourceControlOwnership.ADMINISTRATORS:
    default:
      return '仅管理员';
  }
}

export function ownershipIcon(ownership: ResourceControlOwnership) {
  switch (ownership) {
    case ResourceControlOwnership.PRIVATE:
      return EyeOff;
    case ResourceControlOwnership.ADMINISTRATORS:
      return EyeOff;
    case ResourceControlOwnership.RESTRICTED:
      return Users;
    default:
      return Eye;
  }
}
