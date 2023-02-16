import { styled } from "styled-vanilla-extract/qwik";

export const Logo = styled.h1`
    display: block;
    position: relative;
    padding: 4px;
    padding-bottom: 0;
    margin: 0;
    cursor: default;
    user-select: none;

    &::before {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        inset: 0 0 0 0;
        background-color: var(--indigo7);
        z-index: -1;
        content: " ";
        transform: scaleX(0);
        transform-origin: bottom right;
        transition: transform 300ms ease;
    }

    &:hover::before {
        transform-origin: bottom left;
        transform: scaleX(1);
    }
`;

export const NavigationArea = styled.nav`
    display: grid;
    grid-template-columns: auto 1fr auto;

    width: 100%;
    padding-left: 5%;
`;

export const NavigationList = styled.ul`
    display: inline-flex;
    align-items: center;
    flex-direction: row;
`;

export const HeaderBase = styled.header`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;

    width: 100vw;
    align-content: center;
    padding-inline: 2rem;
    padding-top: 10px;
    margin-bottom: 2rem;
`;

export default "";
