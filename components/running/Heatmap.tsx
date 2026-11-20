import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { formatLongDate } from '../../utils/formatDate';

import styles from './Heatmap.module.scss';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Sun-Sat; blank rows still render so the pinned label column covers them when scrolled.
const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const DAY_ROW = 3; // grid rows 1-2 hold the year and month labels

// Miles thresholds for shades 1-4.
const LEVELS = [3, 5, 8];
function level(miles: number): number {
  return miles > 0 ? 1 + LEVELS.filter((t) => miles >= t).length : 0;
}

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export interface RaceDay {
  name: string;
  href: string;
  miles?: number;
}

interface HeatmapProps {
  start: string; // first day shown, YYYY-MM-DD
  today: string; // last day shown
  runs: Record<string, number>; // miles per YYYY-MM-DD
  races: Record<string, RaceDay>; // per YYYY-MM-DD
}

// Hovered cell, positioned relative to the heatmap's outer wrapper.
interface Hover {
  date: string;
  left: number;
  top: number;
  size: number;
}

// GitHub-style grid from `start` to `today` in one continuous strip: one column
// per week (Sun-Sat), one cell per day. Opens scrolled to the most recent weeks.
// Days with a run or race show a tooltip on hover.
export function Heatmap({ start, today, runs, races }: HeatmapProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Hover | null>(null);
  const userScrolled = useRef(false);

  const years = useMemo(() => {
    const list = [];
    // Oldest first, matching the strip's left-to-right direction.
    for (let y = Number(start.slice(0, 4)); y <= Number(today.slice(0, 4)); y++) list.push(y);
    return list;
  }, [start, today]);
  const [activeYear, setActiveYear] = useState(years[years.length - 1]);

  // Where each year's Jan 1 column starts, in scroll coordinates.
  function yearOffsets(): [number, number][] {
    const el = scroller.current;
    const origin = el.firstElementChild.getBoundingClientRect().left;
    return [...el.querySelectorAll<HTMLElement>('[data-year]')].map((label) => [
      Number(label.dataset.year),
      label.getBoundingClientRect().left - origin,
    ]);
  }

  // The highlighted pill follows the year in the middle of the visible strip.
  function updateActiveYear() {
    const el = scroller.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    const current = yearOffsets().filter(([, left]) => left <= center).pop();
    if (current) setActiveYear(current[0]);
  }

  function scrollToYear(year: number) {
    const el = scroller.current;
    const target = yearOffsets().find(([y]) => y === year);
    if (!el || !target) return;
    userScrolled.current = true;
    // Line Jan 1 up just right of the pinned label column and the gap it covers.
    const grid = el.firstElementChild as HTMLElement;
    const labels = el.querySelector<HTMLElement>(`.${styles.weekday}`).offsetWidth;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    el.scrollTo({ left: target[1] - labels - gap, behavior: 'smooth' });
  }

  // Stay pinned to the most recent weeks as the grid lays out or resizes (cell
  // size follows the container), until the reader scrolls it themselves.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const pin = () => {
      if (!userScrolled.current) el.scrollLeft = el.scrollWidth;
    };
    pin();
    updateActiveYear();
    const observer = new ResizeObserver(() => {
      pin();
      updateActiveYear();
    });
    observer.observe(el);
    observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);

  // Built once per data change so hovering doesn't re-render ~1,000 cells.
  const grid = useMemo(() => {
    const first = new Date(`${start}T00:00:00Z`);
    const labels: React.ReactNode[] = [];
    const cells: React.ReactNode[] = [];
    let weeks = 0;

    for (let d = new Date(first), i = first.getUTCDay(); isoDate(d) <= today; d.setUTCDate(d.getUTCDate() + 1), i++) {
      const date = isoDate(d);
      const gridColumn = Math.floor(i / 7) + 2;
      weeks = gridColumn - 1;

      if (d.getUTCDate() === 1 || date === start) {
        if (d.getUTCMonth() === 0 || date === start) {
          labels.push(
            <span
              key={`y${date}`}
              className={styles.year}
              style={{ gridColumn, gridRow: 1 }}
              data-year={d.getUTCFullYear()}
            >
              {d.getUTCFullYear()}
            </span>
          );
        }
        labels.push(
          <span key={`m${date}`} className={styles.month} style={{ gridColumn, gridRow: 2 }}>
            {MONTHS[d.getUTCMonth()]}
          </span>
        );
      }

      const miles = runs[date] ?? 0;
      const race = races[date];
      const cellProps = {
        style: { gridColumn, gridRow: d.getUTCDay() + DAY_ROW },
        'data-date': race || miles ? date : undefined,
      };
      // Race days link to the race page.
      cells.push(
        race ? (
          <Link key={date} {...cellProps} href={race.href} className={`${styles.cell} ${styles.race}`} aria-label={race.name} />
        ) : (
          <span key={date} {...cellProps} className={`${styles.cell} ${styles[`level${level(miles)}`]}`} />
        )
      );
    }

    return { labels, cells, weeks };
  }, [start, today, runs, races]);

  function handlePointerOver(e: React.PointerEvent) {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-date]');
    if (!cell || !wrapper.current) {
      setHover(null);
      return;
    }
    const box = cell.getBoundingClientRect();
    const origin = wrapper.current.getBoundingClientRect();
    setHover({ date: cell.dataset.date, left: box.left - origin.left, top: box.top - origin.top, size: box.width });
  }

  // Center the tooltip over the cell, kept inside the wrapper's edges.
  useLayoutEffect(() => {
    const tip = tooltip.current;
    if (!hover || !tip || !wrapper.current) return;
    const max = wrapper.current.clientWidth - tip.offsetWidth;
    tip.style.left = `${Math.min(Math.max(hover.left + hover.size / 2 - tip.offsetWidth / 2, 0), max)}px`;
  }, [hover]);

  const race = hover && races[hover.date];
  const miles = hover && (race?.miles ?? runs[hover.date]);

  return (
    <div ref={wrapper} className={styles.wrapper} onPointerLeave={() => setHover(null)}>
      <div
        ref={scroller}
        className={styles.scroller}
        onScroll={() => {
          setHover(null);
          updateActiveYear();
        }}
        onWheel={() => (userScrolled.current = true)}
        onTouchStart={() => (userScrolled.current = true)}
        onPointerDown={() => (userScrolled.current = true)}
      >
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `32px repeat(${grid.weeks}, var(--cell))` }}
          onPointerOver={handlePointerOver}
        >
          {grid.labels}
          {/* Covers the year/month rows above the weekday labels so they scroll under it. */}
          <span className={styles.corner} style={{ gridColumn: 1, gridRow: `1 / ${DAY_ROW}` }} />
          {WEEKDAY_LABELS.map((name, day) => (
            <span key={day} className={styles.weekday} style={{ gridColumn: 1, gridRow: day + DAY_ROW }}>
              {name}
            </span>
          ))}
          {grid.cells}
        </div>
      </div>
      {/* Year pills (scroll to that year) and the shade legend. */}
      <div className={styles.footer}>
        <div className={styles.years}>
          {years.map((year) => (
            <button
              key={year}
              type="button"
              className={`${styles.yearButton} ${year === activeYear ? styles.activeYear : ''}`}
              aria-pressed={year === activeYear}
              onClick={() => scrollToYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
        <span className={styles.legend}>
          Less
          {[0, 1, 2, 3, 4].map((n) => (
            <span key={n} className={`${styles.swatch} ${styles[`level${n}`]}`} />
          ))}
          More
        </span>
      </div>
      {hover && (
        <>
          <span
            className={styles.ring}
            style={{ left: hover.left, top: hover.top, width: hover.size, height: hover.size }}
          />
          <div ref={tooltip} className={styles.tooltip} style={{ top: hover.top }} role="tooltip">
            <strong className={styles.tooltipTitle}>
              {race ? `${race.name}${miles ? ` · ${miles.toFixed(1)} mi` : ''}` : `${miles} mi`}
            </strong>
            <span className={styles.tooltipDate}>
              {race ? 'Race · ' : ''}
              {formatLongDate(hover.date)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
