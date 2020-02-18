const size = {
  tablet: 768,
  laptop: 1024,
  desktop: 1440
};

const device = Object.keys(size).reduce((acc, cur) => {
  acc[cur] = `(min-width: ${size[cur]}px)`;
  return acc;
}, {});

export default device;
