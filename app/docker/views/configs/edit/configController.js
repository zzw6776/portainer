import { ResourceControlType } from '@/react/portainer/access-control/types';
import { confirmDelete } from '@@/modals/confirm';

angular.module('portainer.docker').controller('ConfigController', [
  '$scope',
  '$transition$',
  '$state',
  'ConfigService',
  'Notifications',
  'endpoint',
  function ($scope, $transition$, $state, ConfigService, Notifications, endpoint) {
    $scope.resourceType = ResourceControlType.Config;
    $scope.endpoint = endpoint;

    $scope.onUpdateResourceControlSuccess = function () {
      $state.reload();
    };

    $scope.removeConfig = async function removeConfig(configId) {
      if (!(await confirmDelete('确定要删除此配置吗？'))) {
        return;
      }

      ConfigService.remove({ environmentId: endpoint.Id, configId })
        .then(function success() {
          Notifications.success('Success', 'Configuration successfully removed');
          $state.go('docker.configs', {});
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to remove config');
        });
    };

    function initView() {
      ConfigService.config(endpoint.Id, $transition$.params().id)
        .then(function success(data) {
          $scope.config = data;
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve config details');
        });
    }

    initView();
  },
]);
