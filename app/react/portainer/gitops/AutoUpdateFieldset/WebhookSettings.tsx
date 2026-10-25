import { truncateLeftRight } from '@/portainer/filters/filters';

import { HelpLink } from '@@/HelpLink';
import { CopyButton } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';

export function WebhookSettings({
  value,
  baseUrl,
  docsLink,
}: {
  docsLink?: string;
  value: string;
  baseUrl: string;
}) {
  const url = `${baseUrl}/${value}`;

  return (
    <FormControl
      label="网络钩子 URL"
      tooltip={
        !!docsLink && (
          <>
            请参阅{' '}
            <HelpLink docLink={docsLink}>Portainer 网络钩子使用文档</HelpLink>
            进行部署。
          </>
        )
      }
    >
      <div className="flex items-center gap-2">
        <span
          className="text-muted"
          aria-label="网络钩子 URL"
          role="textbox"
          aria-readonly
        >
          {truncateLeftRight(url)}
        </span>
        <CopyButton
          copyText={url}
          color="light"
          data-cy="copy-webhook-link-button"
        >
          复制链接
        </CopyButton>
      </div>
    </FormControl>
  );
}
