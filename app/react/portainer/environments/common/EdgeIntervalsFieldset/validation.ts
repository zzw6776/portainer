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
      .required('Check-in interval is required')
      .oneOf(checkinIntervalValues, 'Invalid check-in interval'),
    pingInterval: number()
      .required('Ping interval is required')
      .oneOf(asyncIntervalValues, 'Invalid ping interval'),
    snapshotInterval: number()
      .required('Snapshot interval is required')
      .oneOf(asyncIntervalValues, 'Invalid snapshot interval'),
    commandInterval: number()
      .required('Command interval is required')
      .oneOf(asyncIntervalValues, 'Invalid command interval'),
  });
}

// Re-export conversion helpers for use with validation
export { toAsyncIntervalsValues, fromAsyncIntervalsValues };

// Re-export async intervals validation for wizard form compatibility
export { edgeAsyncIntervalsValidation };
