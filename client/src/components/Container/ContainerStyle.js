import styled from 'styled-components';
import device from 'theme/queries';

export const ContainerWrapper = styled.div`
  margin: 0;

  @media ${device.tablet} {
    margin: 0 3rem;
  }
`;
