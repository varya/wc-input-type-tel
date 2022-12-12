import { Story } from "@storybook/web-components";
import { html } from "lit-html";
import type { ClassName } from "./template";
import "./template";

export default {
  title: "Components/Template",
  component: "element-name",
};

const Template: Story<ClassName> = () => {
  return html` <element-name></element-name>`;
};

export const Basic = Template.bind({});
