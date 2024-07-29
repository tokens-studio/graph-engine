import {
  CustomTimeLineAction,
  CustomTimelineRow,
} from '@/components/debugger/index.js';
import { action, computed, makeObservable, observable } from 'mobx';

export interface IDebugInfo {
  rows?: CustomTimelineRow[];
}

export class DebugInfo {
  _rows: CustomTimelineRow[] = [];
  offset = 0;
  first = true;

  constructor(init?: IDebugInfo) {
    const { rows = [] } = init || {};

    makeObservable(this, {
      _rows: observable.ref,
      rows: computed,
      addRow: action,
      addAction: action,
    });

    this._rows = rows;
  }

  get rows() {
    return this._rows;
  }

  addRow(row: CustomTimelineRow) {
    this._rows = [...this._rows, row];
  }

  addAction(rowId: string, action: CustomTimeLineAction) {
    if (this.first) {
      this.first = false;
      this.offset = action.start;
    }

    this._rows = this._rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          actions: [
            ...row.actions,
            {
              ...action,
              start: action.start - this.offset,
              end: action.end - this.offset,
            },
          ],
        };
      }
      return row;
    });
  }

  clear() {
    this.first = true;
    this._rows = [];
  }
}

export const debugInfo = new DebugInfo();
