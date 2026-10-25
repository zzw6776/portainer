import { Field, Form, Formik } from 'formik';
import { object, SchemaOf, string } from 'yup';

import { useUpgradeEditionMutation } from '@/react/portainer/system/useUpgradeEditionMutation';
import { notifySuccess } from '@/portainer/services/notifications';

import { Button, LoadingButton } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { Modal } from '@@/modals/Modal';
import { Alert } from '@@/Alert';

interface FormValues {
  license: string;
}

const initialValues: FormValues = {
  license: '',
};

export function UploadLicenseDialog({
  onDismiss,
  goToLoading,
  goToGetLicense,
  isGetLicenseSubmitted,
}: {
  onDismiss: () => void;
  goToLoading: () => void;
  goToGetLicense: () => void;
  isGetLicenseSubmitted: boolean;
}) {
  const upgradeMutation = useUpgradeEditionMutation();

  return (
    <Modal onDismiss={onDismiss} aria-label="将 Portainer 升级到商业版">
      <Modal.Header
        title={<h4 className="text-xl font-medium">升级 Portainer</h4>}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validation}
        validateOnMount
      >
        {({ errors }) => (
          <Form noValidate>
            <Modal.Body>
              {!isGetLicenseSubmitted ? (
                <p className="font-semibold text-gray-7">
                  请在下方输入 Portainer 许可证
                </p>
              ) : (
                <div className="mb-4">
                  <Alert color="success" title="许可证已成功发送">
                    请查收邮件，并将许可证复制到下方字段以升级 Portainer。
                  </Alert>
                </div>
              )}

              <FormControl
                label="许可证"
                errors={errors.license}
                required
                size="vertical"
              >
                <Field name="license" as={Input} required />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex w-full gap-2 [&>*]:w-1/2">
                <Button
                  color="default"
                  data-cy="get-license-button"
                  size="medium"
                  className="w-full"
                  onClick={goToGetLicense}
                >
                  获取许可证
                </Button>
                <LoadingButton
                  color="primary"
                  data-cy="start-upgrade-button"
                  size="medium"
                  loadingText="正在验证许可证"
                  isLoading={upgradeMutation.isLoading}
                >
                  开始升级
                </LoadingButton>
              </div>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );

  function handleSubmit(values: FormValues) {
    upgradeMutation.mutate(values, {
      onSuccess() {
        notifySuccess('正在开始升级', '许可证验证成功');
        goToLoading();
      },
    });
  }
}

function validation(): SchemaOf<FormValues> {
  return object().shape({
    license: string()
      .required('许可证为必填项')
      .matches(/^\d-.+/, 'License is invalid'),
  });
}
