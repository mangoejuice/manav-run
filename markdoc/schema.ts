import type { Config } from '@markdoc/markdoc';
import * as tags from './tags';
import * as nodes from './nodes';
import * as functions from './functions';

// The site's Markdoc tags and nodes for content rendered outside pages/
// (blog posts). Markdoc needs string `render` names to serialize a transformed
// tree, so each component is swapped for a stable key ("Tag:callout"; the
// renderer only maps capitalized names) and mapped back via BLOG_COMPONENTS at
// render time. `feed` is the home page's race list, not post content.
const { feed: _feed, ...postTags } = tags;

const components: Record<string, React.ComponentType<any>> = {};

function withNamedRenders(kind: string, schema: Record<string, { render?: unknown }>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => {
      if (typeof value.render !== 'function') return [key, value];
      const name = `${kind}:${key}`;
      components[name] = value.render as React.ComponentType<any>;
      return [key, { ...value, render: name }];
    })
  );
}

export const BLOG_CONFIG: Config = {
  tags: withNamedRenders('Tag', postTags),
  nodes: withNamedRenders('Node', nodes),
  functions,
};

export const BLOG_COMPONENTS = components;
