import { FormikErrors } from 'formik';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { SliderWithInput } from '@@/form-components/Slider/SliderWithInput';
import { FormControl } from '@@/form-components/FormControl';
import { FormError } from '@@/form-components/FormError';
import { Slider } from '@@/form-components/Slider';

import { ResourceQuotaFormValues } from './types';

type Props = {
  values: ResourceQuotaFormValues;
  onChange: (values: ResourceQuotaFormValues) => void;
  errors: FormikErrors<ResourceQuotaFormValues>;
  namespaceHasQuota: boolean;
  resourceQuotaCapacityExceeded: boolean;
  minMemoryLimit: number;
  minCpuLimit: number;
  maxMemoryLimit: number;
  maxCpuLimit: number;
};

export function ResourceReservationFormSection({
  values,
  onChange,
  errors,
  namespaceHasQuota,
  resourceQuotaCapacityExceeded,
  minMemoryLimit,
  minCpuLimit,
  maxMemoryLimit,
  maxCpuLimit,
}: Props) {
  return (
    <FormSection title="资源预留" titleSize="md">
      {!namespaceHasQuota && (
        <TextTip color="blue">资源预留按应用实例生效。</TextTip>
      )}
      {namespaceHasQuota && !resourceQuotaCapacityExceeded && (
        <TextTip color="blue">
          此命名空间已设置资源配额，必须指定资源预留。资源预留按应用实例生效，上限继承自命名空间配额。
        </TextTip>
      )}
      <FormControl
        className="flex flex-row"
        label="内存上限 (MB)"
        tooltip="此应用的每个实例会预留这些内存。若实例的内存使用量超过预留值，可能会触发内存不足（OOM）。"
      >
        <div className="col-xs-10">
          {maxMemoryLimit > 0 && (
            <SliderWithInput
              value={Number(values.memoryLimit) || 0}
              onChange={(value) => onChange({ ...values, memoryLimit: value })}
              min={minMemoryLimit}
              max={maxMemoryLimit}
              step={128}
              dataCy="k8sAppCreate-memoryLimit"
              visibleTooltip
            />
          )}
          {errors?.memoryLimit && (
            <FormError className="pt-1">{errors.memoryLimit}</FormError>
          )}
        </div>
      </FormControl>
      <FormControl
        className="flex flex-row"
        label="CPU 限制"
        tooltip="此应用的每个实例会预留这些 CPU。若实例的 CPU 使用量超过预留值，可能会受到 CPU 限流。"
      >
        <div className="col-xs-10">
          {maxCpuLimit > 0 && (
            <Slider
              onChange={(value) =>
                onChange(
                  typeof value === 'number'
                    ? { ...values, cpuLimit: value }
                    : { ...values, cpuLimit: value[0] ?? 0 }
                )
              }
              value={values.cpuLimit}
              min={minCpuLimit}
              max={maxCpuLimit}
              step={0.1}
              dataCy="k8sAppCreate-cpuLimitSlider"
              visibleTooltip
            />
          )}
          {errors?.cpuLimit && (
            <FormError className="pt-1">{errors.cpuLimit}</FormError>
          )}
        </div>
      </FormControl>
    </FormSection>
  );
}
