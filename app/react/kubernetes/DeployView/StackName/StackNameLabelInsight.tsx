import { useCurrentUser } from '@/react/hooks/useUser';

import { InsightsBox } from '@@/InsightsBox';
import { Link } from '@@/Link';

export function StackNameLabelInsight() {
  const { isPureAdmin } = useCurrentUser();
  const insightsBoxContent = (
    <>
      下方的堆栈字段以前标记为“名称”，但实际上它一直表示堆栈名称，因此现已更正标签。
      {isPureAdmin && (
        <>
          <br />
          可通过以下位置完全关闭 Kubernetes 堆栈功能：{' '}
          <Link
            to="portainer.settings"
            target="_blank"
            data-cy="k8s-deploy-settings-link"
          >
            Kubernetes 设置
          </Link>
          进行部署。
        </>
      )}
    </>
  );

  return (
    <InsightsBox
      type="slim"
      header="堆栈"
      content={insightsBoxContent}
      insightCloseId="k8s-stacks-name"
    />
  );
}
