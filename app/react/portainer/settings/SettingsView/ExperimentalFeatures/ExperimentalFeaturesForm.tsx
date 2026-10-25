import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useCallback } from 'react';
import { FlaskConical } from 'lucide-react';

import { notifySuccess } from '@/portainer/services/notifications';
import { ExperimentalFeatures } from '@/react/portainer/settings/types';
import { useUpdateExperimentalSettingsMutation } from '@/react/portainer/settings/queries';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { TextTip } from '@@/Tip/TextTip';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FormValues {}

const validation = yup.object({});

interface Props {
  settings: ExperimentalFeatures;
}

export function ExperimentalFeaturesSettingsForm({ settings }: Props) {
  const initialValues: FormValues = settings;

  const mutation = useUpdateExperimentalSettingsMutation();

  const { mutate: updateSettings } = mutation;

  const handleSubmit = useCallback(() => {
    updateSettings(
      {},
      {
        onSuccess() {
          notifySuccess('成功', '实验性功能设置更新成功');
        },
      }
    );
  }, [updateSettings]);

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validation}
      validateOnMount
      enableReinitialize
    >
      {({ isValid, dirty }) => (
        <Form className="form-horizontal">
          <TextTip color="blue" icon={FlaskConical}>
            实验性功能可能会在不另行通知的情况下停止提供。
          </TextTip>

          <br />
          <br />

          <div className="form-group col-sm-12 text-muted small">
            Portainer
            版本中可能会包含处于试验阶段的功能。这些功能仍在早期开发阶段，测试有限。
            <br />
            我们的目标是尽早收集用户反馈，以持续改进这些功能。禁用实验性功能后将无法再访问它。
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                loadingText="正在保存设置……"
                isLoading={mutation.isLoading}
                disabled={!isValid || !dirty}
                className="!ml-0"
                data-cy="settings-experimentalButton"
              >
                保存实验性功能设置
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
