import { html } from "lit";
import { classMap } from "lit-html/directives/class-map.js";
import { AoInput } from "../input";

export const labelTemplate = ({
  label,
  id,
  required = false,
  labelHidden = false,
  optionalText,
  type,
}: AoInput) => {

  const labelClasses = {
    "ao-input__label": true,
    "ao-input__label--hidden": labelHidden,
  };

  return html` <label class=${classMap(labelClasses)} for=${id}
    >${label}
    ${!required
      ? html`<span class="ao-input__label-optional-text">${optionalText}</span>`
      : undefined}
  </label>`;
};
