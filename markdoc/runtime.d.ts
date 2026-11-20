// @markdoc/next.js ships its runtime helpers untyped.
declare module '@markdoc/next.js/runtime' {
  import type { Config } from '@markdoc/markdoc';

  // Swaps each tag/node `render` component for a string name and returns the
  // name → component map alongside the schema.
  // Input renders are components, not the strings Config expects.
  export function getSchema(schema: {
    tags?: Record<string, object>;
    nodes?: Record<string, object>;
    functions?: Config['functions'];
  }): Config & { components: Record<string, any> };
}
