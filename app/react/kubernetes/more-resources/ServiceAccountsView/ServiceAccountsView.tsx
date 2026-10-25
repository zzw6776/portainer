import { useTranslation } from 'react-i18next';

import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@/PageHeader';

import { ServiceAccountsDatatable } from './ServiceAccountsDatatable';

export function ServiceAccountsView() {
  const { t } = useTranslation();
  useUnauthorizedRedirect(
    { authorizations: ['K8sServiceAccountsW'], adminOnlyCE: true },
    { to: 'kubernetes.dashboard' }
  );
  return (
    <>
      <PageHeader
        title="服务账户列表"
        breadcrumbs={t('kubernetes.service_accounts.breadcrumbs')}
        reload
      />
      <ServiceAccountsDatatable />
    </>
  );
}
