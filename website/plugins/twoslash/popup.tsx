import { arrow, autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';

const getNavHeight = (): number => {
  const element = document.querySelector('.rspress-sidebar-menu-container');
  if (!element) return 0;
  return Number(getComputedStyle(element).height.replaceAll(/[^0-9]/g, ''));
};

export class TwoslashPopupPortal extends HTMLElement {
  static NAME = 'twoslash-popup-portal';

  static get instance(): Element {
    const element = document.querySelector(TwoslashPopupPortal.NAME);
    if (!element) {
      const portal = document.createElement(TwoslashPopupPortal.NAME);
      portal.className = 'twoslash';
      document.body.append(portal);
      return portal;
    }
    return element;
  }
}

export class TwoslashPopupTrigger extends HTMLElement {
  static NAME = 'twoslash-popup-trigger';
}

export class TwoslashPopupContainer extends HTMLElement {
  static NAME = 'twoslash-popup-container';

  #clone: {
    element: HTMLElement;
    cleanup: () => void;
  } | undefined;

  connectedCallback() {
    const trigger = this.parentElement;
    if (!(trigger instanceof TwoslashPopupTrigger)) return;

    const element = this.cloneNode(true) as HTMLElement;
    const cleanups = [
      this.#registerUpdatePosition(trigger, element),
      this.#registerPopupEvent(trigger, element),
    ];

    this.#clone = {
      element,
      cleanup: () => cleanups.forEach((cleanup) => cleanup()),
    };
    TwoslashPopupPortal.instance.append(this.#clone.element);
    this.#clone.element.dataset['initialized'] = 'true';
  }

  disconnectedCallback() {
    this.#clone?.cleanup();
    this.#clone?.element.remove();
  }

  #registerUpdatePosition(trigger: HTMLElement, popup: HTMLElement): () => void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return autoUpdate(trigger, popup, async () => {
      const arrowElement = popup.firstElementChild as HTMLElement;
      const position = await computePosition(trigger, popup, {
        placement: 'bottom-start',
        middleware: [
          flip(),
          offset(4),
          shift({ padding: 16 }),
          arrow({ padding: 8, element: arrowElement }),
          size({
            padding: { top: getNavHeight() + 16, right: 16, bottom: 16, left: 16 },
            apply: ({ availableWidth, availableHeight, elements }) => {
              elements.floating.style.maxWidth = `${Math.min(700, Math.max(0, availableWidth))}px`;
              elements.floating.style.maxHeight = `${Math.min(500, Math.max(0, availableHeight))}px`;
            },
          }),
        ],
      });

      popup.style.left = `${position.x}px`;
      popup.style.top = `${position.y}px`;
      arrowElement.style.left = `${position.middlewareData.arrow?.x}px`;
      arrowElement.style.top = `${position.middlewareData.arrow?.y}px`;
      arrowElement.dataset['side'] = position.placement;
    });
  }

  #registerPopupEvent(trigger: HTMLElement, popup: HTMLElement) {
    if (popup.dataset['always'] === 'true') {
      return () => {};
    }

    let timeoutId: NodeJS.Timeout | null = null;

    const showPopup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      popup.dataset['state'] = 'show';
    };

    const hidePopup = () => {
      timeoutId = setTimeout(() => {
        popup.dataset['state'] = 'hidden';
      }, 100);
    };

    trigger.addEventListener('mouseenter', showPopup);
    trigger.addEventListener('mouseleave', hidePopup);
    popup.addEventListener('mouseenter', showPopup);
    popup.addEventListener('mouseleave', hidePopup);

    return () => {
      trigger.removeEventListener('mouseenter', showPopup);
      trigger.removeEventListener('mouseleave', hidePopup);
      popup.removeEventListener('mouseenter', showPopup);
      popup.removeEventListener('mouseleave', hidePopup);
    };
  }
}
