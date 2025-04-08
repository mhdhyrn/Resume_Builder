<script setup></script>
<template>
  <section class="home">
    <div class="home__content">
      <h1 class="home__title">رزومه حرفه‌ای خودتو سریع بساز</h1>
      <p class="home__subtitle">
        با رزومه‌ساز آنلاین ما، تنها در چند دقیقه یک رزومه جذاب و حرفه‌ای بساز.
      </p>
      <div class="home__actions">
        <button class="home__btn home__btn--primary">ساخت رزومه</button>
        <button class="home__btn home__btn--secondary">دیدن نمونه‌ها</button>
      </div>
    </div>

    <div class="home__image-wrapper">
      <img src="" alt="Illustration of a resume builder" class="home__image" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f7fa, #eef1f6);

  &__content {
    flex: 1;
    padding: 2rem;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 1rem;
  }

  &__subtitle {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 2rem;
  }

  &__actions {
    display: flex;
    gap: 1rem;
  }

  &__btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;

    &--primary {
      background-color: #4a90e2;
      color: #fff;

      &:hover {
        background-color: #357ab8;
      }
    }

    &--secondary {
      background-color: transparent;
      border: 2px solid #4a90e2;
      color: #4a90e2;

      &:hover {
        background-color: #4a90e2;
        color: #fff;
      }
    }
  }

  &__image-wrapper {
    flex: 1;
    text-align: center;
  }

  &__image {
    max-width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    text-align: center;

    &__actions {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}
</style>
