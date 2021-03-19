import styled from 'styled-components'

export const Overlay = styled.div`
  /* background: rgba(242, 243, 245, 0.8); */
  /* background: #999591; */
  background-color: rgba(0, 0, 0, 0.5);

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`

export const Container = styled.div`
  background: #312e38;
  width: 100%;
  max-width: 400px;
  padding: 2rem 3rem;
  border-radius: 5px;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.05);
  text-align: center;
  position: relative;
`
