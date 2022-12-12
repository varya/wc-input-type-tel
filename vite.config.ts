import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import viteSvgLoader from "vite-svg-loader";

const bundle_filename = "design-system.es.js";
const css_filename = "style.css";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        dir: "./dist",
      },
      plugins: [
        typescript(), // generate type definitions
      ],
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/tokens/build/*.json",
          dest: "tokens/"
        }
      ]
    }),
    viteSvgLoader({
      defaultImport: "raw",
    }),
    {
      apply: "build",
      enforce: "post",
      name: "pack-css",
      generateBundle(opts, bundle) {
        if (!bundle[bundle_filename]) return;
        const jsCode = bundle[bundle_filename]?.code;
        const cssCode = bundle[css_filename]?.source;

        const IIFEcss = `
        (function() {
          try {
              var elementStyle = document.createElement('style');
              elementStyle.innerText = ${JSON.stringify(cssCode)}
              document.head.appendChild(elementStyle)
          } catch(error) {
            console.error(error, 'unable to concat style inside the bundled file')
          }
        })();`;

        const newJsCode = IIFEcss + jsCode;
        bundle[bundle_filename].code = newJsCode;

        // remove from final bundle
        delete bundle[css_filename];
      },
    },
  ],
});
