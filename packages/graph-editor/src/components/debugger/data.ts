import {
  CustomTimeLineAction,
  CustomTimelineRow,
} from '@/components/debugger/index.js';
import { action, computed, makeObservable, observable } from 'mobx';

export class DebugInfo {
  _rows: CustomTimelineRow[] = [];
  offset = 0;
  first = true;

  constructor() {
    makeObservable(this, {
      _rows: observable,
      rows: computed,
      addRow: action,
      addAction: action,
    });
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
              start: (action.start - this.offset) / 1000,
              end: (action.end - this.offset) / 1000,
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
