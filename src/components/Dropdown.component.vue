<script setup>
import { computed, ref, onMounted, onBeforeUnmount, defineModel } from 'vue';
import TextField from './TextField.component.vue';
import SvgLoader from './SvgLoader.component.vue';

const modelValue = defineModel();

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: false,
  },
  rules: {
    type: [String, Object],
    required: false,
    default: 'required',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isSearchable: {
    type: Boolean,
    default: true,
  },
  isErrorVisible: {
    type: Boolean,
    default: true,
  },
});

const selectRef = ref(null);
const searchValue = ref('');
const activeOptionLabel = ref(modelValue.value);
const inputValue = computed({
  get() {
    if (isDropdownOpen.value) return searchValue.value;
    else {
      resetSearchValue();
      if (!modelValue.value) resetActiveOptionLabel();
      return activeOptionLabel.value;
    }
  },
  set(newValue) {
    if (isDropdownOpen.value) searchValue.value = newValue;
    else modelValue.value = newValue;
  },
});

const isDropdownOpen = ref(false);
const dropdownPosition = ref('bottom');
const filteredOptions = computed(() => {
  if (props.isSearchable) {
    return props.options.filter((option) => {
      return `${option.label ?? option}`.startsWith(searchValue.value);
    });
  } else {
    return props.options;
  }
});

const resetSearchValue = () => (searchValue.value = '');
const resetActiveOptionLabel = () => (activeOptionLabel.value = '');

const toggleDropdown = (event) => {
  if (props.isDisabled) return;
  if (!isDropdownOpen.value) {
    calculateDropDownPosition();
  }
  isDropdownOpen.value = !isDropdownOpen.value;
  if (!isDropdownOpen.value && event) {
    event.stopPropagation();
  }
};

const openDropdown = () => {
  if (props.isDisabled) return;
  if (!isDropdownOpen.value) {
    calculateDropDownPosition();
  }
  isDropdownOpen.value = true;
};

const calculateDropDownPosition = () => {
  const selectElement = selectRef.value;
  const rect = selectElement.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const dropdownHeight = 320;
  dropdownPosition.value =
    spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';
};

const onOptionClick = (option) => {
  modelValue.value = option.value ?? option;
  activeOptionLabel.value = option.label ?? option;
  toggleDropdown();
};

const isOptionActive = (option) => modelValue.value == option;

const handleClickOutside = (event) => {
  if (!selectRef.value.contains(event.target)) isDropdownOpen.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="u-select" ref="selectRef">
    <TextField
      :is-disabled="isDisabled"
      :is-loading="isLoading"
      v-model="inputValue"
      type="text"
      :label="label"
      :rules="rules"
      :name="name"
      append-icon="true"
      @click="openDropdown"
    >
      <template #appendIcon>
        <div v-if="isLoading" class="u-select__loading" />

        <SvgLoader
          name="arrow-down"
          class="arrow-icon"
          :class="{ 'arrow-icon--up': isDropdownOpen }"
          @click="toggleDropdown"
        />
      </template>
    </TextField>
    <Transition name="fade-list">
      <div
        v-if="isDropdownOpen"
        class="u-select__options-list"
        :class="{ 'u-select__options-list--top': dropdownPosition === 'top' }"
        @click.stop
      >
        <template v-for="option in filteredOptions" :key="option.value ?? option">
          <div
            :class="[
              'option-item',
              { 'option-item--selected': isOptionActive(option.value ?? option) },
            ]"
            @click="onOptionClick(option)"
          >
            {{ option.label ?? option }}
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.u-select {
  width: 100%;
  position: relative;
  cursor: pointer;
  color: color(on-surface);

  &__loading {
    width: remify(16);
    height: remify(16);
    border: 2px solid transparent;
    border-top: 2px solid var(--btn-text-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__options-list {
    width: 100%;
    padding: space(2);
    margin: space(1) 0 0;
    border-radius: radius(lg);
    position: absolute;
    top: space(16);
    margin: 0 0 space(1) 0;
    max-height: 20rem;
    overflow-y: auto;
    background-color: color(surface-container-lowest);
    z-index: 900;
    box-shadow: shadow(lowest);

    @include flex($direction: column, $gap: space(2));

    &::-webkit-scrollbar {
      width: remify(3);
    }

    &::-webkit-scrollbar-track {
      background: color(surface);
    }

    &::-webkit-scrollbar-thumb {
      background-color: color(primary);
      border-radius: shaper(2.5);
      margin: space(1) 0;
    }

    &--top {
      top: auto;
      bottom: 100%;
      margin: 0 0 space(1) 0;
    }
  }

  .option-item {
    width: 100%;
    padding: space(2);
    gap: space(1);
    cursor: pointer;
    border-radius: radius(lg);
    transition: background-color 0.3s;

    @include flex($align: center);
    @include typography('lg');

    &:hover {
      background-color: color(disabled-soft);
    }

    &--selected {
      background-color: color(disabled-soft);
    }

    &__child-icon {
      margin-right: space(2);
      color: color(surface);
    }

    &--nested {
      padding-left: space(10);
    }
  }

  .arrow-icon {
    transition: 0.2s;
    color: color(error);

    &--up {
      rotate: -180deg;
    }
  }
}

.fade-list-enter-active {
  transition: opacity 0.3s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
  position: absolute;
  opacity: 0;
}
</style>
