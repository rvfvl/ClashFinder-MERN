const formatServerRegion = server => {
  switch (server) {
    case 'ru':
      return 'Russia';
    case 'kr':
      return 'Korea';
    case 'br1':
      return 'Brazil';
    case 'oc1':
      return 'Oceania';
    case 'jp1':
      return 'Japan';
    case 'na1':
      return 'North America';
    case 'eun1':
      return 'Europe Nordic & East';
    case 'euw1':
      return 'Europe West';
    case 'tr1':
      return 'Turkey';
    case 'la1':
      return 'LAS';
    case 'la2':
      return 'LAN';
    default:
      return 'Unknown';
  }
};

export default formatServerRegion;
