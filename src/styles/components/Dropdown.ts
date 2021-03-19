import styled from 'styled-components'
import { shade } from 'polished'

export const DropDownContainer = styled.div`
  position: relative;
`

export const DropDownListContainer = styled.div`
  position: absolute;

  /* margin-top: 160px; */
  margin-top: 1.2rem;

  min-width: 140px;
  margin-left: -130px;

  z-index: 1;
`

export const DropDownList = styled('ul')``

export const ListItem = styled('li')`
  padding: 10px 10px;
  cursor: pointer;

  &:hover {
    color: ${shade(0.2, '#2fd0d6')};
  }
`
