export interface Photo {
  // Path under /public, e.g. '/photos/2026-02-08/01.jpg'. Omit for a gray placeholder.
  src?: string;
  alt?: string;
  width: number;
  height: number;
}

export interface PhotoSet {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  photos: Photo[];
}

// Newest first. Placeholder sets until real photos are added.
const photoSets: PhotoSet[] = [
  {
    id: 'placeholder-2026-02-08',
    title: 'Photo set title',
    date: '2026-02-08',
    photos: [
      { width: 4, height: 5 },
      { width: 3, height: 2 },
      { width: 4, height: 3 },
      { width: 2, height: 3 },
      { width: 3, height: 2 },
    ],
  },
  {
    id: 'placeholder-2025-09-14',
    title: 'Photo set title',
    date: '2025-09-14',
    photos: [
      { width: 2, height: 3 },
      { width: 3, height: 2 },
      { width: 4, height: 5 },
      { width: 3, height: 2 },
    ],
  },
  {
    id: 'placeholder-2025-06-01',
    title: 'Photo set title',
    date: '2025-06-01',
    photos: [
      { width: 3, height: 2 },
      { width: 2, height: 3 },
      { width: 4, height: 5 },
      { width: 3, height: 2 },
      { width: 2, height: 3 },
    ],
  },
];

export default photoSets;
