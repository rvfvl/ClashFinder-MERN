import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import device from 'theme/queries';
import iconAdc from 'assets/adc.png';
import iconSupp from 'assets/supp.png';
import iconMid from 'assets/mid.png';
import iconTop from 'assets/top.png';
import iconJng from 'assets/jng.png';
import styled, { css } from 'styled-components';

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledLabel = styled.label`
  img {
    display: block;
    padding: 3px;
    width: 45px;
    height: 45px;
    margin: 0 0.5rem;
  }

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    display: block;
  }
  input + img {
    cursor: pointer;
  }

  input:checked + img {
    outline: 2px solid #fff;
  }
`;

const RoleCheckbox = forwardRef(({ name, type, role }, ref) => {
  const roles = useSelector(state => state.search.roles);

  return (
    <CheckboxWrapper className="checkbox_section">
      <StyledLabel>
        <input
          className="role_checkbox"
          type={type}
          name={type === 'radio' ? name : 'ADC'}
          ref={ref}
          {...(type === 'radio' && { value: 'ADC' })}
          {...(role === 'ADC' && { defaultChecked: true })}
          {...(type === 'checkbox' && { defaultChecked: roles.includes('ADC') })}
        />
        <img src={iconAdc} alt="Game Position" />
      </StyledLabel>
      <StyledLabel>
        <input
          className="role_checkbox"
          type={type}
          name={type === 'radio' ? name : 'SUPP'}
          ref={ref}
          {...(type === 'radio' && { value: 'SUPP' })}
          {...(role === 'SUPP' && { defaultChecked: true })}
          {...(type === 'checkbox' && { defaultChecked: roles.includes('SUPP') })}
        />
        <img src={iconSupp} alt="Game Position" />
      </StyledLabel>
      <StyledLabel>
        <input
          className="role_checkbox"
          type={type}
          name={type === 'radio' ? name : 'JNG'}
          ref={ref}
          {...(type === 'radio' && { value: 'JNG' })}
          {...(role === 'JNG' && { defaultChecked: true })}
          {...(type === 'checkbox' && { defaultChecked: roles.includes('JNG') })}
        />
        <img src={iconJng} alt="Game Position" />
      </StyledLabel>
      <StyledLabel>
        <input
          className="role_checkbox"
          type={type}
          name={type === 'radio' ? name : 'MID'}
          ref={ref}
          {...(type === 'radio' && { value: 'MID' })}
          {...(role === 'MID' && { defaultChecked: true })}
          {...(type === 'checkbox' && { defaultChecked: roles.includes('MID') })}
        />
        <img src={iconMid} alt="Game Position" />
      </StyledLabel>
      <StyledLabel>
        <input
          className="role_checkbox"
          type={type}
          name={type === 'radio' ? name : 'TOP'}
          ref={ref}
          {...(type === 'radio' && { value: 'TOP' })}
          {...(role === 'TOP' && { defaultChecked: true })}
          {...(type === 'checkbox' && { defaultChecked: roles.includes('TOP') })}
        />
        <img src={iconTop} alt="Game Position" />
      </StyledLabel>
    </CheckboxWrapper>
  );
});

export default RoleCheckbox;
