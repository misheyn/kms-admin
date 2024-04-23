export const indexModule = {
    state: () => ({
        activeIndex: null
    }),
    mutations: {
        setActiveIndex(state, activeIndex) {
            state.activeIndex = activeIndex
        }
    },
    namespaced: true
}
