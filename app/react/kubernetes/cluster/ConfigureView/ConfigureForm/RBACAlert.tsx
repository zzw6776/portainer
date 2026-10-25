import { Alert } from '@@/Alert';

export function RBACAlert() {
  return (
    <Alert color="warn" className="mb-4">
      <div className="flex flex-col">
        <p>您的集群未启用 Kubernetes 基于角色的访问控制（RBAC）。</p>
        <p>
          这意味着无法使用 Portainer RBAC 功能按用户角色控制对环境资源的访问。
        </p>
        <p className="mb-0">
          要启用 RBAC，请启动&nbsp;
          <a
            className="th-highcontrast:text-blue-4 th-dark:text-blue-7"
            href="https://kubernetes.io/docs/concepts/overview/components/#kube-apiserver"
            target="_blank"
            rel="noreferrer"
          >
            API 服务器
          </a>
          &nbsp;，并使用&nbsp;
          <code className="bg-gray-4 box-decoration-clone th-highcontrast:bg-black th-dark:bg-black">
            --authorization-mode
          </code>
          &nbsp;参数，并将其设置为包含以下值的逗号分隔列表：&nbsp;
          <code className="bg-gray-4 th-highcontrast:bg-black th-dark:bg-black">
            RBAC
          </code>
          ，例如：&nbsp;
          <code className="bg-gray-4 box-decoration-clone th-highcontrast:bg-black th-dark:bg-black">
            kube-apiserver --authorization-mode=Example1,RBAC,Example2
          </code>
          进行部署。
        </p>
      </div>
    </Alert>
  );
}
