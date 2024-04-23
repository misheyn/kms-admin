export default {
    mounted(el, binding) {
        const handleScroll = (event) => {
            binding.value(event)
        }
        el.__handleScroll__ = handleScroll
        window.addEventListener('scroll', handleScroll)
    },
    unmounted(el) {
        window.removeEventListener('scroll', el.__handleScroll__)
        delete el.__handleScroll__
    },
    name: 'scroll'
}
