import { DockerSnapshot } from '@/react/docker/snapshots/types';
import { humanize } from '@/portainer/filters/filters';

import { ContainerStats, CPUStats, MemoryStats, NodeStats } from '@@/StatsItem';

interface Props {
  snapshot?: DockerSnapshot;
}

export function EnvironmentStatsDocker({ snapshot }: Props) {
  if (!snapshot) {
    return <>无可用快照</>;
  }

  return (
    <>
      <ContainerStats
        total={snapshot.ContainerCount}
        running={snapshot.RunningContainerCount}
        stopped={snapshot.StoppedContainerCount}
      />

      <NodeStats value={snapshot.NodeCount} />

      <CPUStats value={snapshot.TotalCPU} />

      <MemoryStats value={humanize(snapshot.TotalMemory)} />
    </>
  );
}
