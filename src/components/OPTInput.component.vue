<script setup>
import { useField } from 'vee-validate';

const modelValue = defineModel();

const emits = defineEmits(['complete']);

const props = defineProps({
  length: {
    type: Number,
    required: false,
    default: 6,
  },
  name: {
    type: String,
    required: false,
    default: (props) => props.label,
  },
  rules: {
    type: [String, Object],
    required: false,
  },
  label: {
    type: String,
    required: true,
  },
});

const currentCell = ref(1);
const cells = ref([]);

const fieldOptions = { initialValue: modelValue.value };
const { value: OTPCode, setValue: setOTP } = useField(props.name, props.rules, fieldOptions);
const hintMessage = computed(() => `کد ارسالی ${props.length} رقمی را اینجا وارد کنید`);

const setFocus = (index) => {
  if (index < 1 || index > props.length + 1) return;
  if (index === props.length + 1) {
    cells.value[index - 2]?.blur();
    return;
  }
  currentCell.value = index;
  cells.value[currentCell.value - 1]?.focus();
};
const onInputHandler = (cell) => {
  if (!/[0-9]/.test(cell.value)) {
    cell.value = '';
    return;
  }

  cell.value = parseInt(cell.value);

  if (cell.value < 0) cell.value = 0;
  if (cell.value > 9) cell.value %= 10;

  goForward();
};

const onComplete = (OTPValue) => {
  const OTPLength = OTPValue?.trim().length;
  if (OTPLength !== props.length) return;
  emits('complete');
};

const getPastedValue = (pasteEvent) =>
  (pasteEvent.clipboardData || window.clipboardData).getData('text');
const onPasteUpdateOTP = (event) => {
  const pastedValue = getPastedValue(event);
  updateOTP(pastedValue);
};

const goBackward = (cell) => {
  if (cell) cell.value = '';

  setOTP(getOTP());
  emitOTP();
  setFocus(currentCell.value - 1);
};
const goForward = () => {
  setOTP(getOTP());
  emitOTP();
  setFocus(currentCell.value + 1);
};

const getOTP = () => {
  return cells.value.reduce(
    (accumulator, currentCellCell) =>
      accumulator + (currentCellCell.value ? currentCellCell.value : ' '),
    '',
  );
};
const emitOTP = () => {
  modelValue.value = OTPCode.value;
};

const updateCellValue = (OTPvalue, index) => {
  if (OTPvalue[index] === ' ') {
    cells.value[index].value == '';
    return;
  }
  cells.value[index].value = OTPvalue[index] || '';
};
const updateOTP = (OTPvalue) => {
  if (OTPvalue === undefined || cells.value.length === 0) return;
  for (let index = 0; index < (OTPvalue.length || props.length); index++) {
    if (index === props.length) break;
    updateCellValue(OTPvalue, index);
  }
  setOTP(getOTP());
  emitOTP();
  onComplete(OTPvalue);
};
watch(
  () => modelValue.value,
  (newValue) => updateOTP(newValue),
);
onMounted(() => {
  updateOTP(modelValue.value);
  setFocus(1);
});
</script>

<template>
  <div class="OTP-input">
    <label class="OTP-input__label">{{ label }}</label>
    <div class="OTP-input__cell-group">
      <input
        v-for="number in length"
        :key="number"
        type="number"
        class="OTP-input__cell"
        @input="onInputHandler($event.target)"
        @keydown.delete.prevent="goBackward($event.target)"
        @keydown.left.prevent="goBackward()"
        @keydown.right.prevent="goForward()"
        @keydown.tab.prevent="goForward()"
        @keydown.up.prevent
        @keydown.down.prevent
        @paste.prevent="onPasteUpdateOTP"
        @click="setFocus(number)"
        ref="cells"
      />
    </div>
    <p class="OTP-input__hint-message">{{ hintMessage }}</p>
  </div>
</template>

<style lang="scss" scoped>
.OTP-input {
  gap: space(2);

  @include flex(column);

  &__label {
    color: color(on-surface-variant);

    @include typography('xl', 'medium');
  }

  &__cell-group {
    direction: ltr;

    @include flex(row, nowrap, center, center, space(2));
  }

  &__cell {
    width: remify(48);
    height: remify(56);
    border-radius: radius(lg);
    color: color(on-surface);
    border: 1px solid color(outline-variant);
    background-color: color(surface);

    text-align: center;
    -moz-appearance: textfield;

    transition: all 0.3s;

    @include typography('md', 'medium');

    &:active,
    &:focus {
      border-color: color(primary);
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__hint-message {
    color: color(on-surface-variant-low);

    @include typography('md', 'light');
  }
}
</style>
