import { RefreshCwIcon } from 'lucide-react';

import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { Card } from '@@/primitives/Card';

import { PollingIntervalScopeTip } from '../../components/PollingIntervalScopeTip';

import { DetailField } from './DetailField';

interface Props {
  interval?: string;
}

export function PollingWidget({ interval }: Props) {
  return (
    <Card.Container>
      <Card.Header
        icon={RefreshCwIcon}
        title="轮询间隔"
        subtitle="Periodically fetch this repository to detect changes"
      />
      <Card.Body>
        <div className="grid grid-cols-2 gap-4">
          <DetailField label="状态">
            <span className="text-gray-6 th-dark:text-gray-5">
              {interval ? 'Enabled' : 'Disabled'}
            </span>
          </DetailField>
          {interval && (
            <DetailField label="间隔">
              <span className="text-gray-6 th-dark:text-gray-5">
                {interval}
              </span>
            </DetailField>
          )}
        </div>
        {interval && !isBE && <PollingIntervalScopeTip />}
      </Card.Body>
    </Card.Container>
  );
}
