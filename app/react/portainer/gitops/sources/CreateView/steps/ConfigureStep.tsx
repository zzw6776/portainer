import { useFormikContext } from 'formik';
import { ComponentType } from 'react';

import { Widget } from '@@/Widget';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { FormValues } from '../type';
import { validationSchema } from '../validation';

import { ConfigureGit } from './ConfigureGit';
import { ConfigureHelm } from './ConfigureHelm';
import { ConfigureRegistry } from './ConfigureRegistry';

const panels: Record<
  FormValues['type'],
  { title: string; component: ComponentType }
> = {
  git: { title: 'Git 仓库', component: ConfigureGit },
  helm: { title: 'Helm 仓库', component: ConfigureHelm },
  registry: { title: 'OCI 镜像仓库', component: ConfigureRegistry },
};

export function ConfigureStep() {
  const { values } = useFormikContext<FormValues>();

  const { title, component: ConfigurePanel } = panels[values.type];

  return (
    <>
      <Widget.Title
        title={`Configure ${title}`}
        subtitle="Enter the connection details and test the connection before proceeding"
      />
      <Widget.Body>
        <SharedFields />
        <ConfigurePanel />
      </Widget.Body>
    </>
  );
}

export function validateConfigureStep() {
  return validationSchema().pick(['name', 'git']);
}

function SharedFields() {
  const { values, errors, setFieldValue } = useFormikContext<FormValues>();

  return (
    <div className="grid">
      <FormControl
        inputId="source-name-input"
        label="源名称"
        required
        errors={errors.name}
        tooltip="用于在 Portainer 中标识此源的唯一名称"
      >
        <Input
          id="source-name-input"
          value={values.name}
          data-cy="source-name-input"
          placeholder="my-source"
          required
          onChange={({ target: { value } }) => setFieldValue('name', value)}
        />
      </FormControl>
    </div>
  );
}
