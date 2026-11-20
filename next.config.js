const withMarkdoc = require('@markdoc/next.js');

module.exports =
  withMarkdoc(/* config: https://markdoc.io/docs/nextjs#options */)({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdoc'],
    // lib/blog.ts reads posts at request time, so ship them with those functions.
    outputFileTracingIncludes: {
      '/blog': ['./content/blog/**/*'],
      '/blog/[slug]': ['./content/blog/**/*'],
      '/api/posts': ['./content/blog/**/*'],
    },
  });
