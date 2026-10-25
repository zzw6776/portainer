import { FormikErrors } from 'formik';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useK8sConfigMaps } from '@/react/kubernetes/configs/queries/useK8sConfigMaps';

import { FormSection } from '@@/form-components/FormSection/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { InputList } from '@@/form-components/InputList';
import { InlineLoader } from '@@/InlineLoader';

import { ConfigurationItem } from './ConfigurationItem';
import { ConfigurationFormValues } from './types';

type Props = {
  values: ConfigurationFormValues[];
  onChange: (values: ConfigurationFormValues[]) => void;
  errors: FormikErrors<ConfigurationFormValues[]>;
  namespace: string;
};

export function ConfigMapsFormSection({
  values,
  onChange,
  errors,
  namespace,
}: Props) {
  const configMapsQuery = useK8sConfigMaps(useEnvironmentId(), namespace);
  const configMaps = configMapsQuery.data || [];

  if (configMapsQuery.isLoading) {
    return <InlineLoader>正在加载 ConfigMap……</InlineLoader>;
  }

  return (
    <FormSection title="ConfigMap" titleSize="sm">
      {!!values.length && (
        <TextTip color="blue">
          Portainer 会自动将 ConfigMap
          的所有键公开为环境变量。可通过覆盖选项，将各个键改为挂载到文件系统。
        </TextTip>
      )}

      <InputList<ConfigurationFormValues>
        value={values}
        onChange={onChange}
        errors={errors}
        isDeleteButtonHidden
        data-cy="k8sAppCreate-config"
        disabled={configMaps.length === 0}
        addButtonError={
          configMaps.length === 0
            ? '此命名空间中没有可用的 ConfigMap。'
            : undefined
        }
        renderItem={(item, onChange, index, error) => (
          <ConfigurationItem
            item={item}
            onChange={onChange}
            error={error}
            configurations={configMaps}
            onRemoveItem={() => onRemoveItem(index)}
            index={index}
            configurationType="ConfigMap"
          />
        )}
        itemBuilder={() => ({
          selectedConfigMap: configMaps[0]?.metadata?.name || '',
          overriden: false,
          overridenKeys: [],
          selectedConfiguration: configMaps[0],
        })}
        addLabel="添加 ConfigMap"
      />
    </FormSection>
  );

  function onRemoveItem(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }
}
