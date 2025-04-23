import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function TopNav({ children }) {
  const router = useRouter();
  const active = router.pathname === '/';

  return (
    <nav className={`${active ? "active" : ""}`}>
      <Link href="/" className={"flex"}>
        Home
      </Link>
      <section>{children}</section>
      <style jsx>
        {`
          nav {
            top: 0;
            position: fixed;
            width: 100%;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 1rem 2rem;
            background: white;
            border-bottom: 1px solid var(--border-color);
            font-weight:lighter;
          }
          nav :global(a:hover),
          nav.active :global(a) {
            font-weight:normal;
          }
          nav :global(a) {
            text-decoration: none;
          }
          section {
            display: flex;
            gap: 1rem;
            padding: 0;
          }
        `}
      </style>
    </nav>
  );
}
