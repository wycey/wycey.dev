import { styled } from "styled-vanilla-extract/qwik";

export const FooterLink = styled.a`
  color: var(--primary);
`;

export const FooterBase = styled.footer`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-content: center;

  width: 100vw;
  margin: 0;
  margin-top: 3rem;
  padding-inline: 3rem;
  padding-bottom: 1rem;
`;

export default "";
