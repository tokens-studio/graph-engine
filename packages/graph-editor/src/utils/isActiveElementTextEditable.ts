export const isActiveElementTextEditable = () => {
  const activeElement = document.activeElement as HTMLElement;

  if (!activeElement) {
    return false;
  }

  const tagName = activeElement.tagName.toLowerCase();
  const isContentEditable = activeElement.isContentEditable;

  return ['input', 'textarea'].includes(tagName) || isContentEditable;
};
