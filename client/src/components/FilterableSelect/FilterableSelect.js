import React, { useState, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import device from 'theme/queries';
import { FiChevronDown } from 'react-icons/fi';
import PropTypes from 'prop-types';

const FilterableSelectWrapper = styled.div`
  position: relative;
  padding: 0 !important;

  span {
    height: 100%;

    svg {
      position: absolute;
      top: 0;
      right: 0;
      width: 30px;
      height: 100%;
      fill: #707070;
      stroke: none;
      pointer-events: none;
    }
  }
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  cursor: pointer;
  width: 160px;
  z-index: 10;
  height: 40px;
  border: 1px solid #707070;
  border-radius: 5px;
  background-color: #0b0c10;
  color: #c5c6c7;

  @media ${device.tablet} {
    width: 100%;
  }

  &.missing {
    border-color: red;
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }
`;

const StyledDropdown = styled.ul`
  display: none;
  position: absolute;
  z-index: 10;
  width: 160px;
  padding: 0;
  list-style-type: none;
  border: 1px solid #fff;
  max-height: 155px;
  overflow-y: scroll;

  top: 30px;
  left: 0;

  @media ${device.tablet} {
    width: 100%;
  }

  ${({ isDropdownOpen }) =>
    isDropdownOpen &&
    css`
      display: block;
    `}

  ${({ hidden }) =>
    hidden &&
    css`
      display: none;
    `}
`;

const StyledMenuItem = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 10px 5px;
  background-color: #0b0c10;
  font-size: 14px;

  img {
    margin-right: 10px;
    width: 30px !important;
    height: 30px !important;
  }

  ${({ selected }) =>
    selected &&
    css`
      background-color: #1f2833;
    `}
`;

const FilterableSelect = forwardRef((props, ref) => {
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [country, setCountry] = useState(props.initialValue || '');
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [filtered, setFiltered] = useState(props.options);

  const handleChange = e => {
    setCountry(e.target.value);

    setFiltered(
      props.options.filter(option =>
        option.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleMenuItemClick = name => {
    setCountry(name);
    setSelectedDropdown(name);
  };

  return (
    <FilterableSelectWrapper>
      <span>
        <input style={{ display: 'none' }} />
        <StyledInput
          {...props}
          autoComplete="new-password"
          type="search"
          name="nationality"
          value={country}
          onChange={handleChange}
          ref={ref}
          onFocus={() => setisDropdownOpen(true)}
          onBlur={() => setisDropdownOpen(false)}
        />
        <FiChevronDown />
      </span>
      <StyledDropdown isDropdownOpen={isDropdownOpen} hidden={filtered.length === 0}>
        {filtered.map(option => (
          <StyledMenuItem
            selected={selectedDropdown !== null && selectedDropdown === option.name ? true : null}
            onMouseDown={() => handleMenuItemClick(option.name)}
            key={option.code}
          >
            <img
              src={`https://www.countryflags.io/${option.code}/flat/24.png`}
              alt={`Flag of ${option.name}`}
            />
            {option.name}
          </StyledMenuItem>
        ))}
      </StyledDropdown>
    </FilterableSelectWrapper>
  );
});

FilterableSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default FilterableSelect;
