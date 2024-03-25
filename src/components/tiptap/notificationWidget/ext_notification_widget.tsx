import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NotificationWidget } from './NotificationWidget';

export const NotificationWidgetExtension = Node.create({
  name: 'notificationWidget',

  group: 'block',

  content: 'block*',

  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'notification_widget',
      },
    ];
  },

  whitespace: 'normal',

  renderHTML({ HTMLAttributes }) {
    return ['notification_widget', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(NotificationWidget);
  },
});
