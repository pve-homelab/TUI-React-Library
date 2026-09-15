import type { ReactNode } from 'react';

export type AgentStatus = 'idle' | 'working' | 'blocked' | 'done';

export interface KanbanTag {
  id: string;
  label: string;
}

export interface KanbanCardData {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  tags?: KanbanTag[];
  status?: AgentStatus;
  meta?: string;
}

export interface KanbanColumnData {
  id: string;
  title: string;
  subtitle?: string;
  trigger?: 'manual' | 'automatic';
}

export interface KanbanMoveEvent {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex: number;
}

export type KanbanCardRenderer = (card: KanbanCardData) => ReactNode;
