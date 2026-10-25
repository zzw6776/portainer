import { number, object, SchemaOf } from 'yup';

import {
  asyncIntervalValues,
  edgeAsyncIntervalsValidation,
} from '@/react/edge/components/EdgeAsyncIntervalsForm';
import { checkinIntervalValues } from '@/react/edge/components/EdgeCheckInIntervalField';

import {
  EdgeIntervalsValues,
  toAsyncIntervalsValues,
  fromAsyncIntervalsValues,
} from './types';

/**
 * Validation schema for edge intervals.
 * Validates both sync and async mode intervals.
 */
export function edgeIntervalsValidation(): SchemaOf<EdgeIntervalsValues> {
  return object({
    checkinInterval: number()
      .required('签入间隔为必填项')
      .oneOf(checkinIntervalValues, '签入间隔无效'),
    pingInterval: number()
      .required('Ping 间隔为必填项')
      .oneOf(asyncIntervalValues, 'Ping 间隔无效'),
    snapshotInterval: number()
      .required('快照间隔为必填项')
      .oneOf(asyncIntervalValues, '快照间隔无效'),
    commandInterval: number()
      .required('命令间隔为必填项')
      .oneOf(asyncIntervalValues, '命令间隔无效'),
  });
}

// Re-export conversion helpers for use with validation
export { toAsyncIntervalsValues, fromAsyncIntervalsValues };

// Re-export async intervals validation for wizard form compatibility
export { edgeAsyncIntervalsValidation };
