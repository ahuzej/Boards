
export function saveToStorage(state) {
    try {
        const { user } = state;
        let serializedState = JSON.stringify({ user });
        localStorage.setItem('state', serializedState);
    } catch (err) {
        
    }
}

export function loadFromStorage() {
    try {
        let storedState = localStorage.getItem('state');
        if(storedState) {
            return JSON.parse(storedState);
        } else {
            return undefined;
        }
    } catch (err) {
        return undefined;
    }
}