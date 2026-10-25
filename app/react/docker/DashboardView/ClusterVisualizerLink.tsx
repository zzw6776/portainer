import { TrelloIcon } from 'lucide-react';

import { Link } from '@@/Link';
import { Button } from '@@/buttons';

export function ClusterVisualizerLink() {
  return (
    <tr>
      <td colSpan={2}>
        <Button
          as={Link}
          color="link"
          icon={TrelloIcon}
          props={{
            to: 'docker.swarm.visualizer',
          }}
          data-cy="cluster-visualizer"
        >
          打开集群可视化工具
        </Button>
      </td>
    </tr>
  );
}
