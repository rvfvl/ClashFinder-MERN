import React, { forwardRef } from 'react';
import Select from 'components/Select/Select';

const RankSelect = forwardRef((props, ref) => {
  return (
    <Select
      {...props}
      ref={ref}
      initialValue={props.minSkill ? props.minSkill.minSkill : props.maxSkill.maxSkill}
    >
      <option value="1">Iron</option>
      <option value="2">Bronze</option>
      <option value="3">Silver</option>
      <option value="4">Gold</option>
      <option value="5">Platinum</option>
      <option value="6">Diamond</option>
    </Select>
  );
});

export default RankSelect;
