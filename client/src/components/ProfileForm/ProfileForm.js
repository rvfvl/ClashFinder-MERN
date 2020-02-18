import React from 'react';
import { MdAccountCircle, MdVerifiedUser } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import PropTypes from 'prop-types';
import {
  FormWrapper,
  FormTopSection,
  FormBottonSection
} from 'components/ProfileForm/ProfileFormStyles';

const ProfileForm = ({ children, isEditable = {}, type }) => {
  const { isEditableProfile, setIsEditableProfile } = isEditable;

  return (
    <FormWrapper>
      <FormTopSection>
        {type === 'Profile' && (
          <>
            <div className="title">
              <MdAccountCircle size={28} /> <span>Profile Detail</span>
            </div>
            <div onClick={() => setIsEditableProfile(!isEditableProfile)} className="edit">
              <FiEdit size={24} />
              <span>{isEditableProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
            </div>
          </>
        )}

        {type === 'Summoner Profile' && (
          <>
            <div className="title">
              <MdVerifiedUser size={24} />
              <span>League of Legends Account Verification</span>
            </div>
          </>
        )}
      </FormTopSection>
      <FormBottonSection>{children}</FormBottonSection>
    </FormWrapper>
  );
};

export default ProfileForm;
