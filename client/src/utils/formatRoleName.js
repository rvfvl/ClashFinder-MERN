const formatRoleName = role => {
  switch (role) {
    case 'ADC':
      return 'AD Carry';
    case 'MID':
      return 'Midlaner';
    case 'SUPP':
      return 'Support';
    case 'JNG':
      return 'Jungler';
    case 'TOP':
      return 'Toplaner';
    default:
      return 'Unknown';
  }
};

export default formatRoleName;
