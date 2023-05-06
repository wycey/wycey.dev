import { styled } from "styled-vanilla-extract/qwik";

export const NavigationLinkAnchor = styled.a`
    &[data-active] {
        background: var(--indigo3);
    }

    &:hover {
        background: var(--indigo4);
    }
`;

export default "";
