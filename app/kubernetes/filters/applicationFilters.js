import { cpuHumanValue } from '@/react/kubernetes/applications/utils/cpuHumanValue';
import { nodeAffinityValues } from './application';

angular
  .module('portainer.kubernetes')
  .filter('kubernetesApplicationCPUValue', function () {
    'use strict';
    return cpuHumanValue;
  })
  .filter('kubernetesApplicationDataAccessPolicyIcon', function () {
    'use strict';
    return function (value) {
      switch (value) {
        case 'Isolated':
          return 'boxes';
        case 'Shared':
          return 'box';
      }
    };
  })
  .filter('kubernetesApplicationDataAccessPolicyTooltip', function () {
    'use strict';
    return function (value) {
      switch (value) {
        case 'Isolated':
          return '此应用的所有实例都使用各自独立的数据。';
        case 'Shared':
          return '此应用的所有实例共享同一份数据。';
      }
    };
  })
  .filter('kubernetesApplicationConstraintNodeAffinityValue', function () {
    'use strict';
    return nodeAffinityValues;
  })
  .filter('kubernetesNodeLabelHumanReadbleText', function () {
    'use strict';
    return function (text) {
      const values = {
        'kubernetes.io/os': '操作系统',
        'kubernetes.io/arch': '架构',
        'kubernetes.io/hostname': '节点',
      };
      return values[text] || text;
    };
  })
  .filter('kubernetesApplicationIngressEmptyHostname', function () {
    'use strict';
    return function (value) {
      if (value === '') {
        return '<使用 IP>';
      } else {
        return value;
      }
    };
  });
