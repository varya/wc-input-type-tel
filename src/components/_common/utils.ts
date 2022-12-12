export const setAttributes = (el, attributes) => {
  for (const [attribute, value] of Object.entries(attributes)) {
    if (typeof value === "boolean") {
      if (value) {
        el.setAttribute(attribute, "");
      } else {
        el.removeAttribute(attribute);
      }
    } else if (!value) {
      el.removeAttribute(attribute);
    } else {
      el.setAttribute(attribute, value);
    }
  }
};
