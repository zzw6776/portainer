import { useIsEdgeAdmin } from '@/react/hooks/useUser';

import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

import { EditButton } from './EditButton';

interface Props {
  stackId: number | undefined;
}

export function EdgeEditButton({ stackId }: Props) {
  const edgeAdminQuery = useIsEdgeAdmin();

  const isDisabled =
    edgeAdminQuery.isLoading || !edgeAdminQuery.isAdmin || !stackId;

  const button = (
    <EditButton
      to="edge.stacks.edit"
      params={{ stackId }}
      disabled={isDisabled}
    >
      管理边缘堆栈
    </EditButton>
  );

  if (edgeAdminQuery.isLoading || edgeAdminQuery.isAdmin || !stackId) {
    return button;
  }

  return (
    <TooltipWithChildren message="此应用由边缘堆栈管理，只能由边缘管理员编辑">
      <span>{button}</span>
    </TooltipWithChildren>
  );
}
