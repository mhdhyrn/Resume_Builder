import { computed } from 'vue';

const useClassModifier = (rootName, conditionMapper) => {
  return computed(() => {
    const conditions = conditionMapper.value || conditionMapper;
    return conditions.filter((item) => item.condition).map((item) => `${rootName}${item.modifier}`);
  });
};
export default useClassModifier;
