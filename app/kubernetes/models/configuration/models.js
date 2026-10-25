export const KubernetesPortainerConfigurationOwnerLabel = 'io.portainer.kubernetes.configuration.owner';
export const KubernetesPortainerConfigurationDataAnnotation = 'io.portainer.kubernetes.configuration.data';

/**
 * Configuration Model (Composite)
 */
const _KubernetesConfiguration = Object.freeze({
  Id: 0,
  Name: '',
  Kind: '',
  Namespace: '',
  CreationDate: '',
  ConfigurationOwner: '',
  Used: false,
  Applications: [],
  Data: {},
  SecretType: '',
});

export class KubernetesConfiguration {
  constructor() {
    Object.assign(this, JSON.parse(JSON.stringify(_KubernetesConfiguration)));
  }
}

export const KubernetesConfigurationKinds = Object.freeze({
  CONFIGMAP: 1,
  SECRET: 2,
});

export const KubernetesSecretTypeOptions = Object.freeze({
  OPAQUE: { name: '不透明数据 (Opaque)', value: 'Opaque' },
  SERVICEACCOUNTTOKEN: { name: '服务账号令牌', value: 'kubernetes.io/service-account-token' },
  DOCKERCFG: { name: 'Dockercfg', value: 'kubernetes.io/dockercfg' },
  DOCKERCONFIGJSON: { name: 'Dockerconfigjson', value: 'kubernetes.io/dockerconfigjson' },
  BASICAUTH: { name: '基本身份验证', value: 'kubernetes.io/basic-auth' },
  SSHAUTH: { name: 'SSH 身份验证', value: 'kubernetes.io/ssh-auth' },
  TLS: { name: 'TLS', value: 'kubernetes.io/tls' },
  BOOTSTRAPTOKEN: { name: '引导令牌', value: 'bootstrap.kubernetes.io/token' },
  CUSTOM: { name: '自定义', value: 'Custom' },
});
