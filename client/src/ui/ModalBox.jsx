import styled from "styled-components";
import { fontSizeLg } from "./uiSettings";

export default styled.div`
    & {
        width: 400px;
        height: 200px;
        border:1px solid #ccc;
        display: flex;
        align-items: center;
        border-radius: 5px;
        background-color: #ececec;
        font-size: ${fontSizeLg};
        text-align: center;
    }
`;