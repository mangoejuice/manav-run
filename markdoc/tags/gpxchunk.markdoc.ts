import {GPXChunk} from '../../components';

export const gpxchunk = {
  render: GPXChunk,
  children: ['paragraph', 'tag', 'list'],
  attributes: {
    title: {
      type: String,
    },
  },
};
