import React from 'react';

const FlagIcon = ({ countryData, countryName, flagSize = 32 }) => {
  const flag = countryData.find(country => country.name === countryName);

  return (
    <img
      style={{ margin: ' 0 5px' }}
      src={`https://www.countryflags.io/${flag.code}/flat/${flagSize}.png`}
      alt="Country Flag"
    />
  );
};

export default FlagIcon;
