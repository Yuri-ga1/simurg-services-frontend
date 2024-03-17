import { notifications, type NotificationData } from '@mantine/notifications';
import { type ReactNode } from 'react';

export type NotificationType = 'info' | 'error' | 'warning' | 'success';

export type NotifyOptions = {
  title?: ReactNode;
  message: ReactNode;
};

const typeToColor = (type: NotificationType): Required<NotificationData>['color'] => {
  if (type === 'warning') {
    return 'orange';
  }
  if (type === 'error') {
    return 'red';
  }
  if (type === 'success') {
    return 'green';
  }
  return 'blue';
};

const getEmojiByType = (type: NotificationType): string => {
  switch (type) {
    case 'error':
      return '😔';
    case 'success':
      return '🥳';
    default:
      return '';
  }
};

const createNotification =
  (type: NotificationType) =>
  (options: NotifyOptions): void => {
    notifications.show({
      ...options,
      title: options.title ? `${options.title}!` : undefined,
      message: options.message ? `${options.message} ${getEmojiByType(type)}` : undefined,
      color: typeToColor(type),
    });
  };

const info = createNotification('info');
const error = createNotification('error');
const success = createNotification('success');
const warning = createNotification('warning');

export const notification = { info, error, success, warning };
