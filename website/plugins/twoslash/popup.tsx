import { arrow, autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { useLocation } from '@rspress/core/runtime';
import { useEffect } from 'react';

import type { FC } from 'react';

type PopupElement = [reference: HTMLElement, floating: HTMLElement];

const findPopupElements = (): PopupElement[] => {
  return [...document.querySelectorAll('.twoslash-hover')]
    .map((element) => [element, element.children[0]] as PopupElement);
};

const createPopupRoot = (): HTMLElement => {
  const root = document.createElement('div');
  root.className = 'twoslash twoslash-popup-root';
  document.body.append(root);
  return root;
};

const getNavHeight = (): number => {
  const style = getComputedStyle(document.body);
  return Number(style.getPropertyValue('--rp-nav-height').replaceAll(/[^0-9]/g, ''));
};

const updatePopupPosition = ([reference, floating]: PopupElement): () => void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return autoUpdate(reference, floating, async () => {
    const arrowElement = floating.lastElementChild as HTMLElement;
    const position = await computePosition(reference, floating, {
      placement: 'bottom-start',
      middleware: [
        flip(),
        offset(4),
        shift({ padding: 16 }),
        arrow({ padding: 8, element: arrowElement }),
        size({
          padding: { top: getNavHeight(), right: 16, bottom: 16, left: 16 },
          apply: ({ availableWidth, availableHeight, elements }) => {
            elements.floating.style.maxWidth = `${Math.min(700, Math.max(0, availableWidth))}px`;
            elements.floating.style.maxHeight = `${Math.min(500, Math.max(0, availableHeight))}px`;
          },
        }),
      ],
    });
    floating.style.left = `${position.x}px`;
    floating.style.top = `${position.y}px`;
    arrowElement.style.left = `${position.middlewareData.arrow?.x}px`;
    arrowElement.style.top = `${position.middlewareData.arrow?.y}px`;
    arrowElement.className = position.placement.includes('top') ? 'twoslash-popup-arrow twoslash-popup-arrow-top' : 'twoslash-popup-arrow twoslash-popup-arrow-bottom';
  });
};

const registerPopupEvent = ([reference, floating]: PopupElement): () => void => {
  if (floating.dataset['always'] === 'true') {
    return () => {};
  }

  let timeoutId: NodeJS.Timeout | null = null;

  const showPopup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    floating.style.opacity = '1';
    floating.style.visibility = 'visible';
  };

  const hidePopup = () => {
    timeoutId = setTimeout(() => {
      floating.style.opacity = '0';
      floating.style.visibility = 'hidden';
    }, 100);
  };

  reference.addEventListener('mouseenter', showPopup);
  reference.addEventListener('mouseleave', hidePopup);
  floating.addEventListener('mouseenter', showPopup);
  floating.addEventListener('mouseleave', hidePopup);

  return () => {
    reference.removeEventListener('mouseenter', showPopup);
    reference.removeEventListener('mouseleave', hidePopup);
    floating.removeEventListener('mouseenter', showPopup);
    floating.removeEventListener('mouseleave', hidePopup);
  };
};

const TwoSlashPopup: FC = () => {
  const location = useLocation();

  useEffect(() => {
    let root: HTMLElement;
    let cleanups: (() => void)[];
    let unregisters: (() => void)[];

    setTimeout(() => {
      const elements = findPopupElements();
      root = createPopupRoot();
      cleanups = elements.map(updatePopupPosition);
      unregisters = elements.map(registerPopupEvent);

      elements.forEach(([_, floating]) => {
        root.append(floating);
        if (floating.dataset['always'] === 'true') {
          floating.style.opacity = '1';
          floating.style.visibility = 'visible';
        }
      });
    });

    return () => {
      cleanups?.forEach((cleanup) => cleanup());
      unregisters?.forEach((unregister) => unregister());
      root?.remove();
    };
  }, [location.pathname]);

  return null;
};

export default TwoSlashPopup;
