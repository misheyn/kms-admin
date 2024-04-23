export default {
    props: {
        modelValue: [String, Number]
    },
    methods: {
        updateInput (event) {
            this.$emit('update:modelValue', event.target.value)
        }
    }
}
