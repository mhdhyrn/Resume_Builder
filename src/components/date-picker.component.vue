<template>
  <div :class="calendarClass" class="calendar" v-click-outside="clickOutside">
    <div v-if="simple" :id="calendarInputId" class="calendar__custom-input">
      <InfraSvgLoader class="calendar__icon" name="calendar" />
      <span class="calendar__title">{{ shownDate }}</span>
      <InfraSvgLoader v-if="!disabled" class="calendar__chevron" name="arrow-down" />
    </div>
    <TextField
      v-else
      v-model="date"
      :debounce="200"
      :disabled="disabled"
      :label="label"
      :name="calendarInputId"
      has-clear-button
    >
    </TextField>

    <DatePicker
      v-model="date"
      :custom-input="`#${calendarInputId}`"
      :disabled="disabled"
      :format="format"
      :max="maxDate"
      :min="minDate"
      :popover="vpdPopover"
      :show="showCalendar"
      :type="type"
      class="calendar__picker"
      auto-submit
      @change="handleDateChange"
      @close="closeCalendar"
      @open="openCalendar"
    >
      <template #header-date>
        <div class="calendar__header">
          <InfraSvgLoader class="calendar__close-icon" name="close-circle" @click="closeCalendar" />
          <span>تاریخ را انتخاب کنید</span>
        </div>
      </template>

      <template #header-year>
        <span id="year-name" class="calendar__navigation"> </span>
      </template>

      <template v-slot:month-name="{ date }">
        <Teleport to="#year-name" defer>
          {{ date.xFormat("jYYYY") }}
          <InfraSvgLoader class="calendar__chevron" name="arrow-down" />
        </Teleport>
        <span class="calendar__navigation">
          {{ date.xFormat("jMMMM") }}
          <InfraSvgLoader class="calendar__chevron" name="arrow-down" />
        </span>
      </template>
    </DatePicker>
  </div>
</template>

<script setup>
  import DatePicker from "vue3-persian-datetime-picker";
  import { generateRandomString } from "@/utils/index";
  import moment from "moment-jalaali";
  import { useBreakpoints } from "@/composables";

  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false,
    },
    simple: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    /**
     * The minimum and maximum of selectable period
     * @example 1403/12/12 | today (generate today's date)
     */
    min: {
      type: String,
      default: "",
    },
    max: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "date",
    },
    format: {
      type: String,
      default: "",
    },
  });

  const calendarInputId = `calendar-input-${generateRandomString()}`;

  const date = defineModel({
    type: String,
    required: true,
  });
  const shownDate = ref("");
  const showCalendar = ref(false);

  const openCalendar = () => {
    showCalendar.value = true;
  };

  const closeCalendar = () => {
    showCalendar.value = false;
  };

  const clickOutside = (event) => {
    const isClickedOnCalendarItems = event?.target?.classList?.contains("vpd-addon-list-item");
    if (!isClickedOnCalendarItems && showCalendar.value) closeCalendar();
  };

  const handleDateChange = (date) => {
    shownDate.value = props.simple ? date.format("dddd، jD jMMMM jYYYY") : date.format("jYYYY/jMM/jDD");
  };

  const vpdPopover = computed(() => {
    if (!useBreakpoints["medium"].value) return null;
    return props.simple && "bottom-right";
  });
  const calendarClass = computed(() => ({
    "calendar--popover": props.simple && useBreakpoints["medium"].value,
  }));

  const todayDate = moment().format("jYYYY/jMM/jDD");

  const minDate = computed(() => (props.min === "today" ? todayDate : props.min));
  const maxDate = computed(() => (props.max === "today" ? todayDate : props.max));

  const initialShownDate = () => {
    let targetDate;

    if (date.value) {
      const shamsiDate = date.value.replace(/\//g, "-");
      const year = shamsiDate.substring(0, 4);
      const month = shamsiDate.substring(4, 6);
      const day = shamsiDate.substring(6, 8);
      const gregorianDate = moment(`${year}/${month}/${day}`, "jYYYY/jMM/jDD").toDate();
      targetDate = gregorianDate;
    } else {
      targetDate = new Date();
    }

    const formattedDate = moment(targetDate).format("jYYYY jMMMM jD dddd");

    const [weekday, day, month, year] = formattedDate.split(" ");
    shownDate.value = `${year}، ${month} ${day} ${weekday}`;
  };

  const initialize = () => {
    if (props.simple) {
      if (!date.value) date.value = todayDate;
      initialShownDate();
    }
  };

  onMounted(() => initialize());
</script>

<style lang="scss" scoped>
  .calendar {
    flex-grow: 1;
    position: relative;
    user-select: none;
    width: 100%;

    @include flex($align: center, $justify: center);

    &__custom-input {
      cursor: pointer;
      column-gap: space(2);

      @include flex($align: center);
    }

    &__icon {
      color: color(on-surface);

      @include dimension(24px, 24px);
    }

    &__chevron {
      color: color(primary);

      @include dimension(24px, 24px);
    }

    &__title {
      color: color(on-surface);
      cursor: pointer;
      white-space: nowrap;

      @include typography(title-medium);
    }

    &__header {
      gap: space(2);

      @include flex($align: center, $justify: center);
      @include typography(title-medium);
    }

    &__close-icon {
      cursor: pointer;
      display: flex;
      color: color(on-surface);
    }

    &__navigation {
      color: color(on-surface) !important;

      @include flex($align: center, $justify: center);
      @include typography(title-medium);
    }
  }
</style>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
  .calendar {
    .vpd-main {
      position: static;
    }

    .vpd-body {
      padding-bottom: space(4);

      & > br {
        display: none;
      }
    }

    .vpd-content {
      border-radius: shape(xl);
      overflow: hidden;
      box-shadow: none !important;
      background-color: color(surface-container-low);
    }

    .vpd-header {
      background-color: transparent !important;
      color: color(on-surface);
      padding: space(4) 0;
    }

    .vpd-date {
      height: auto;
      width: 100%;
      text-align: center;

      @include typography(title-large);
    }

    .vpd-week {
      color: color(on-surface-variant);

      @include typography(title-medium);
      @include flex($justify: center);
    }

    .vpd-day-effect {
      border-radius: shape(circle);
    }

    .vpd-day {
      color: color(on-surface);
    }

    .vpd-day[disabled="true"] .vpd-day-text {
      color: color(surface-container-high);
    }

    .vpd-day:not([disabled]).vpd-selected span {
      color: color(on-primary);
      background-color: color(primary) !important;
    }

    .vpd-next,
    .vpd-prev {
      display: none;
    }

    .vpd-month-label {
      color: color(on-surface);

      @include position($left: auto, $right: 24px);
      @include dimension(auto, auto);

      & > span {
        border: none;
        padding: 0;
      }
    }

    .vpd-year-label {
      z-index: zIndex(masked);
      opacity: 1;

      @include position($left: 24px, $top: 58px);
      @include dimension(auto, auto);

      & > span {
        border: none;
        padding: 0;
      }
    }

    .vpd-controls {
      height: 40px;
    }

    .vpd-addon-list {
      z-index: zIndex(masked);
      padding-top: 0;
      background-color: color(surface-container-low);
    }

    .vpd-addon-list-item {
      border-color: color(surface-container-low);

      &.vpd-selected {
        background-color: color(surface-container-high);
        color: color(on-surface) !important;
      }

      &:hover {
        background-color: color(surface-container-high);
        color: color(on-surface);
      }
    }

    .vpd-close-addon {
      display: none;
    }
  }

  .calendar--popover {
    .vpd-container {
      transform: translate(50%, 12px) !important;
      right: 50% !important;
    }
  }
</style>
