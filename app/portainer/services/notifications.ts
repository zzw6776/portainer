import _ from 'lodash';
import toastr from 'toastr';
import sanitize from 'sanitize-html';
import { v4 as uuid } from 'uuid';

import { get as localStorageGet } from '@/react/hooks/useLocalStorage';
import { notificationsStore } from '@/react/portainer/notifications/notifications-store';
import { ToastNotification } from '@/react/portainer/notifications/types';

import hardcodedTranslations from '../../../translations/hardcoded-zh-CN.json';

const { addNotification } = notificationsStore.getState();

toastr.options = {
  timeOut: 3000,
  closeButton: true,
  progressBar: true,
  tapToDismiss: false,
  escapeHtml: true,
  // custom button, using the lucide icon x.svg inside
  closeHtml: `<button type="button"><svg
  xmlns="http://www.w3.org/2000/svg"
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg></button>`,
};

export function notifySuccess(title: string, text: string) {
  const localizedTitle = localizeText(title);
  const localizedText = localizeText(text);
  saveNotification(localizedTitle, localizedText, 'success');
  toastr.success(
    sanitize(_.escape(localizedText)),
    sanitize(_.escape(localizedTitle))
  );
}

export function notifyWarning(title: string, text: string) {
  const localizedTitle = localizeText(title);
  const localizedText = localizeText(text);
  saveNotification(localizedTitle, localizedText, 'warning');
  toastr.warning(sanitize(_.escape(localizedText)), sanitize(localizedTitle), {
    timeOut: 6000,
  });
}

export function notifyError(title: string, e?: unknown, fallbackText = '') {
  const rawMsg = pickErrorMsg(e) || fallbackText;
  const localizedTitle = localizeText(title);
  const msg = localizeText(rawMsg);
  saveNotification(localizedTitle, msg, 'error');

  if (!_.get(e, 'resource.password')) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  if (rawMsg !== 'Invalid JWT token') {
    toastr.error(sanitize(_.escape(msg)), sanitize(localizedTitle), {
      timeOut: 6000,
    });
  }
}

function localizeText(text: string) {
  const exact =
    hardcodedTranslations[text as keyof typeof hardcodedTranslations];
  if (exact) {
    return exact;
  }

  const rules: Array<[RegExp, string]> = [
    [/^Unable to\s+/i, '无法'],
    [/^Failed to\s+/i, '未能'],
    [/^Failure to\s+/i, '无法'],
    [/^Error generating\s+/i, '生成失败：'],
    [/^Invalid\s+/i, '无效：'],
    [/^Unknown\s+/i, '未知：'],
    [/^Unsupported\s+/i, '不支持：'],
    [/^Missing\s+/i, '缺少：'],
    [/^No\s+/i, '没有'],
  ];

  const rule = rules.find(([pattern]) => pattern.test(text));
  if (!rule) {
    return text;
  }

  const [pattern, prefix] = rule;
  const fragment = text.replace(pattern, '');
  const translatedFragment = translateMessageFragment(fragment);
  return translatedFragment === fragment
    ? text
    : `${prefix}${translatedFragment}`;
}

function translateMessageFragment(text: string) {
  const phrases: Array<[RegExp, string]> = [
    [/access control information/gi, '访问控制信息'],
    [/access tokens?/gi, '访问令牌'],
    [/administrator account existence/gi, '管理员账户是否存在'],
    [/application related events/gi, '应用相关事件'],
    [/application revisions/gi, '应用修订版本'],
    [/application settings/gi, '应用设置'],
    [/application status/gi, '应用状态'],
    [/application details/gi, '应用详情'],
    [/application logs/gi, '应用日志'],
    [/applications count/gi, '应用数量'],
    [/backup S3 settings/gi, 'S3 备份设置'],
    [/backup status/gi, '备份状态'],
    [/build cache/gi, '构建缓存'],
    [/cluster role bindings/gi, '集群角色绑定'],
    [/cluster roles/gi, '集群角色'],
    [/container groups?/gi, '容器组'],
    [/container statistics/gi, '容器统计信息'],
    [/container stats/gi, '容器统计信息'],
    [/container top/gi, '容器进程信息'],
    [/cron jobs?/gi, 'CronJob'],
    [/custom template file content/gi, '自定义模板文件内容'],
    [/custom template content/gi, '自定义模板内容'],
    [/custom templates?/gi, '自定义模板'],
    [/dashboard stats/gi, '仪表盘统计信息'],
    [/default registry settings/gi, '默认镜像仓库设置'],
    [/Docker storage usage/gi, 'Docker 存储使用情况'],
    [/DockerHub pull rate limits/gi, 'Docker Hub 拉取速率限制'],
    [/Edge update schedules?/gi, 'Edge 更新计划'],
    [/effective access/gi, '有效访问权限'],
    [/engine events/gi, '引擎事件'],
    [/environment group/gi, '环境组'],
    [/environment health/gi, '环境健康状态'],
    [/environment relations/gi, '环境关联关系'],
    [/environment summary counts/gi, '环境汇总数量'],
    [/environment details/gi, '环境详情'],
    [/experimental settings/gi, '实验性设置'],
    [/external stacks?/gi, '外部堆栈'],
    [/helm application history/gi, 'Helm 应用历史记录'],
    [/helm application details/gi, 'Helm 应用详情'],
    [/Helm chart values/gi, 'Helm Chart 配置值'],
    [/Helm manifest preview/gi, 'Helm 清单预览'],
    [/helm repositories for user/gi, '用户的 Helm 仓库'],
    [/helm registries/gi, 'Helm 镜像仓库'],
    [/helm charts?/gi, 'Helm Chart'],
    [/horizontal pod autoscalers?/gi, 'Pod 水平自动扩缩器'],
    [/horizontalPodAutoScalers?/g, 'Pod 水平自动扩缩器'],
    [/image pull secrets/gi, '镜像拉取 Secret'],
    [/image layers/gi, '镜像层'],
    [/ingress controllers?/gi, 'Ingress 控制器'],
    [/ingress classes/gi, 'Ingress 类'],
    [/Kubernetes cluster version/gi, 'Kubernetes 集群版本'],
    [/Kubernetes endpoints/gi, 'Kubernetes 端点'],
    [/metrics for all nodes/gi, '所有节点的指标'],
    [/metrics for all pods/gi, '所有 Pod 的指标'],
    [/metrics for node/gi, '节点指标'],
    [/metrics for pod/gi, 'Pod 指标'],
    [/network details/gi, '网络详情'],
    [/namespace YAML/gi, '命名空间 YAML'],
    [/namespaces count/gi, '命名空间数量'],
    [/node details/gi, '节点详情'],
    [/nodes count/gi, '节点数量'],
    [/nodes limits/gi, '节点限制'],
    [/persistent volume claims?/gi, '持久卷声明'],
    [/persistent volumes?/gi, '持久卷'],
    [/pod logs/gi, 'Pod 日志'],
    [/public settings/gi, '公共设置'],
    [/registry details/gi, '镜像仓库详情'],
    [/release list/gi, '发布列表'],
    [/resource group/gi, '资源组'],
    [/resource limits?/gi, '资源限制'],
    [/resource limit data/gi, '资源限制数据'],
    [/resource quota/gi, '资源配额'],
    [/resource usage data/gi, '资源使用数据'],
    [/resource YAML/gi, '资源 YAML'],
    [/resource details/gi, '资源详情'],
    [/restart policy/gi, '重启策略'],
    [/role bindings/gi, '角色绑定'],
    [/secret YAML/gi, 'Secret YAML'],
    [/self subject access review/gi, '自身访问权限检查'],
    [/server settings and status/gi, '服务器设置和状态'],
    [/service account YAML/gi, '服务账户 YAML'],
    [/service accounts/gi, '服务账户'],
    [/service logs/gi, '服务日志'],
    [/stack content/gi, '堆栈内容'],
    [/stack details/gi, '堆栈详情'],
    [/stack file/gi, '堆栈文件'],
    [/stack logs/gi, '堆栈日志'],
    [/stack settings/gi, '堆栈设置'],
    [/stagger status/gi, '错峰更新状态'],
    [/storage classes/gi, '存储类'],
    [/support options/gi, '支持选项'],
    [/swarm information/gi, 'Swarm 信息'],
    [/system info/gi, '系统信息'],
    [/team memberships?/gi, '团队成员关系'],
    [/total resources for all applications/gi, '所有应用的资源总量'],
    [/user and team information/gi, '用户和团队信息'],
    [/user memberships?/gi, '用户成员关系'],
    [/user teams/gi, '用户所属团队'],
    [/values from chart/gi, 'Chart 配置值'],
    [/volume details/gi, '数据卷详情'],
    [/logs status/gi, '日志状态'],
    [/logs collection/gi, '日志收集'],
    [/registry associated to the repository/gi, '与仓库关联的镜像仓库'],
    [
      /\. Check resource limits, security contexts, and volume mounts\./gi,
      '。请检查资源限制、安全上下文和数据卷挂载。',
    ],
    [
      /\. Check image name, registry access, and network connectivity\./gi,
      '。请检查镜像名称、镜像仓库访问权限和网络连接。',
    ],
    [
      /\. Check command, arguments, and environment variables\./gi,
      '。请检查命令、参数和环境变量。',
    ],
    [/\. Container may be unresponsive\./gi, '。容器可能无响应。'],
    [/\. Some counts may be inaccurate\./gi, '。部分数量可能不准确。'],
    [/with any method/gi, '（使用任意方式）'],
    [/which association to use to/gi, '应使用哪个关联关系来'],
    [/associated to/gi, '关联到'],
    [/currently set for/gi, '当前为其设置'],
    [/any method/gi, '任何方式'],
    [/the Docker environment/gi, 'Docker 环境'],
    [/the repository/gi, '仓库'],
    [/the registries/gi, '镜像仓库'],
    [/the stack/gi, '堆栈'],
    [/from git/gi, '从 Git'],
    [/from S3/gi, '从 S3'],
    [/to S3/gi, '到 S3'],
    [/for cluster/gi, '（集群）'],
    [/for all applications/gi, '（所有应用）'],
  ];

  const words: Array<[RegExp, string]> = [
    [/\bretrieve\b/gi, '获取'],
    [/\bcreate\b/gi, '创建'],
    [/\bdelete\b/gi, '删除'],
    [/\bremove\b/gi, '移除'],
    [/\bupdate\b/gi, '更新'],
    [/\bget\b/gi, '获取'],
    [/\bload\b/gi, '加载'],
    [/\bfetch\b/gi, '获取'],
    [/\bsearch\b/gi, '搜索'],
    [/\bapply\b/gi, '应用'],
    [/\bassociate\b/gi, '关联'],
    [/\bdisassociate\b/gi, '取消关联'],
    [/\bbuild\b/gi, '构建'],
    [/\bcollect\b/gi, '收集'],
    [/\bcommit\b/gi, '提交'],
    [/\bconnect\b/gi, '连接'],
    [/\bdisconnect\b/gi, '断开连接'],
    [/\bdeploy\b/gi, '部署'],
    [/\bdetermine\b/gi, '确定'],
    [/\bdownload\b/gi, '下载'],
    [/\bdrain\b/gi, '排空'],
    [/\bexport\b/gi, '导出'],
    [/\bgenerate\b/gi, '生成'],
    [/\bkill\b/gi, '终止'],
    [/\bpatch\b/gi, '修补'],
    [/\bpause\b/gi, '暂停'],
    [/\bping\b/gi, '连接探测'],
    [/\bprune\b/gi, '清理'],
    [/\bpull\b/gi, '拉取'],
    [/\bpush\b/gi, '推送'],
    [/\breach\b/gi, '访问'],
    [/\bre-create\b/gi, '重新创建'],
    [/\bredeploy\b/gi, '重新部署'],
    [/\bresize\b/gi, '调整大小'],
    [/\brestart\b/gi, '重启'],
    [/\brestore\b/gi, '恢复'],
    [/\bresume\b/gi, '恢复运行'],
    [/\brollback\b/gi, '回滚'],
    [/\bsave\b/gi, '保存'],
    [/\bset\b/gi, '设置'],
    [/\bstart\b/gi, '启动'],
    [/\bstop\b/gi, '停止'],
    [/\btag\b/gi, '标记'],
    [/\btest\b/gi, '测试'],
    [/\buninstall\b/gi, '卸载'],
    [/\bupgrade\b/gi, '升级'],
    [/\bupload\b/gi, '上传'],
    [/\bverify\b/gi, '验证'],
    [/\baccesses\b/gi, '访问权限'],
    [/\baccess\b/gi, '访问权限'],
    [/\bapplication(s)?\b/gi, '应用'],
    [/\bartifacts?\b/gi, '产物'],
    [/\bavailable\b/gi, '可用'],
    [/\bbackups?\b/gi, '备份'],
    [/\bconfigs?\b/gi, '配置'],
    [/\bcontainers?\b/gi, '容器'],
    [/\bcounts?\b/gi, '数量'],
    [/\bdata\b/gi, '数据'],
    [/\bdecimals?\b/gi, '小数位'],
    [/\bdetails?\b/gi, '详情'],
    [/\bdeployments?\b/gi, 'Deployment'],
    [/\benvironments?\b/gi, '环境'],
    [/\bevents?\b/gi, '事件'],
    [/\bfiles?\b/gi, '文件'],
    [/\bfound\b/gi, '找到'],
    [/\bgroups?\b/gi, '组'],
    [/\bimages?\b/gi, '镜像'],
    [/\bingresses?\b/gi, 'Ingress'],
    [/\bitems?\b/gi, '项目'],
    [/\bjobs?\b/gi, 'Job'],
    [/\blogs?\b/gi, '日志'],
    [/\bmanifests?\b/gi, '清单'],
    [/\bmemberships?\b/gi, '成员关系'],
    [/\bmethods?\b/gi, '方式'],
    [/\bnotes?\b/gi, '备注'],
    [/\bnamespaces?\b/gi, '命名空间'],
    [/\bnetworks?\b/gi, '网络'],
    [/\bnodes?\b/gi, '节点'],
    [/\boptions?\b/gi, '选项'],
    [/\bpods?\b/gi, 'Pod'],
    [/\bports?\b/gi, '端口'],
    [/\bprojects?\b/gi, '项目'],
    [/\bproviders?\b/gi, '提供商'],
    [/\bquotas?\b/gi, '配额'],
    [/\bregistries\b/gi, '镜像仓库'],
    [/\bregistry\b/gi, '镜像仓库'],
    [/\brepositories\b/gi, '仓库'],
    [/\brepository\b/gi, '仓库'],
    [/\bresources?\b/gi, '资源'],
    [/\brevisions?\b/gi, '修订版本'],
    [/\broles?\b/gi, '角色'],
    [/\bselected\b/gi, '已选择'],
    [/\bsecrets?\b/gi, 'Secret'],
    [/\bservices?\b/gi, '服务'],
    [/\bsettings?\b/gi, '设置'],
    [/\bsources?\b/gi, '源'],
    [/\bstacks?\b/gi, '堆栈'],
    [/\bstatus\b/gi, '状态'],
    [/\bsubscriptions?\b/gi, '订阅'],
    [/\btags?\b/gi, '标签'],
    [/\btasks?\b/gi, '任务'],
    [/\bteams?\b/gi, '团队'],
    [/\btemplates?\b/gi, '模板'],
    [/\btypes?\b/gi, '类型'],
    [/\busers?\b/gi, '用户'],
    [/\bvalues?\b/gi, '配置值'],
    [/\bversions?\b/gi, '版本'],
    [/\bvolumes?\b/gi, '数据卷'],
    [/\bwebhooks?\b/gi, 'Webhook'],
  ];

  return [...phrases, ...words].reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    text
  );
}

export const success = notifySuccess;
export const error = notifyError;
export const warning = notifyWarning;

/* @ngInject */
export function Notifications() {
  return {
    success: notifySuccess,
    warning: notifyWarning,
    error: notifyError,
  };
}

function pickErrorMsg(e?: unknown) {
  if (!e) {
    return '';
  }

  const props = [
    'err.data.details',
    'err.data.message',
    'data.details',
    'data.message',
    'data.content',
    'data.error',
    'message',
    'err.data[0].message',
    'err.data.err',
    'data.err',
    'msg',
  ];

  let msg = '';

  props.forEach((prop) => {
    const val = _.get(e, prop);
    if (typeof val === 'string') {
      msg = msg || val;
    }
  });

  return msg;
}

function saveNotification(title: string, text: string, type: string) {
  const notif: ToastNotification = {
    id: uuid(),
    title,
    details: text,
    type,
    timeStamp: new Date(),
  };
  const userId = localStorageGet('USER_ID', '');
  if (userId !== '') {
    addNotification(userId, notif);
  }
}
