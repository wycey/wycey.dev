import { styled } from "styled-vanilla-extract/qwik";

export const NavigationLinkAnchor = styled.a`
    display: inline-block;

    margin: 0;
    margin-block: 6px;
    padding: 6px 12px;

    border-radius: 4px;

    user-select: none;

    &[data-active] {
        background: var(--indigo3);
    }

    transition: background 150ms ease;

    &:hover {
        background: var(--indigo4);
    }
`;

export default "";
