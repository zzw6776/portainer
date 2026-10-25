import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Laptop, Network } from 'lucide-react';

import { generateKey } from '@/react/portainer/environments/environment.service/edge';
import { EdgeScriptForm } from '@/react/edge/components/EdgeScriptForm';
import { commandsTabs } from '@/react/edge/components/EdgeScriptForm/scripts';
import { useSettings } from '@/react/portainer/settings/queries';
import EdgeAgentStandardIcon from '@/react/edge/components/edge-agent-standard.svg?c';
import EdgeAgentAsyncIcon from '@/react/edge/components/edge-agent-async.svg?c';
import { ConnectivityTestModal } from '@/react/edge/components/ConnectivityTestModal/ConnectivityTestModal';

import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { TextTip } from '@@/Tip/TextTip';
import { BoxSelector } from '@@/BoxSelector';
import { FormSection } from '@@/form-components/FormSection';
import { CopyButton } from '@@/buttons';
import { Button } from '@@/buttons';
import { Link } from '@@/Link';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

const commands = {
  linux: [
    commandsTabs.k8sLinux,
    commandsTabs.swarmLinux,
    commandsTabs.standaloneLinux,
    commandsTabs.podmanLinux,
  ],
  win: [commandsTabs.swarmWindows, commandsTabs.standaloneWindow],
};

const asyncModeOptions = [
  {
    icon: EdgeAgentStandardIcon,
    id: 'standard',
    label: '标准边缘 Agent',
    value: false,
    iconType: 'badge',
  },
  {
    icon: EdgeAgentAsyncIcon,
    id: 'async',
    label: '异步边缘 Agent',
    value: true,
    iconType: 'badge',
  },
] as const;

export function AutomaticEdgeEnvCreation() {
  const edgeKeyMutation = useGenerateKeyMutation();
  const { mutate: generateKey, reset: resetKey } = edgeKeyMutation;
  const settingsQuery = useSettings();
  const [asyncMode, setAsyncMode] = useState(false);

  const url = settingsQuery.data?.EdgePortainerUrl;

  const settings = settingsQuery.data;
  const edgeKey = edgeKeyMutation.data;
  const edgeComputeConfigurationOK = validateConfiguration();

  useEffect(() => {
    if (edgeComputeConfigurationOK) {
      generateKey();
    } else {
      resetKey();
    }
  }, [generateKey, edgeComputeConfigurationOK, resetKey]);

  if (!settingsQuery.data) {
    return null;
  }

  return (
    <Widget>
      <WidgetTitle icon={Laptop} title="自动创建边缘环境" />
      <WidgetBody className="form-horizontal">
        {!edgeComputeConfigurationOK ? (
          <TextTip color="orange">
            要使用此功能，请启用边缘计算功能{' '}
            <Link
              to="portainer.settings.edgeCompute"
              data-cy="edge-disabled-portainer-edge-settings-link"
            >
              此处
            </Link>{' '}
            ，并正确配置 Portainer API 服务器 URL 和隧道服务器地址。
          </TextTip>
        ) : (
          <>
            <BoxSelector
              slim
              radioName="async-mode-selector"
              value={asyncMode}
              onChange={handleChangeAsyncMode}
              options={asyncModeOptions}
            />

            <EdgeKeyInfo
              asyncMode={asyncMode}
              edgeKey={edgeKey}
              isLoading={edgeKeyMutation.isLoading}
              url={url}
              tunnelUrl={settings?.Edge.TunnelServerAddress}
            />
          </>
        )}
      </WidgetBody>
    </Widget>
  );

  function handleChangeAsyncMode(asyncMode: boolean) {
    setAsyncMode(asyncMode);
  }

  function validateConfiguration() {
    return !!(
      settings &&
      settings.EnableEdgeComputeFeatures &&
      settings.EdgePortainerUrl &&
      settings.Edge.TunnelServerAddress
    );
  }
}

// using mutation because we want this action to run only when required
function useGenerateKeyMutation() {
  return useMutation(generateKey);
}

function EdgeKeyInfo({
  isLoading,
  edgeKey,
  url,
  tunnelUrl,
  asyncMode,
}: {
  isLoading: boolean;
  edgeKey?: string;
  url?: string;
  tunnelUrl?: string;
  asyncMode: boolean;
}) {
  const [isConnectivityModalOpen, setIsConnectivityModalOpen] = useState(false);

  if (isLoading || !edgeKey) {
    return <div>正在为以下对象生成密钥： {url} ... </div>;
  }

  return (
    <>
      <hr />

      <FormSection title="边缘密钥">
        <div className="break-words">
          <code>{edgeKey}</code>
        </div>

        <CopyButton
          copyText={edgeKey}
          data-cy="edge-auto-create-copy-token-button"
        >
          复制令牌
        </CopyButton>
      </FormSection>

      <hr />

      <EdgeScriptForm
        edgeInfo={{ key: edgeKey }}
        commands={commands}
        asyncMode={asyncMode}
        showMetaFields
      >
        <TextTip color="blue">
          {!asyncMode
            ? 'Portainer 服务器 URL 和隧道服务器地址已在'
            : 'Portainer 服务器 URL 已在'}{' '}
          <Link
            to="portainer.settings.edgeCompute"
            data-cy="server-url-portainer-edge-settings-link"
          >
            此处
          </Link>{' '}
          设置
        </TextTip>
        <FormControl label="Portainer API 服务器 URL">
          <Input value={url} readOnly data-cy="edge-auto-create-url-input" />
        </FormControl>

        {!asyncMode && (
          <FormControl label="Portainer 隧道服务器地址">
            <Input
              value={tunnelUrl}
              readOnly
              data-cy="edge-auto-create-tunnel-address-input"
            />
          </FormControl>
        )}

        <Button
          color="default"
          className="!ml-0 mb-8"
          icon={Network}
          onClick={() => setIsConnectivityModalOpen(true)}
          data-cy="edge-auto-create-test-connectivity-button"
        >
          测试连通性
        </Button>
      </EdgeScriptForm>

      {isConnectivityModalOpen && url && (
        <ConnectivityTestModal
          portainerUrl={url}
          tunnelServerAddr={!asyncMode ? tunnelUrl : undefined}
          onDismiss={() => setIsConnectivityModalOpen(false)}
        />
      )}
    </>
  );
}
