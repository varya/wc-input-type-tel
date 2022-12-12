# Web Component input example

A design system and component library built with Web Components(Lit). 

## Navigation

- [Web Component input example](#web-component-input-example)
  - [Navigation](#navigation)
  - [Quick start](#quick-start)
  - [Tokens](#tokens)
  - [Component library](#component-library)
    - [Conventions](#conventions)
  - [Testing](#testing)
    - [Testing the library on Vue](#testing-the-library-on-vue)

## Quick start

1. Install dependencies:
```
yarn 
```

2. Run storybook in development mode
```
yarn start
```

This script also runs web components manifest generation in development mode.

## Tokens

We are planning to update tokens automatically via Figma Tokens plugin. There is a related github action in `.github` folder.
You can also manually export token files from plugin and place it at `src/tokens/tokens.json`. After that, run:

```
yarn tokens
```

to build new tokens set.

## Component library

Component library is based on [Lit](https://lit.dev/) - a framework for Web Components. The build process is handled with [Vite](https://vitejs.dev/). To create a new build, run:
```
yarn build
```

We use a few PostCSS Plugins:
- [PostCSS-mixins](https://www.npmjs.com/package/postcss-mixins)
- [PostCSS-nested](https://www.npmjs.com/package/postcss-nested)
- [Autoprefixer](https://www.npmjs.com/package/autoprefixer)

The list of Vite plugins is automatically shared between Vite configs for build and for Storybook.


### Conventions

We follow some agreements on naming and file structure to keep the codebase clean and consistent. 

1. Filenames should be written in lowercase, two words can be split with dash (-).
2. Each component should be placed in a separate folder. 

- The folder MUST contain:
  - index.ts - reexports [component].ts
  - [component].ts - main file with code
  -[component].stories.ts - storybook documentation file
- Additonally, the folder may contain some of the following:
  - [component].css
  - [component].test.ts
  - /assets - a folder containing svg, img or any other static assets directly related to a single component.
 
You can quuickly create a new component from the template, by running a script:

```
yarn component <component>
```
The script will create a new folder for your component with some starter files.
Note that component name should not contain prefix. For example: `yarn component button`.

## Testing

### Testing the library on Vue

1. Install dependecies on Vue project
   ```
   $ cd test/vue-app
   $ yarn
   ```
2. Build the library<br/>
   ```
   $ yarn build
   ```
3. Run the project
   ```
   $ yarn test:vue
   ```