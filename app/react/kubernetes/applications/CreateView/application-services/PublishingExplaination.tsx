import ingressDiagram from '@/assets/images/ingress-explanatory-diagram.png';

import { FormSection } from '@@/form-components/FormSection';

export function PublishingExplaination() {
  return (
    <FormSection title="说明" isFoldable titleSize="sm">
      <div className="mb-4 flex w-full flex-col items-start lg:flex-row">
        <img
          src={ingressDiagram}
          alt="ingress explaination"
          width={646}
          className="flex w-full max-w-2xl basis-1/2 flex-col rounded border border-solid border-gray-5 object-contain lg:w-1/2"
        />
        <div className="text-muted ml-8 basis-1/2 text-xs">
          通过以下方式公开应用工作负载：{' '}
          <a
            href="https://kubernetes.io/docs/concepts/services-networking/service/"
            target="_blank"
            rel="noopener noreferrer"
          >
            服务
          </a>{' '}
          和{' '}
          <a
            href="https://kubernetes.io/docs/concepts/services-networking/ingress/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ingress
          </a>
          :
          <ul className="ml-5 mt-3 [&>li>ul>li]:ml-5 [&>li]:mb-3">
            <li>
              <b>集群内部</b> 集群{' '}
              <b>
                <i>仅限</i>
              </b>{' '}
              — 通过 <b>ClusterIP</b> 服务
              <ul>
                <li>
                  <i>默认服务类型。</i>
                </li>
              </ul>
            </li>
            <li>
              <b>集群内部</b> 集群，并通过 <b>ClusterIP</b> 服务和{' '}
              <b>集群外部</b> 通过 <b>Ingress</b>
              <ul>
                <li>
                  <i>
                    Ingress 管理对集群内服务（通常为
                    ClusterIP）的外部访问，并支持定义路由规则、SSL
                    终止及其他高级功能。
                  </i>
                </li>
              </ul>
            </li>
            <li>
              <b>集群内部</b> 和 <b>集群外部</b> 集群，并通过 <b>NodePort</b>{' '}
              服务
              <ul>
                <li>
                  <i>
                    这会在每个节点的静态端口上公开工作负载，允许通过节点 IP
                    地址和端口从外部访问。通常不建议在生产环境中使用。
                  </i>
                </li>
              </ul>
            </li>
            <li>
              <b>集群内部</b> 和 <b>集群外部</b> 集群，并通过{' '}
              <b>LoadBalancer</b> 服务
              <ul>
                <li>
                  <i>
                    如果运行在云平台上，系统会自动创建云负载均衡器，并分配外部
                    IP 地址或 DNS，将流量路由到工作负载。
                  </i>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}
