import styled from 'styled-components';

const Input = styled.input`
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.greyDark};
  border-radius: 3px;
  font-size: 0.875rem;
  min-height: 1em;
  padding: 0.42857em 0.57143em;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export default Input;
