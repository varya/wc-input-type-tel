import { __values } from "tslib";

export interface EventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export interface EventDispatcher<T> {
  (value: T, options?: EventOptions): void;
}

function dispatcher<T>(
  target: HTMLElement,
  eventName: string
): EventDispatcher<T> {
  // eslint-disable-next-line func-names
  return function (value: T, options?: EventOptions) {
    // Default formatting for the phone

    // Clean and leave the numbers only
    const valueClean = this.value.replace(/[^0-9]/g, '');

    // Format
    const newValue = valueClean.replace(/(\d{1})(\d{1,3})?(\d{1,3})?(\d{1,4})?/, function(_, p1, p2, p3, p4){
      let output = "";
      if (p1) output += `+${p1}`;
      if (p2) output += ` (${p2}`;
      if (p3) output += `) ${p3}`
      if (p4) output += `-${p4}`
      return output;
    });
    this.value = newValue;
  };
}

export function event(customName?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (protoOrDescriptor: any, name: string): any => {
    const descriptor = {
      get(this: HTMLElement) {
        return dispatcher(this, customName || name);
      },
      enumerable: true,
      configurable: true,
    };

    Object.defineProperty(protoOrDescriptor, name, descriptor);
  };
}
