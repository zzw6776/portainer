import { FormikErrors } from 'formik';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useK8sSecrets } from '@/react/kubernetes/configs/queries/useK8sSecrets';

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

export function SecretsFormSection({
  values,
  onChange,
  errors,
  namespace,
}: Props) {
  const secretsQuery = useK8sSecrets(useEnvironmentId(), namespace);
  const secrets = secretsQuery.data || [];

  if (secretsQuery.isLoading) {
    return <InlineLoader>正在加载 Secret……</InlineLoader>;
  }

  return (
    <FormSection title="Secret" titleSize="sm">
      {!!values.length && (
        <TextTip color="blue">
          Portainer 会自动将 Secret
          的所有键公开为环境变量。可通过覆盖选项，将各个键改为挂载到文件系统。
        </TextTip>
      )}

      <InputList<ConfigurationFormValues>
        value={values}
        onChange={onChange}
        errors={errors}
        isDeleteButtonHidden
        data-cy="k8sAppCreate-secret"
        disabled={secrets.length === 0}
        addButtonError={
          secrets.length === 0 ? '此命名空间中没有可用的 Secret。' : undefined
        }
        renderItem={(item, onChange, index, error) => (
          <ConfigurationItem
            item={item}
            onChange={onChange}
            error={error}
            configurations={secrets}
            onRemoveItem={() => onRemoveItem(index)}
            index={index}
            configurationType="Secret"
          />
        )}
        itemBuilder={() => ({
          selectedConfigMap: secrets[0]?.metadata?.name || '',
          overriden: false,
          overridenKeys: [],
          selectedConfiguration: secrets[0],
        })}
        addLabel="添加 Secret"
      />
    </FormSection>
  );

  function onRemoveItem(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }
}
