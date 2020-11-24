import { styled } from "@material-ui/core";

function TabContent(props) {
    const { isVisible, children } = props;

    return isVisible ? children : null;
}

export default styled(TabContent)`
    
`;