import _ from 'lodash-es';

angular
  .module('portainer.kubernetes')
  .filter('kubernetesNodeStatusColor', function () {
    'use strict';
    return function (text) {
      var status = _.toLower(text);
      switch (status) {
        case 'ready':
          return 'success';
        case 'warning':
          return 'warning';
        default:
          return 'danger';
      }
    };
  })
  .filter('kubernetesNodeConditionsMessage', function () {
    'use strict';
    return function (conditions) {
      if (conditions.MemoryPressure) {
        return '节点内存不足';
      }
      if (conditions.PIDPressure) {
        return '节点上运行的进程过多';
      }
      if (conditions.DiskPressure) {
        return '节点磁盘空间不足';
      }
      if (conditions.NetworkUnavailable) {
        return '节点网络配置不正确';
      }
    };
  });
