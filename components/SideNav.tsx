import React from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

const items = [
  {
    title: '',
    links: [
      {href: '/2025-03-16-united-half', children: 'United Airlines NYC Half Marathon'},
      {href: '/2024-10-13-staten-island-half', children: 'Staten Island Half Marathon'},
      {href: '/2024-09-22-bronx-10m', children: 'New Balance Bronx 10M'},
      {href: '/2024-08-10-percy-sutton-5k', children: 'Percy Sutton Harlem 5k'},
      {href: '/2024-06-15-citizens-queens-10k', children: 'Citizens Queens 10k'},
      {href: '/2024-05-18-brooklyn-half', children: 'RBC Brooklyn Half'},
      {href: '/2024-03-03-wash-heights-5k', children: 'Washington Heights Salsa, Blues, and Shamrocks 5K'},
      {href: '/2024-02-24-al-gordon-4m', children: 'Al Gordon 4M'}, 
    ],
  },
];

export function SideNav() {
  const router = useRouter();

  return (
    <nav className="sidenav">
      {items.map((item) => (
        <div key={item.title}>
          <span>{item.title}</span>
          <ul className="flex column">
            {item.links.map((link) => {
              const active = router.pathname === link.href;
              return (
                <li key={link.href} className={active ? 'active' : ''}>
                  <Link {...link} />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <style jsx>
        {`
          nav {
            position: sticky;
            top: var(--top-nav-height);
            height: calc(100vh - var(--top-nav-height));
            flex: 0 0 auto;
            overflow-y: auto;
            padding: 2.5rem 2rem 2rem;
            border-right: 1px solid var(--border-color);
          }
          span {
            font-size: larger;
            font-weight: 500;
            padding: 0.5rem 0 0.5rem;
          }
          ul {
            padding: 0;
          }
          li {
            list-style: none;
            margin: 0;
          }
          li :global(a) {
            text-decoration: none;
          }
          li :global(a:hover),
          li.active :global(a) {
            text-decoration: underline;
          }
        `}
      </style>
    </nav>
  );
}
