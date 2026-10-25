import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';
import { describe, expect, it } from 'vitest';

import { PublicUrlField } from './PublicUrlField';

describe('PublicUrlField', () => {
  it('should render the public URL field', () => {
    renderComponent();

    const input = screen.getByLabelText('公网 IP / 域名');
    expect(input).toBeVisible();
  });

  it('should display placeholder text', () => {
    renderComponent();

    const input = screen.getByPlaceholderText(
      '例如 10.0.0.10 或 mydocker.mydomain.com'
    );
    expect(input).toBeVisible();
  });

  it('should update value on user input', async () => {
    const { publicUrl } = renderComponent();

    const input = screen.getByLabelText('公网 IP / 域名');
    await userEvent.clear(input);
    await userEvent.type(input, '10.0.0.10');

    expect(publicUrl()).toBe('10.0.0.10');
  });

  it('should display error message when field has error', () => {
    renderComponent({ initialErrors: { publicUrl: 'URL 无效' } });

    expect(screen.getByText('URL 无效')).toBeVisible();
  });
});

function renderComponent(options?: { initialErrors?: { publicUrl?: string } }) {
  const initialValues = { publicUrl: '' };
  let formValues = initialValues;

  const result = render(
    <Formik
      initialValues={initialValues}
      initialErrors={options?.initialErrors}
      onSubmit={() => {}}
    >
      {({ values }) => {
        formValues = values;
        return (
          <Form>
            <PublicUrlField />
          </Form>
        );
      }}
    </Formik>
  );

  return {
    ...result,
    publicUrl: () => formValues.publicUrl,
  };
}
