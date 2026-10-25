import { Field, useField } from 'formik';
import { string } from 'yup';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

interface Props {
  fieldName: string;
  readonly?: boolean;
  required?: boolean;
}

export function PortainerTunnelAddrField({
  fieldName,
  readonly,
  required,
}: Props) {
  const [, metaProps] = useField(fieldName);
  const id = `${fieldName}-input`;

  return (
    <FormControl
      label="Portainer 隧道服务器地址"
      tooltip="边缘代理将使用此 Portainer 实例地址建立反向隧道。"
      required
      errors={metaProps.error}
      inputId={id}
    >
      <Field
        id={id}
        name={fieldName}
        as={Input}
        placeholder="portainer.mydomain.tld"
        required={required}
        readOnly={readonly}
      />
    </FormControl>
  );
}

export function validation() {
  return string()
    .required('Tunnel server address is required')
    .test(
      'valid tunnel server URL',
      'The tunnel server address must be a valid address (localhost cannot be used)',
      (value) => {
        if (!value) {
          return false;
        }

        return !value.startsWith('localhost');
      }
    );
}

/**
 * Returns an address that can be used as a default value for the Portainer tunnel server address
 * based on the current window location.
 * Used for Edge Compute.
 *
 */
export function buildDefaultValue() {
  return `${window.location.hostname}:8000`;
}
