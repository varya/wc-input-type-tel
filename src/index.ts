/** If you add new CSS file,
 * please, don't forget to add it to .storybook/preview.js
 * */
/** The CSS files with tokens are imported as pieces of text.
 *  Then, <style> tags are created in real-time the content obtained from the token's CSS files is placed inside.
 *  After the <style> tag is created and enriched with the content, the document that has the library linked will contain code
 * with properties that belong to : root
 * */

import borderStyles from "./tokens/build/_border.css";
import colorStyles from "./tokens/build/_colors.css";
import restStyles from "./tokens/build/_rest.css";
import shadowStyles from "./tokens/build/_shadow.css";
import sizingStyles from "./tokens/build/_sizing.css";
import spacingStyles from "./tokens/build/_spacing.css";
import typographyStyles from "./tokens/build/_typography.css";
import utilityClasses from "./tokens/build/_utility-classes.css";

const styleTag = document.createElement("style");
styleTag.appendChild(document.createTextNode(borderStyles));
styleTag.appendChild(document.createTextNode(colorStyles));
styleTag.appendChild(document.createTextNode(shadowStyles));
styleTag.appendChild(document.createTextNode(sizingStyles));
styleTag.appendChild(document.createTextNode(spacingStyles));
styleTag.appendChild(document.createTextNode(typographyStyles));
styleTag.appendChild(document.createTextNode(restStyles));
styleTag.appendChild(document.createTextNode(utilityClasses));

document.head.appendChild(styleTag);

export * from "./components/input";
