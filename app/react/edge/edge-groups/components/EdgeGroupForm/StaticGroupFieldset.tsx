import { useFormikContext } from 'formik';

import { AssociatedEdgeGroupEnvironmentsSelector } from '@/react/edge/components/AssociatedEdgeGroupEnvironmentsSelector';

import { FormSection } from '@@/form-components/FormSection';
import { confirmDestructive } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

import { FormValues } from './types';

export function StaticGroupFieldset({ isEdit }: { isEdit?: boolean }) {
  const { values, setFieldValue, errors } = useFormikContext<FormValues>();

  return (
    <FormSection title="关联环境">
      <div className="form-group">
        <AssociatedEdgeGroupEnvironmentsSelector
          value={values.environmentIds}
          error={errors.environmentIds}
          onChange={async (environmentIds, meta) => {
            if (meta.type === 'remove' && isEdit) {
              const confirmed = await confirmDestructive({
                title: '确认操作',
                message: '从此组中移除环境也会移除其对应的边缘堆栈',
                confirmButton: buildConfirmButton('确认'),
              });

              if (!confirmed) {
                return;
              }
            }

            setFieldValue('environmentIds', environmentIds);
          }}
          edgeGroupId={values.edgeGroupId}
        />
      </div>
    </FormSection>
  );
}
