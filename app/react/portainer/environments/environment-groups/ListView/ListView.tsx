import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';
import { AddButton } from '@@/buttons';

import { EnvironmentGroupsTable } from './EnvironmentGroupsTable/EnvironmentGroupsTable';

export function ListView() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('groups.title')}
        breadcrumbs={t('groups.breadcrumbs')}
        reload
      >
        <AddButton to=".new" data-cy="add-environment-group-button">
          Add group
        </AddButton>
      </PageHeader>

      <div className="mx-5 mb-5">
        <EnvironmentGroupsTable />
      </div>
    </>
  );
}
