import { useStore } from 'zustand';

import { TextTip } from '@@/Tip/TextTip';
import { FormSection } from '@@/form-components/FormSection';

import { summaryStore } from './store';

export type SummaryAction = {
  action: string;
  kind: string;
  name: string;
  type?: string;
};

type Props = {
  actions?: SummaryAction[];
  cpuLimit?: string | null;
  memoryLimit?: string | null;
};

export function KubernetesSummaryView({
  actions = [],
  cpuLimit,
  memoryLimit,
}: Props) {
  const { isExpanded, setIsExpanded } = useStore(summaryStore);

  if (actions.length === 0) {
    return null;
  }

  return (
    <FormSection
      title="摘要"
      isFoldable
      defaultFolded={!isExpanded}
      setIsDefaultFolded={(isFolded) => setIsExpanded(!isFolded)}
    >
      <TextTip color="blue">Portainer 将执行以下 Kubernetes 操作。</TextTip>
      <ul className="small text-muted ml-5 w-full">
        {actions.map((action, idx) => {
          if (!action.action || !action.kind || !action.name) {
            return null;
          }
          return (
            <li key={`${idx}-${action.kind}-${action.name}`}>
              {`${action.action} ${getArticle(action.action)} `}
              <span className="bold">{action.kind}</span>
              {' named '}
              <code>{action.name}</code>
              {!!action.type && (
                <span>
                  {' of type '}
                  <code>{action.type}</code>
                </span>
              )}
            </li>
          );
        })}
        {!!memoryLimit && (
          <li>
            将内存资源限制和请求设置为 <code>{memoryLimit}M</code>
          </li>
        )}
        {!!cpuLimit && (
          <li>
            将 CPU 资源限制和请求设置为 <code>{cpuLimit}</code>
          </li>
        )}
      </ul>
    </FormSection>
  );
}

function getArticle(resourceAction: string): string {
  if (resourceAction !== 'Create') {
    return 'the';
  }
  return 'a';
}
