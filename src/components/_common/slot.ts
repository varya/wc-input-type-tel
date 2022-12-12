import type { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * HasSlotController validates if the slot has content.
 * It listens for slot name changes, re-renders the component and assigns the style to the corresponding element.
 * The function shall be used if the element in question has various slots with different content.
 */

export class HasSlotController implements ReactiveController {
  host: ReactiveControllerHost & Element;

  slotNames: string[] = [];

  constructor(host: ReactiveControllerHost & Element, ...slotNames: string[]) {
    (this.host = host).addController(this);
    this.slotNames = slotNames;
    this.handleSlotChange = this.handleSlotChange.bind(this);
  }

  private hasDefaultSlot() {
    return [...this.host.childNodes].some((node) => {
      if (node.nodeType === node.TEXT_NODE && node.textContent!.trim() !== "") {
        return true;
      }

      if (node.nodeType === node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        // Ignore visually hidden elements since they aren't rendered
        if (tagName === "sl-visually-hidden") {
          return false;
        }

        // If it doesn't have a slot attribute, it's part of the default slot
        if (!el.hasAttribute("slot")) {
          return true;
        }
      }

      return false;
    });
  }

  private hasNamedSlot(name: string) {
    return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
  }

  test(slotName: string) {
    return slotName === "[default]"
      ? this.hasDefaultSlot()
      : this.hasNamedSlot(slotName);
  }

  hostConnected() {
    this.host.shadowRoot!.addEventListener("slotchange", this.handleSlotChange);
  }

  hostDisconnected() {
    this.host.shadowRoot!.removeEventListener(
      "slotchange",
      this.handleSlotChange
    );
  }

  handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;

    if (
      (this.slotNames.includes("[default]") && !slot.name) ||
      (slot.name && this.slotNames.includes(slot.name))
    ) {
      this.host.requestUpdate();
    }
  }
}
