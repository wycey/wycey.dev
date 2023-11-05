import { styled } from "styled-vanilla-extract/qwik";

export const BadgeBase = styled.a`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  margin-inline: 6px;
  padding-inline: 8px;

  border-radius: 9999px;
  background: var(--accent-background);
  border: 1px solid var(--accent-border);
  color: var(--accent-color);
  transition:
    background 300ms ease,
    border 300ms ease;

  &:hover {
    background: var(--accent-hover-background);
    border: 1px solid var(--accent-hover-border);
  }
`;

export const BadgeIcon = styled.img`
  display: inline-block;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  margin-block: 3px;
  margin-right: 6px;
`;

export default "";
