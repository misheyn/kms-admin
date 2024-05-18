<template>
  <div class="item">
    <div class="item__content" style="display: flex; align-items: center;">
      <div class="photo">
        <img :src="handleImagePreview(employee.photo)" alt="img">
      </div>
      <div class="info">
        {{employee.lastName}} {{employee.firstName}} {{employee.patronymic}}
      </div>
    </div>
    <div v-if="isEditMode" class="icon__wrapper">
      <div
          v-if="employee.inDivision"
          class="remove-icon"
          :class="{'chosen': localEmployee.isChosen}"
          @click="toggleActive"></div>
      <div
          v-else
          class="add-icon"
          :class="{'chosen': localEmployee.isChosen}"
          @click="toggleActive"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localEmployee: {}
    }
  },
  created() {
    this.localEmployee = {...this.employee}
  },
  props: {
    employee: {
      type: Object,
      required: true
    },
    isEditMode: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
    toggleActive() {
      this.localEmployee.isChosen = !this.localEmployee.isChosen
      this.$emit('chosen', this.localEmployee)
    }
  }
}
</script>

<style scoped>
.item {
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid lightgray;
}

.info {
  text-align: left;
  margin-left: 15px;
}

.photo {
  height: 40px;
  overflow: hidden;
}

.photo img {
  height: 100%;
  width: auto;
}

.remove-icon, .add-icon {
  background-size: cover;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.remove-icon {
  background-image: url("../assets/black_trash.png");
}

.remove-icon.chosen {
  background-image: url("../assets/red_trash.png");
}

.add-icon {
  background-image: url("../assets/black_plus.png");
}

.add-icon.chosen {
  background-image: url("../assets/green_plus.png");
}

</style>
