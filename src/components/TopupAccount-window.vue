<template>
  <div v-if="show" class="window-wrapper">
    <div class="window">
      <div class="window__close" @click="closeModal">&#10006;</div>
      <slot name="title"> </slot>
      <slot name="body"> </slot>
      <slot name="footer"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopupAccount-window",
  data: () => ({
    show: false
  }),
  methods: {
    closeModal() {
      this.show = false;
      this.$emit("close");
    }
  }
};
</script>

<style scoped lang="scss">
.window-wrapper {
  min-width: 320px;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(9, 9, 9, 0.61);
  min-height: 100vh;
}

.window {
  background: #fff;
  border-radius: 4px;
  padding: 0.3rem;
  /*width: 50vw;*/
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &__close {
    border-radius: 50%;
    color: #fff;
    background: #2a4cc7;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 7px;
    right: 7px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  &__title {
    color: #0971c7;
    margin: 2rem 1rem 0;
    font-size: 1.5rem;
  }

  &__content {
    margin-bottom: 20px;
  }

  &__label {
    margin: 2rem 0;
    display: block;
  }

  .window__input {
    width: 90%;
    min-height: 2rem;
    margin: 0 1rem;
    background-color: #f1f1db;
  }

  &__footer {
    &__button {
      background-color: #0971c7;
      color: #fff;
      border: none;
      text-align: center;
      padding: 8px;
      font-size: 17px;
      font-weight: 500;
      border-radius: 8px;
      min-width: 150px;
    }
  }
}
</style>
