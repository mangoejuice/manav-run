import Prism from 'prismjs';

import * as React from 'react';

export function CodeBlock({ children, 'data-language': language }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) Prism.highlightElement(ref.current, false);
  }, [children]);

  return (
    <div className="code" aria-live="polite">
      <pre
        ref={ref}
        className={`language-${language}`}
      >
        {children}
      </pre>
      <style jsx>
        {`
          .code {
            position: relative;
          }

          /* Override Prism styles */
          .code :global(pre[class*='language-']) {
            text-shadow: none;
            border-radius: 8px;
            font-family: Arial;
            color:rgba(60, 66, 87, 1);
            background-color:rgb(236, 241, 247);
            font-size: 1em;
          }
        `}
      </style>
    </div>
  );
}
