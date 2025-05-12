<script setup>
import ChainOfResponsibility from "@shared/utils/chainOfResponsibility";
import { ref } from "vue";

const createChainNode = ChainOfResponsibility.createChainNode;
const props = defineProps({
  teleportTo: {
    type: String,
    required: false,
    default: "#app",
  },
  isOpen: {
    type: Boolean,
    required: false,
    default: true,
  },
  persist: {
    type: Boolean,
    required: false,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  titleIcon: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["close"]);
const contentBottomStyle = ref("0");

const closeBottomSheet = () => {
  if (!props.persist) emits("close");
};
const handleSwipe = ({ swipe: swipeDirection }) => {
  const swipeVerticalDirection = swipeDirection[1];
  if (swipeVerticalDirection === 1) closeBottomSheet();
};
const handleDrag = ({ movement: [xAxis, yAxis], dragging }) => {
  const dragChainOfResponsibility = new ChainOfResponsibility(
    [
      createChainNode(yAxis <= 0, () => {}),
      createChainNode(!dragging && yAxis > 120, () => {
        closeBottomSheet();
        contentBottomStyle.value = "0";
      }),
      createChainNode(dragging, () => {
        contentBottomStyle.value = `${-yAxis}px`;
      }),
      createChainNode(true, () => {
        contentBottomStyle.value = "0";
      }),
    ],
    "first"
  );
  dragChainOfResponsibility.execute();
};
</script>

<template>
  <div class="bottom-sheet">
    <Teleport :to="teleportTo">
      <Transition name="bottom-sheet__content" appear>
        <dialog
          open
          v-drag="handleSwipe"
          class="bottom-sheet__content"
          v-if="isOpen"
          :style="{ bottom: contentBottomStyle }"
        >
          <div class="bottom-sheet__action" v-drag="handleDrag">
            <svg-loader name="line-496" />
          </div>
          <slot name="header">
            <div class="bottom-sheet__title title">
              <div class="title__message-wrapper">
                <svg-loader
                  v-if="titleIcon"
                  :name="titleIcon"
                  class="title__icon"
                />
                <h3 class="title__message">{{ title }}</h3>
              </div>
              <hr class="bottom-sheet__line" />
            </div>
          </slot>
          <slot />
        </dialog>
      </Transition>

      <Transition name="bottom-sheet__overlay" appear>
        <div
          class="bottom-sheet__overlay"
          @click="closeBottomSheet"
          v-if="isOpen"
        ></div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
$animation-duration: 0.5s;

.bottom-sheet {
  &__content {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background-color: color(on-primary);
    width: 60%;
    max-height: 75vh;
    border-radius: shape(lg) shape(lg) 0 0;
    padding: space(4) 0;
    margin: 0 auto;

    &-enter-active {
      animation: pop-up $animation-duration forwards;
    }

    &-leave-active {
      animation: pop-up $animation-duration reverse forwards;
    }

    @include breakpoint(expanded) {
      width: 75%;
    }

    @include breakpoint(small) {
      width: 100%;
      margin: 0;
    }

    @include breakpoint(compact) {
      width: 400px;
      margin: auto;
    }
  }

  &__overlay {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    background-color: rgba($color: #000000, $alpha: 0.4);
    opacity: 1;
    transition: all $animation-duration;

    &-enter-active {
      animation: fade-in $animation-duration forwards;
    }

    &-leave-active {
      animation: fade-in $animation-duration reverse forwards;
    }
  }

  &__line {
    display: block;
    width: 100%;
    border: remify(1px) solid color(outline-variant);
  }

  &__action {
    gap: space(1);
    margin-bottom: space(5);
    cursor: grab;
    @include flex(column, nowrap, center, center);

    &:active {
      cursor: grabbing;
    }
  }
}

.title {
  gap: space(2);
  padding: 0 0 space(2);
  @include flex($direction: column, $align: flex-start);

  &__message-wrapper {
    padding: 0 space(4);
    gap: space(2);
    @include flex($direction: row, $align: center);
  }
  &__message {
    text-align: center;
    @include typography(title-medium);
  }
  &__icon {
    width: remify(24px);
  }
}

@keyframes pop-up {
  from {
    transform: translateY(100vh);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
