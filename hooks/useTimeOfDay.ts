import { useEffect } from 'react';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export const useTimeOfDay = () => {
  useEffect(() => {
    const hour = new Date().getHours();
    let backgroundClass = '';
    let darkBackgroundClass = '';

    if (hour >= 5 && hour < 12) {
      backgroundClass = 'bg-morning';
      darkBackgroundClass = 'dark:bg-dark-morning';
    } else if (hour >= 12 && hour < 17) {
      backgroundClass = 'bg-day';
      darkBackgroundClass = 'dark:bg-dark-day';
    } else if (hour >= 17 && hour < 21) {
      backgroundClass = 'bg-evening';
      darkBackgroundClass = 'dark:bg-dark-evening';
    } else {
      backgroundClass = 'bg-night';
      darkBackgroundClass = 'dark:bg-dark-night';
    }

    const bodyClasses = document.body.classList;
    const classesToRemove = Array.from(bodyClasses).filter(cls => 
        cls.startsWith('bg-') || cls.startsWith('dark:bg-')
    );
    bodyClasses.remove(...classesToRemove);
    
    bodyClasses.add(backgroundClass, darkBackgroundClass);

  }, []);
};
