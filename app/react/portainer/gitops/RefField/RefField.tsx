import { PropsWithChildren, ReactNode } from 'react';
import { SchemaOf, string } from 'yup';

import { useStateWrapper } from '@/react/hooks/useStateWrapper';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { TextTip } from '@@/Tip/TextTip';

import { isBE } from '../../feature-flags/feature-flags.service';

import { RefSelector } from './RefSelector';

interface Props {
  value: string;
  onChange(value: string): void;
  sourceId?: number;
  error?: string;
}

export function RefField({ value, onChange, sourceId, error }: Props) {
  const [inputValue, updateInputValue] = useStateWrapper(value, onChange);
  const inputId = 'repository-reference-field';
  return isBE ? (
    <Wrapper
      inputId={inputId}
      errors={error}
      tip={
        <>
          按以下格式指定仓库引用：分支使用 <code>refs/heads/branch_name</code>{' '}
          ，标签使用 <code>refs/tags/tag_name</code>进行部署。
        </>
      }
    >
      <RefSelector
        inputId={inputId}
        value={value}
        onChange={onChange}
        sourceId={sourceId}
      />
    </Wrapper>
  ) : (
    <Wrapper
      inputId={inputId}
      errors={error}
      tip={
        <>
          按以下格式指定仓库引用：分支使用 <code>refs/heads/branch_name</code>{' '}
          ，标签使用 <code>refs/tags/tag_name</code>。如未指定，将使用默认{' '}
          <code>HEAD</code> 引用，通常为 <code>main</code> 分支。
        </>
      }
    >
      <Input
        id={inputId}
        data-cy="repository-reference-input"
        value={inputValue}
        onChange={(e) => updateInputValue(e.target.value)}
        placeholder="refs/heads/main"
      />
    </Wrapper>
  );
}

function Wrapper({
  tip,
  children,
  errors,
  inputId,
}: PropsWithChildren<{ tip: ReactNode; errors?: string; inputId: string }>) {
  return (
    <div className="form-group">
      <span className="col-sm-12 mb-2">
        <TextTip color="blue">{tip}</TextTip>
      </span>
      <div className="col-sm-12">
        <FormControl
          label="仓库引用"
          inputId={inputId}
          required
          errors={errors}
        >
          {children}
        </FormControl>
      </div>
    </div>
  );
}

export function refFieldValidation(): SchemaOf<string> {
  return string()
    .when({
      is: isBE,
      then: string().required('Repository reference name is required'),
    })
    .default('');
}
