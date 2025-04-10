<script setup>
import TheSidebar from './TheSidebar.component.vue';
import BaseLogo from './BaseLogo.component.vue';
import Button from './Button.component.vue';
import SvgLoader from './SvgLoader.component.vue';
import { navItems } from '@/constants';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSidebarOpen = ref(false);
const isUserLogin = ref(sessionStorage.getItem('isUserLogin'));
const phoneNumber = ref(sessionStorage.getItem('phoneNumber'));

const isMobile = ref(false);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

const openSidebar = () => (isSidebarOpen.value = true);
const closeSidebar = () => (isSidebarOpen.value = false);

const authButtonsConfig = reactive([
  {
    text: 'ورود',
    handler: () => router.push({ name: 'Login' }),
  },
]);

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});
</script>

<template>
  <header class="the-header">
    <div class="the-header__logo-menu-container">
      <Button variant="text" class="the-header__menu-btn" :handler="openSidebar">
        <SvgLoader name="hamburger-menu" class="the-header__menu-icon" />
      </Button>
      <BaseLogo class="the-header__logo" />
    </div>
    <nav class="the-header__nav" v-if="!isMobile">
      <ul class="the-header__nav-container">
        <li v-for="item in navItems" :key="item.name">
          <RouterLink :to="item.href" class="the-header__nav-items">{{ item.name }}</RouterLink>
        </li>
      </ul>
    </nav>
    <div class="the-header__auth-btns-container" v-if="!isUserLogin">
      <Button
        v-for="(config, index) in authButtonsConfig"
        :key="index"
        v-bind="config"
        class="the-header__auth-btns"
      />
    </div>
    <div class="the-header__user-profile" v-else>
      <div class="the-header__user-image"></div>
      <span class="the-header__user-phone-number">{{ phoneNumber }}</span>
    </div>
    <TheSidebar :items="navItems" :is-open="isSidebarOpen" @close="closeSidebar" />
  </header>
</template>

<style lang="scss" scoped>
.the-header {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  padding: space(3) space(4);
  background-color: color(surface);
  box-shadow: shadow('low');
  z-index: 200;
  @include flex($align: center, $justify: space-between);

  &__logo-menu-container {
    width: 45%;
    @include flex($align: center, $gap: space(2));

    @include breakpoint(md) {
      width: 20%;
    }

    @include breakpoint(lg) {
      width: 15%;
    }
  }

  &__logo {
    width: remify(120);
    @include breakpoint(md) {
      width: remify(120);
    }
  }

  &__nav-container {
    display: flex;
    @include flex($gap: space(6));
  }

  &__nav-items {
    color: color(on-surface);
  }

  &__auth-btns-container,
  &__user-profile {
    width: 40%;
    @include flex($align: center, $justify: center, $gap: space(2));

    @include breakpoint(md) {
      width: 20%;
    }

    @include breakpoint(lg) {
      width: 15%;
    }
  }

  &__auth-btns {
    width: remify(150);
  }

  &__user-image {
    border-radius: radius(pill);
    width: remify(40);
    height: remify(40);
    background-color: rgb(158, 158, 158);
  }

  &__menu-btn {
    width: remify(45);
    color: color(on-surface);

    @include breakpoint(md) {
      display: none;
    }
  }
}
</style>
