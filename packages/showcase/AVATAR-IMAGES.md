# Showcase avatar images

The avatar examples use square, edge-to-edge portrait crops from Pexels. They have no baked-in circular mask or transparent corners; the Avatar component supplies the squircle clipping.

## Sources

- [Creation Hill — man in red jacket](https://www.pexels.com/photo/man-in-red-jacket-1681010/) (photo 1681010).
- [Pixabay — woman wearing black spaghetti strap top](https://www.pexels.com/photo/woman-wearing-black-spaghetti-strap-top-415829/) (photo 415829).
- [Italo Melo — smiling man with arms crossed](https://www.pexels.com/photo/portrait-photo-of-smiling-man-with-his-arms-crossed-standing-in-front-of-a-wall-2379004/) (photo 2379004).

These images are free for personal and commercial use under the [Pexels License](https://www.pexels.com/license/), without required attribution. The license also permits modification. Keep the source links when changing the examples. Names and initials in examples are fictional demo data and do not identify the people pictured or imply their endorsement.

The examples request 256 × 256 crops from the Pexels image CDN, so copied registry examples work without installing local image assets. Loading portraits requires a network connection; AvatarFallback remains available if the image cannot load.
