import { Form, Formik } from 'formik';

import { addPlural } from '@/portainer/helpers/strings';
import { useUpdateEnvironmentsRelationsMutation } from '@/react/portainer/environments/queries/useUpdateEnvironmentsRelationsMutation';
import { notifySuccess } from '@/portainer/services/notifications';
import { BetaAlert } from '@/react/portainer/environments/update-schedules/common/BetaAlert';

import { Checkbox } from '@@/form-components/Checkbox';
import { FormControl } from '@@/form-components/FormControl';
import { OnSubmit, Modal } from '@@/modals';
import { TextTip } from '@@/Tip/TextTip';
import { Button, LoadingButton } from '@@/buttons';

import { WaitingRoomEnvironment } from '../../types';

import { GroupSelector, EdgeGroupsSelector, TagSelector } from './Selectors';
import { FormValues } from './types';
import { isAssignedToGroup } from './utils';
import { createPayload } from './createPayload';

export function AssignmentDialog({
  onSubmit,
  environments,
}: {
  onSubmit: OnSubmit<boolean>;
  environments: Array<WaitingRoomEnvironment>;
}) {
  const assignRelationsMutation = useUpdateEnvironmentsRelationsMutation();

  const initialValues: FormValues = {
    group: 1,
    overrideGroup: false,
    edgeGroups: [],
    overrideEdgeGroups: false,
    tags: [],
    overrideTags: false,
  };

  const hasPreAssignedEdgeGroups = environments.some(
    (e) => e.EdgeGroups?.length > 0
  );
  const hasPreAssignedTags = environments.some((e) => e.TagIds.length > 0);
  const hasPreAssignedGroup = environments.some((e) => isAssignedToGroup(e));

  return (
    <Modal aria-label="关联与分配" onDismiss={() => onSubmit()} size="lg">
      <Modal.Header
        title={`Associate with assignment (${addPlural(
          environments.length,
          '所选边缘环境'
        )})`}
      />
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({ values, setFieldValue, errors }) => (
          <Form noValidate>
            <Modal.Body>
              <div>
                <FormControl
                  size="vertical"
                  label="组"
                  tooltip="用于通过用户访问权限管理 RBAC"
                  errors={errors.group}
                >
                  <GroupSelector />

                  {hasPreAssignedGroup && (
                    <div className="mt-2">
                      <Checkbox
                        label="覆盖预分配的环境组"
                        data-cy="override-group-checkbox"
                        id="overrideGroup"
                        bold={false}
                        checked={values.overrideGroup}
                        onChange={(e) =>
                          setFieldValue('overrideGroup', e.target.checked)
                        }
                      />
                    </div>
                  )}
                </FormControl>

                <FormControl
                  size="vertical"
                  label="边缘组"
                  tooltip="管理边缘任务和边缘堆栈部署所必需"
                  errors={errors.edgeGroups}
                >
                  <EdgeGroupsSelector />

                  {hasPreAssignedEdgeGroups && (
                    <div className="mt-2">
                      <Checkbox
                        label="覆盖预分配的边缘组"
                        data-cy="override-edge-groups-checkbox"
                        bold={false}
                        id="overrideEdgeGroups"
                        checked={values.overrideEdgeGroups}
                        onChange={(e) =>
                          setFieldValue('overrideEdgeGroups', e.target.checked)
                        }
                      />
                    </div>
                  )}
                </FormControl>

                <div className="mb-3">
                  <TextTip color="blue">
                    此处只能创建静态边缘组；请使用标签将设备分配到动态边缘组。
                  </TextTip>
                </div>

                <FormControl
                  size="vertical"
                  label="标签"
                  tooltip="分配标签后，环境会自动加入使用这些标签的动态边缘组，并接收部署到该边缘组的边缘任务或堆栈。"
                  errors={errors.tags}
                >
                  <TagSelector />

                  {hasPreAssignedTags && (
                    <div className="mt-2">
                      <Checkbox
                        label="覆盖预分配的标签"
                        data-cy="override-tags-checkbox"
                        bold={false}
                        id="overrideTags"
                        checked={values.overrideTags}
                        onChange={(e) =>
                          setFieldValue('overrideTags', e.target.checked)
                        }
                      />
                    </div>
                  )}
                </FormControl>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => onSubmit()}
                color="default"
                data-cy="waiting-room-cancel-assignment-button"
              >
                取消
              </Button>
              <LoadingButton
                isLoading={assignRelationsMutation.isLoading}
                data-cy="waiting-room-associate-button"
                loadingText="正在关联……"
              >
                关联
              </LoadingButton>
            </Modal.Footer>
            <div className="mt-2">
              <BetaAlert
                message={
                  <>
                    <b>测试功能</b> —
                    此功能目前处于测试阶段，部分功能可能无法按预期工作。
                  </>
                }
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );

  function handleSubmit(values: FormValues) {
    assignRelationsMutation.mutate(
      Object.fromEntries(environments.map((e) => createPayload(e, values))),
      {
        onSuccess: () => {
          notifySuccess('成功', '边缘环境分配成功');
          onSubmit(true);
        },
      }
    );
  }
}
