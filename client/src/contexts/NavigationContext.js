import React from 'react';
import { appName } from '../ui/uiSettings';
let title = appName;
const NavigationContext = React.createContext({
    title: title,
    setTitle: (newTitle) => { title = newTitle; }
});

export default NavigationContext;
