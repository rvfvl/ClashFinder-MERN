const getRankValue = tier => {
  switch (tier) {
    case "IRON":
      return 1;
    case "BRONZE":
      return 2;
    case "SILVER":
      return 3;
    case "GOLD":
      return 4;
    case "PLATINUM":
      return 5;
    case "DIAMOND":
      return 6;
    default:
      return 0;
  }
};

module.exports = getRankValue;
