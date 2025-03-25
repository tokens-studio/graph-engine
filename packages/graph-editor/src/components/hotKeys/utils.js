export function focusReactFlowPane() {
  setTimeout(() => {
    const rfPane = document.querySelector('.react-flow__pane');
    if (rfPane && rfPane instanceof HTMLElement) {
      // make the pane focusable
      rfPane.setAttribute('tabIndex', '0');
      rfPane.focus();
    }
  });
}
