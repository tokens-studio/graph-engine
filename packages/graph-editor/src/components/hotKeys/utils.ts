export function focusReactFlowPane(containerSelector?: string) {
  setTimeout(() => {
    let rfPane;

    if (containerSelector) {
      const container = document.querySelector(containerSelector);
      if (container) {
        rfPane = container.querySelector('.react-flow__pane');
      }
    }

    if (rfPane && rfPane instanceof HTMLElement) {
      // make the pane focusable
      rfPane.setAttribute('tabIndex', '0');
      rfPane.focus();
    }
  });
}
