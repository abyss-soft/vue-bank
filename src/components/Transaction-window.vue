<template>
  <div v-if="show" class="window">
    <slot name="title"></slot>
    <slot name="body"></slot>
    <slot name="footer">
      <button class="window__button" @click="closeModal">Закрыть</button>
    </slot>
  </div>
</template>

<script>
export default {
  name: "Transaction-window",
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
.window {
  min-width: 320px;
  min-height: 200vh;
  width: 100%;
  background: #e0e3e4;
  padding: 2rem 0.5rem;
  position: absolute;
  top: 0;

  &__title {
    color: #0971c7;
    margin: 2rem 1rem 0;
    font-size: 2rem;
  }

  &__content {
    margin-bottom: 20px;
  }

  &__row {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    font-size: 1rem;
    p {
      padding: 0 1rem;
    }
    border-bottom: 1px dotted #2a4cc7;

    @include respond-to(tablets) {
      flex-direction: column;
      font-size: 1.3rem;
    }
    @include respond-to(desktop) {
      flex-direction: row;
      font-size: 1.6rem;
    }
  }

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
</style>
