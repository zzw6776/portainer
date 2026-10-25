import { TextTip } from '@@/Tip/TextTip';
import { InformationPanel } from '@@/InformationPanel';

import { useNodesCount } from '../system/useNodesCount';
import { useLicenseInfo } from '../licenses/use-license.service';
import { LicenseType } from '../licenses/types';

export function LicenseNodePanel() {
  const nodesValid = useNodesValid();

  if (nodesValid) {
    return null;
  }

  return (
    <InformationPanel title="超出许可证节点限额">
      <TextTip>已超出许可证允许的节点数量。请联系管理员。</TextTip>
    </InformationPanel>
  );
}

function useNodesValid() {
  const { isLoading: isLoadingNodes, data: nodesCount = 0 } = useNodesCount();

  const { isLoading: isLoadingLicense, info } = useLicenseInfo();
  if (
    isLoadingLicense ||
    isLoadingNodes ||
    !info ||
    info.type === LicenseType.Trial
  ) {
    return true;
  }

  return nodesCount <= info.nodes;
}
