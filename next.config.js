const withMarkdoc = require('@markdoc/next.js');

// lib/blog.ts reads posts at request time, so ship them with those functions.
const POSTS = ['./content/blog/**/*'];

module.exports =
  withMarkdoc(/* config: https://markdoc.io/docs/nextjs#options */)({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdoc'],
    outputFileTracingIncludes: { '/blog': POSTS, '/blog/[slug]': POSTS, '/api/posts': POSTS },
    // Race write-ups moved from /<id> to /running/<id>; keep old links working.
    async redirects() {
      return [
        { source: '/:id(\\d{4}-\\d{2}-\\d{2}-[a-z0-9-]+)', destination: '/running/:id', permanent: true },
      ];
    },
  });
