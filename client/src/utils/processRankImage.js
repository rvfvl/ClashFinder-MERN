const processRankImage = rankValue => {
  if (rankValue === 0) return 'diamond.png';
  if (rankValue === 1) return 'iron.png';
  if (rankValue === 2) return 'bronze.png';
  if (rankValue === 3) return 'silver.png';
  if (rankValue === 4) return 'gold.png';
  if (rankValue === 5) return 'platinum.png';
  if (rankValue === 6) return 'diamond.png';
};

export default processRankImage;
