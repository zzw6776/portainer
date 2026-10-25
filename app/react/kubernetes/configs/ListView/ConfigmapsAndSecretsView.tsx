import { FileCode, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';
import { Tab, WidgetTabs, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { ConfigMapsDatatable } from './ConfigMapsDatatable';
import { SecretsDatatable } from './SecretsDatatable';

const tabs: Tab[] = [
  {
    name: 'ConfigMap',
    icon: FileCode,
    widget: <ConfigMapsDatatable />,
    selectedTabParam: 'configmaps',
  },
  {
    name: 'Secret',
    icon: Lock,
    widget: <SecretsDatatable />,
    selectedTabParam: 'secrets',
  },
];

export function ConfigmapsAndSecretsView() {
  const { t } = useTranslation();
  const currentTabIndex = useCurrentTabIndex(tabs);
  return (
    <>
      <PageHeader
        title="ConfigMap 和 Secret 列表"
        breadcrumbs={t('kubernetes.configmaps.breadcrumbs')}
        reload
      />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
