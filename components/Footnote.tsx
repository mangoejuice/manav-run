import React, { useId, useState } from 'react';

import styles from './Footnote.module.scss';

// A numbered aside: in the post's margin on wide screens, tap-to-open inline
// below $sidenote-breakpoint (layout in Footnote.module.scss).
export function Footnote({ children }: { children: React.ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span className={styles.footnote}>
      <button
        type="button"
        className={styles.marker}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      />
      <span id={id} role="note" data-sidenote className={`${styles.note} ${open ? styles.open : ''}`}>
        {children}
      </span>
    </span>
  );
}
