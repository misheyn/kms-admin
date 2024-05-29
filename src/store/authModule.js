export const authModule = {
    state: {
        isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
    },
    mutations: {
        setAuthenticated(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated
            localStorage.setItem('isAuthenticated', isAuthenticated)
        }
    },
    actions: {
        logIn({commit}) {
            commit('setAuthenticated', true)
        },
        logOut({commit}) {
            commit('setAuthenticated', false)
        }
    },
    namespaced: true
}
