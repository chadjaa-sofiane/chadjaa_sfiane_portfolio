import { urlFor } from "./sanity";

interface SanityImageLike {
  asset?: { _ref?: string };
}

/**
 * Build a card-sized CDN URL for a Sanity image.
 *
 * Asking Sanity for the resized image keeps multi-megabyte originals off the
 * wire and lets next/image skip the expensive work. SVG assets are returned
 * untransformed: next/image only bypasses its optimizer for URLs ending in
 * ".svg", and the optimizer rejects SVG unless dangerouslyAllowSVG is set.
 */
export const cardImageUrl = (
  image: SanityImageLike | null | undefined,
  width = 840,
): string | null => {
  if (!image) return null;
  try {
    return image.asset?._ref?.endsWith("-svg")
      ? urlFor(image).url()
      : urlFor(image).width(width).fit("max").auto("format").url();
  } catch (err) {
    console.error("Error generating Sanity image URL:", err);
    return null;
  }
};
