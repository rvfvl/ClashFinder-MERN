import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import device from 'theme/queries';
import { FiChevronDown } from 'react-icons/fi';

const SelectWrapper = styled.div`
  position: relative;
  /* width: 160px; */

  @media ${device.tablet} {
    width: 100%;
  }

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
`;

const StyledSelect = styled.select`
  padding: 0.5rem;
  cursor: pointer;
  width: 100%;
  height: 40px;
  z-index: 10;
  border: 1px solid #707070;
  border-radius: 5px;
  background-color: #0b0c10;
  color: #c5c6c7;
  appearance: none;

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

const Select = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.initialValue || '');

  return (
    <SelectWrapper>
      <StyledSelect
        {...props}
        ref={ref}
        value={value}
        onChange={e => {
          setValue(e.target.value);
          if (props.minSkill) {
            props.minSkill.setMinSkill(parseInt(e.target.value, 10));
          }

          if (props.maxSkill) {
            props.maxSkill.setMaxSkill(parseInt(e.target.value, 10));
          }
        }}
      >
        {props.children}
      </StyledSelect>
      <FiChevronDown />
    </SelectWrapper>
  );
});

export default Select;
