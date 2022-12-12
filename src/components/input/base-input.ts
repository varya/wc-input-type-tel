/* eslint-disable import/prefer-default-export */
import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { nanoid } from "nanoid";
import { EventDispatcher, event } from "../_common/event";

export class AoBaseInput extends LitElement {
  /**
   * Input label
   */
  @property({})
  label: string;

  /** input id */
  @property({ type: String, reflect: true })
  id: string = nanoid(6);

  /**
   * Sets name of the input
   */
  @property({ type: String, reflect: true })
  name = "";

  /**
   * Makes input a mandatory field
   */
  @property({ type: Boolean })
  required = false;

  /**
   * Disables the input
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Sets the invalid state of input
   */
  @property({ type: Boolean, reflect: true })
  invalid = false;

  /**
   * Hides label visully (it is still accessible for screen readers)
   */
  @property({ type: Boolean, attribute: "label-hidden", reflect: true })
  labelHidden = false;

  /**
   * Fires every time when the value of an input element has been changed,
   * or when event or radio were chcked.
   */
  @event("input") public onInput: EventDispatcher<any>;

  /**
   * Fires when the element's value is changed by the user.
   * Also fires when a user checked or unchecked a checkbox or a radio input.
   * Not necessarily fired for eachchange of an element's value.
   */
  @event("change") public onChange: EventDispatcher<any>;
}
