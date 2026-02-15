// Simple vanilla JS store for cross-island communication
const state = {
    isLoading: false,
    notification: null,
};

const listeners = new Set();

const setState = (newState) => {
    Object.assign(state, newState);
    listeners.forEach((listener) => listener(state));
};

export const uiStore = {
    subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getState: () => ({ ...state }),
    setLoading: (loading) => setState({ isLoading: loading }),
    showNotification: (message, type = 'success') => {
        setState({ notification: { message, type, id: Date.now() } });
        setTimeout(() => {
            if (state.notification?.message === message) {
                setState({ notification: null });
            }
        }, 4000);
    },
    hideNotification: () => setState({ notification: null }),
};
