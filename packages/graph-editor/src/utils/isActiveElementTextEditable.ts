export const isActiveElementTextEditable = () => {
        const activeElement = document.activeElement;
        
        if (!activeElement) {
            return false;
        }

        const tagName = activeElement.tagName.toLowerCase();
        const isContentEditable = activeElement.getAttribute('contentEditable') === 'true';

        return ['input', 'textarea'].includes(tagName) || isContentEditable;
}
