import { html, nothing } from "lit";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { AoInput } from "../input";
import ArrowDownIcon from "../svgs/arrow-down.svg";
import ArrowUpIcon from "../svgs/arrow-up.svg";
import InvalidIcon from "../svgs/invalid.svg";
import SuccessIcon from "../svgs/success.svg";

const stateIcons = {
  invalid: html`<ao-icon size="large"> ${unsafeHTML(InvalidIcon)} </ao-icon>`,
  success: html`<ao-icon size="large"> ${unsafeHTML(SuccessIcon)} </ao-icon>`,
  default: nothing,
};

const arrowsTemplate = (
  handleIncrement,
  handleDecrement
) => html`<span class="ao-number-input__arrows">
  <span class="ao-number-input__arrows--button" role="button" @click=${handleIncrement} >
    <span class="ao-number-input__arrows--up">${unsafeHTML(ArrowUpIcon)}</span>
  </span>
  <span role="button" @click=${handleDecrement} class="ao-number-input__arrows--button">
    <span class="ao-number-input__arrows--down"
      >${unsafeHTML(ArrowDownIcon)}</span
    >
  </span></span
></span>`;

export const endAdornmentTemplate = ({
  state,
  type,
  _handleIncrement,
  _handleDecrement,
}: AoInput) => {
  if (type === "number") {
    return arrowsTemplate(_handleIncrement, _handleDecrement);
  }
  return stateIcons[state];
};
