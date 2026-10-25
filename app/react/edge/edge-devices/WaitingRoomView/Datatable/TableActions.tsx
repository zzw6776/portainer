import { Check, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { notifySuccess } from '@/portainer/services/notifications';
import { useDeleteEnvironmentsMutation } from '@/react/portainer/environments/ListView/useDeleteEnvironmentsMutation';
import { Environment } from '@/react/portainer/environments/types';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { useIsPureAdmin } from '@/react/hooks/useUser';

import { Button } from '@@/buttons';
import { openModal } from '@@/modals';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { useAssociateDeviceMutation, useLicenseOverused } from '../queries';
import { WaitingRoomEnvironment } from '../types';

import { AssignmentDialog } from './AssignmentDialog/AssignmentDialog';

const overusedTooltip = <>节点数量已超过许可证限制，无法关联设备</>;

export function TableActions({
  selectedRows,
}: {
  selectedRows: WaitingRoomEnvironment[];
}) {
  const { t } = useTranslation();
  const isPureAdmin = useIsPureAdmin();
  const associateMutation = useAssociateDeviceMutation();
  const removeMutation = useDeleteEnvironmentsMutation();
  const licenseOverused = useLicenseOverused(selectedRows.length);

  return (
    <>
      <DeleteButton
        onConfirmed={() => handleRemoveDevice(selectedRows)}
        disabled={selectedRows.length === 0}
        data-cy="remove-device-button"
        confirmMessage="即将从待关联区移除边缘设备；这些设备会在 Agent 下次启动后重新显示。"
      >
        {t('edge.devices.remove_device')}
      </DeleteButton>

      <TooltipWithChildren
        message={
          licenseOverused ? (
            overusedTooltip
          ) : (
            <>关联设备，并分配边缘组、环境组和标签（可覆盖预分配设置）</>
          )
        }
      >
        <span>
          <Button
            onClick={() => handleAssociateAndAssign(selectedRows)}
            data-cy="associate-and-assign-button"
            disabled={
              selectedRows.length === 0 || licenseOverused || !isPureAdmin
            }
            color="secondary"
            icon={CheckCircle}
          >
            {t('edge.devices.associate_and_assign')}
          </Button>
        </span>
      </TooltipWithChildren>

      <TooltipWithChildren
        message={
          licenseOverused ? (
            overusedTooltip
          ) : (
            <>按预分配的边缘组、环境组和标签关联设备</>
          )
        }
      >
        <span>
          <Button
            onClick={() => handleAssociateDevice(selectedRows)}
            data-cy="associate-device-button"
            disabled={selectedRows.length === 0 || licenseOverused}
            icon={Check}
          >
            {t('edge.devices.associate_device')}
          </Button>
        </span>
      </TooltipWithChildren>
    </>
  );

  async function handleAssociateAndAssign(
    environments: WaitingRoomEnvironment[]
  ) {
    const assigned = await openModal(withReactQuery(AssignmentDialog), {
      environments,
    });

    if (!assigned) {
      return;
    }

    handleAssociateDevice(environments);
  }

  function handleAssociateDevice(devices: Environment[]) {
    associateMutation.mutate(
      devices.map((d) => d.Id),
      {
        onSuccess() {
          notifySuccess(
            t('common.success'),
            t('edge.devices.notifications.associated')
          );
        },
      }
    );
  }

  async function handleRemoveDevice(devices: Environment[]) {
    removeMutation.mutate(
      devices.map((d) => ({ id: d.Id, name: d.Name })),
      {
        onSuccess() {
          notifySuccess(
            t('common.success'),
            t('edge.devices.notifications.hidden')
          );
        },
      }
    );
  }
}
