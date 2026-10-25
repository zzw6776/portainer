import { useField } from 'formik';

import { DateTimeField } from '@@/DateTimeField';

import { TimeTip } from './TimeTip';

export function ScheduledDateFieldset() {
  const [{ value }, { error }, { setValue }] = useField<Date | null>(
    'dateTime'
  );
  return (
    <>
      <DateTimeField
        value={value}
        onChange={(date) => setValue(date)}
        error={error}
        label="计划日期"
        name="dateTime"
        data-cy="edge-job-date-time-picker"
      />

      <TimeTip />
    </>
  );
}
