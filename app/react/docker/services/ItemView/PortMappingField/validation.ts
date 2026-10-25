import {
  array,
  lazy,
  mixed,
  number,
  NumberSchema,
  object,
  SchemaOf,
} from 'yup';

import { Range, isRange } from './types';

export function validation() {
  return array(
    object({
      hostPort: rangeOrNumber(),
      containerPort: mixed().when('hostPort', {
        is: (hostPort: Range | number | undefined) =>
          !hostPort || isRange(hostPort),
        then: rangeOrNumber(),
        otherwise: port().typeError('当主机端口不是范围时，容器端口必须是数字'),
      }),
      protocol: mixed().oneOf(['tcp', 'udp']),
      publishMode: mixed().oneOf(['ingress', 'host']),
    }).test({
      message: '端口配置无效：主机端口范围必须与容器端口范围相同',
      test: (portBinding) => {
        const hostPort = portBinding.hostPort as Range | number | undefined;
        return !(
          isRange(hostPort) &&
          isRange(portBinding.containerPort) &&
          hostPort.end - hostPort.start !==
            portBinding.containerPort.end - portBinding.containerPort.start
        );
      },
    })
  );
}

function port() {
  return number()
    .optional()
    .min(0, '端口必须是 0 到 65535 之间的数字')
    .max(65535, '端口必须是 0 到 65535 之间的数字');
}

function rangeOrNumber() {
  return lazy<SchemaOf<Range> | NumberSchema>(
    (value: Range | number | undefined) => (isRange(value) ? range() : port())
  );
}

function range(): SchemaOf<Range> {
  return object({
    start: port().required(),
    end: port().required(),
  }).test({
    message: '起始端口必须小于结束端口',
    test: (value) => !value.start || !value.end || value.start <= value.end,
  });
}
