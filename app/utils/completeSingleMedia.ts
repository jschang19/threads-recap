import type { ThreadPostMedia, ThreadsAndRepliesResponse } from '~/types/threads';

export function completeSingleMedia(post:{
  media: ThreadPostMedia[];
  title?: string;
  creation_timestamp?: number;
}): {
  media: ThreadPostMedia[];
  title: string;
  creation_timestamp: number;
} {
  // for those media array length is 1, and creation_timestamp and title are undefined, we need to complete the media object by assigning the creation_timestamp and title from the first media object
  if (
    Array.isArray(post.media) &&
    post.media.length === 1 &&
    post.media[0] !== undefined &&
    post.creation_timestamp === undefined &&
    post.title === undefined
  ) {
    return {
      media: post.media,
      title: post.media[0]?.title || '',
      creation_timestamp: post.media[0]?.creation_timestamp || 0,
    };
  }
  return {
    media: post.media || [],
    title: post.title || '',
    creation_timestamp: post.creation_timestamp || 0,
  };
}
