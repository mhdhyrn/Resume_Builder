const getCssVariable = (name) => {
  const style = getComputedStyle(document.documentElement);
  const formattedName = name.startsWith('--') ? name : `--${name}`;

  return style.getPropertyValue(formattedName);
};

export default getCssVariable;
