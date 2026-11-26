import { useEffect, useRef } from 'react';

export const useScrollAnimation = (className: string = 'scroll-animate') => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add in-view class immediately if element is already visible
    const checkInitialVisibility = () => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        element.classList.add('in-view');
      }
    };

    checkInitialVisibility();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return elementRef;
};

export const useScrollAnimationMultiple = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-animate');

    // Add in-view class immediately to elements already visible
    const checkInitialVisibility = () => {
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          element.classList.add('in-view');
        }
      });
    };

    checkInitialVisibility();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    // Fallback: force all elements visible after 1 second in case observer fails
    const fallbackTimeout = setTimeout(() => {
      document.querySelectorAll('.scroll-animate:not(.in-view)').forEach(el => {
        el.classList.add('in-view');
      });
    }, 1000);

    return () => {
      clearTimeout(fallbackTimeout);
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);
};
