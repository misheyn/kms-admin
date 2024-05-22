<template>
  <div class="password__wrapper">
    <span class="placeholder"> {{ placeholder }} </span>
    <br v-if="!password">
    <button v-if="password" @click="togglePasswordVisibility" class="password-toggle">
      <img :src="fieldType === 'password' ? showEye : hideEye" alt="password-eye">
    </button>
  </div>
  <input
      :value="modelValue"
      @input="updateInput"
      class="input"
      :type="setFieldType">
</template>

<script>
import inputMixin from "@/mixins/inputMixin";

export default {
  name: 'text-input',
  mixins: [inputMixin],
  props: {
    password: {
      type: Boolean,
      default: false
    },
    placeholder: String
  },
  data() {
    return {
      fieldType: 'password',
      showEye: require('../../assets/open_eye.png'),
      hideEye: require('../../assets/hidden_eye.png')
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.fieldType = this.fieldType === 'password' ? 'text' : 'password'
    }
  },
  computed: {
    setFieldType() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      if (!this.password) this.fieldType = 'text'
      return this.fieldType
    }
  }
}
</script>

<style scoped>
.input {
  border: 1px solid black;
  border-radius: 12px;
  padding: 5px 15px;
  margin-bottom: 5px;
  font-size: medium;
}

.password-toggle {
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 3px;
  width: 18px;
  height: 18px;
}

.password-toggle img {
  display: block;
  width: 100%;
  height: auto;
}

.placeholder {
  margin-left: 6px;
  font-size: small;
}

.password__wrapper {
  display: flex;
  align-items: center;
}
</style>
