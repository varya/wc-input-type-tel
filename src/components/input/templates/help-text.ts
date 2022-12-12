import { html } from "lit";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { AoInput } from "../input";

export const helpTextTemplate = ({
  helpText,
  invalid,
  errorMessage
}: AoInput) => helpText
      ? html`<div
          class="ao-input__help-text ${invalid
            ? "ao-input__help-text--error"
            : ""}"
        >
          ${ifDefined(invalid ? errorMessage : helpText)}
        </div>`
      : undefined
