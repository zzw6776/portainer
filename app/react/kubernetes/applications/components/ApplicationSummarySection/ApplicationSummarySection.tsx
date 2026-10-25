import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { ApplicationFormValues } from '../../types';

import { getAppResourceSummaries, getArticle } from './utils';
import { Summary } from './types';

type Props = {
  formValues: ApplicationFormValues;
  oldFormValues: ApplicationFormValues;
};

export function ApplicationSummarySection({
  formValues,
  oldFormValues,
}: Props) {
  // extract cpu and memory requests & limits for pod
  const limits = {
    cpu: formValues.CpuLimit,
    memory: formValues.MemoryLimit,
  };
  const appResourceSummaries = getAppResourceSummaries(
    formValues,
    oldFormValues
  );

  if (!appResourceSummaries || appResourceSummaries?.length === 0) {
    return null;
  }

  return (
    <FormSection title="摘要" isFoldable defaultFolded={false}>
      <TextTip color="blue">Portainer 将执行以下 Kubernetes 操作。</TextTip>
      <ul className="small text-muted ml-5 w-full">
        {appResourceSummaries.map((summary) => (
          <SummaryItem key={JSON.stringify(summary)} summary={summary} />
        ))}
        {!!limits.memory && (
          <li>
            将内存资源限制和请求设置为 <code>{limits.memory}M</code>
          </li>
        )}
        {!!limits.cpu && (
          <li>
            将 CPU 资源限制和请求设置为 <code>{limits.cpu}</code>
          </li>
        )}
      </ul>
    </FormSection>
  );
}

function SummaryItem({ summary }: { summary: Summary }) {
  return (
    <li>
      {`${summary.action} ${getArticle(summary.kind, summary.action)} `}
      <span className="bold">{summary.kind}</span>
      {' named '}
      <code>{summary.name}</code>
      {!!summary.type && (
        <span>
          {' of type '}
          <code>{summary.type}</code>
        </span>
      )}
    </li>
  );
}
