import { html, unsafeCSS } from "lit";
import { classMap } from "lit-html/directives/class-map.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { customElement, property, query } from "lit/decorators.js";
import { event, EventDispatcher } from "./input.events";

import { live } from "lit/directives/live.js";
import { AoBaseInput } from "./base-input";
import style from "./input.css";


import { endAdornmentTemplate } from "./templates/end-adornment";
import { helpTextTemplate } from "./templates/help-text";
import { labelTemplate } from "./templates/label";

export const inputTypes = [
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "number",
  "password",
  "range",
  "reset",
  "search",
  "submit",
  "tel",
  "text",
  "time",
  "url",
  "week",
] as const;

type InputType = typeof inputTypes[number];
/**
 * Input component.
 * Renders native `<input type="..."/>` element under the hood.
 */
@customElement("ao-input")
export class AoInput extends AoBaseInput {
  /** Input type. It is passed to native input element */
  @property({ type: String, reflect: true })
  type: InputType = "text";

  /**
   * Sets placeholder of the input
   */
  @property({ type: String, reflect: true })
  placeholder?: string;

  /**
   * Sets initial value of the input
   */
  @property({ type: String, reflect: true })
  value = "";

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
   * Sets the state of input
   */
  @property({ type: String, reflect: true })
  state: "default" | "invalid" | "success" = "default";

  /**
   * Hides label visully (it is still accessible for screen readers)
   */
  @property({ type: Boolean, attribute: "label-hidden", reflect: true })
  labelHidden = false;

  /**
   * Text for optional label. Defaults to "optional", can be customised for localization.
   * Won't be shown if labelHidden property is set to true
   */
  @property({ type: String, attribute: "optional-text", reflect: true })
  optionalText = "optional";

  /**
   * Help text. Rendered below the input with deemplasized color.
   */
  @property({ type: String, attribute: "help-text", reflect: true })
  helpText?: string | undefined;

  /**
   * Provides a pattern. when specified, is a regular expression that the
   * input's value must match in order for the value to pass constraint validation.
   * It must be a valid JavaScript regular expression, as used by the RegExp type.
   */
  @property({ type: String, reflect: true })
  pattern: string = `[\+]\d{2}[\(]\d{2}[\)]\d{4}[\-]\d{4}`;

  /**
   * Error message. Shown below the input if the input is invalid state.
   */
  @property({ type: String, attribute: "error-message", reflect: true })
  errorMessage?: string | undefined;

  @query("input")
  _input!: HTMLInputElement;

  /**
   * Handles `oninput` event on the `<ao-input>`.
   * @param event The event.
   */
  protected _handleInput({ target }: Event) {
    const value = (target as HTMLInputElement).value;
    this.value = value;
    this.onInput(value);
  }

  _handleIncrement() {
    this._input.stepUp();
    this._input.dispatchEvent(new Event("change"));
  }

  _handleDecrement() {
    this._input.stepDown();
    this._input.dispatchEvent(new Event("change"));
  }

  /**
   * Handles `onchange` event on the `<ao-input>`.
   * @param event The event.
   */
  protected _handleChange({ target }: Event) {
    const value = (target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  @event("format-value")
  public onFormatValue: EventDispatcher<any>;

  protected _formatPhone(value) {
    this.onFormatValue();
    const formatValue = new CustomEvent('format-value', { 
      bubbles: true, 
      composed: true,
    });
    this.dispatchEvent(formatValue);
    return;
  }

  update(changedProperties) {
    if (changedProperties.has("value") && this.type === "tel") {
      const formattedValue = this._formatPhone(this.value);
      // this.value = formattedValue;
    }
    super.update(changedProperties);
  }

  render() {
    const {
      _handleInput: handleInput,
      _handleChange: handleChange,
      type,
      disabled,
      state,
      labelHidden,
      label,
      id,
      name,
      value,
      placeholder,
      required,
      pattern,
      checked,
      indeterminate,
      helpText,
    } = this;

    // For these types custom styling is provided. For the rest, fallback is standard text field
    const supportedTypes = ["number", "tel"];

    const inputClasses = {
      "ao-input": true,
      "ao-text-input": !supportedTypes.includes(type),
      "ao-number-input": type === "number",
      "ao-input--disabled": disabled,
      "ao-input--invalid": state === "invalid",
      "ao-input--success": state === "success",
      "ao-input--with-help-text": Boolean(helpText),
    };

    return html`${labelTemplate(this)}
      <div class="ao-input-container">
        <div class="ao-input-field">
          <input
            id=${id}
            type=${type}
            class=${classMap(inputClasses)}
            .value=${live(value)}
            placeholder="${ifDefined(placeholder)}"
            ?required=${required}
            ?disabled=${disabled}
            aria-invalid="${state === "invalid"}"
            pattern=${pattern}
            @input="${handleInput}"
            @change="${handleChange}"
          />
          <div class="ao-input__end-adornment">
            ${endAdornmentTemplate(this)}
          </div>
        </div>
        ${helpTextTemplate(this)}
      </div>`;
  }

  static styles = unsafeCSS([style]);
}
