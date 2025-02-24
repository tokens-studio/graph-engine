import { Annotations } from '@/types/annotations.js';
import { EventEmitter } from './eventEmitter.js';

export class Variable {
  private value: any;
  public label = '';
  public metadata: Annotations = {};
  public version = 0; // this is updated on each change to the variable state.
  public readonly onChanged = new EventEmitter<Variable>();
  public type: string;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly valueTypeName: string,
    public initialValue: any // this is assumed to be properly deseriealized from a string.
  ) {
    this.value = this.initialValue;
    this.type = valueTypeName;
  }

  get(): any {
    return this.value;
  }

  set(newValue: any) {
    if (newValue !== this.value) {
      this.value = newValue;
      this.version++;
      this.onChanged.emit(this);
    }
  }
}
