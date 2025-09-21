import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import { Page } from '../types';

interface TourStep {
    selector: string;
    titleKey: any;
    descriptionKey: any;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
    {
        selector: '#welcome-header',
        titleKey: 'tour_step_1_title',
        descriptionKey: 'tour_step_1_desc',
        position: 'bottom',
    },
    {
        selector: '#stats-grid',
        titleKey: 'tour_step_2_title',
        descriptionKey: 'tour_step_2_desc',
        position: 'bottom',
    },
    {
        selector: '#journey-card',
        titleKey: 'tour_step_3_title',
        descriptionKey: 'tour_step_3_desc',
        position: 'right',
    },
    {
        selector: '#ai-assistant-fab',
        titleKey: 'tour_step_4_title',
        descriptionKey: 'tour_step_4_desc',
        position: 'left',
    },
    {
        selector: `aside button`, // A generic selector for a button in the sidebar
        titleKey: 'tour_step_5_title',
        descriptionKey: 'tour_step_5_desc',
        position: 'right',
    },
];

interface InteractiveTourProps {
    onComplete: () => void;
}

// FIX: This component was incomplete. It now returns a valid React Node (JSX) to render the tour, fixing the type error. A default export is also added, resolving the import error in Dashboard.tsx.
const InteractiveTour: React.FC<InteractiveTourProps> = ({ onComplete }) => {
    const { t } = useI18n();
    const [stepIndex, setStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const currentStep = tourSteps[stepIndex];

    useEffect(() => {
        const targetElement = document.querySelector<HTMLElement>(currentStep.selector);
        
        const cleanup = (el: HTMLElement | null) => {
            el?.classList.remove('tour-highlight');
            document.querySelector('aside')?.classList.remove('tour-highlight-z');
        };

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

            const updateRect = () => {
                const rect = targetElement.getBoundingClientRect();
                setTargetRect(rect);
                targetElement.classList.add('tour-highlight');
            };

            const timeoutId = setTimeout(updateRect, 300);
            
            if (currentStep.selector.includes('aside')) {
                document.querySelector('aside')?.classList.add('tour-highlight-z');
            } else {
                 document.querySelector('aside')?.classList.remove('tour-highlight-z');
            }
            
            return () => {
                clearTimeout(timeoutId);
                cleanup(targetElement);
            };
        } else {
            if (stepIndex < tourSteps.length - 1) {
                setStepIndex(stepIndex + 1);
            } else {
                onComplete();
            }
        }
    }, [currentStep, stepIndex, onComplete]);

    const handleNext = () => {
        if (stepIndex < tourSteps.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            onComplete();
        }
    };

    const getTooltipStyle = (): React.CSSProperties => {
        if (!targetRect || !tooltipRef.current) return { opacity: 0 };

        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const position = currentStep.position || 'bottom';
        const gap = 12;
        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = targetRect.top - tooltipRect.height - gap;
                left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + gap;
                left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'left':
                top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
                left = targetRect.left - tooltipRect.width - gap;
                break;
            case 'right':
                top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
                left = targetRect.right + gap;
                break;
        }
        
        if (left < gap) left = gap;
        if (top < gap) top = gap;
        if (left + tooltipRect.width > window.innerWidth - gap) {
            left = window.innerWidth - tooltipRect.width - gap;
        }
        if (top + tooltipRect.height > window.innerHeight - gap) {
            top = window.innerHeight - tooltipRect.height - gap;
        }

        return { top, left, position: 'fixed' };
    };
    
    if (!targetRect) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onComplete} />
            <div 
                className="tour-highlight-box" 
                style={{ 
                    top: targetRect.top - 4, 
                    left: targetRect.left - 4, 
                    width: targetRect.width + 8, 
                    height: targetRect.height + 8,
                    position: 'fixed'
                }}
            />
            <div 
                ref={tooltipRef}
                className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-72 z-[102] animate-fade-in-up"
                style={getTooltipStyle()}
            >
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{t(currentStep.titleKey)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t(currentStep.descriptionKey)}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">{`${stepIndex + 1} / ${tourSteps.length}`}</span>
                    <div>
                        <button onClick={onComplete} className="text-sm text-gray-600 dark:text-gray-400 hover:underline mr-4">{t('tour_skip')}</button>
                        <button onClick={handleNext} className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-md hover:bg-green-700">
                            {stepIndex === tourSteps.length - 1 ? t('tour_done') : t('tour_next')}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .tour-highlight {
                    position: relative;
                    z-index: 101 !important;
                    border-radius: 6px;
                }
                .tour-highlight-box {
                    box-shadow: 0 0 0 9999px rgba(0,0,0,0.7);
                    border-radius: 8px;
                    z-index: 100;
                    pointer-events: none;
                    transition: all 0.3s ease-in-out;
                }
                 .tour-highlight-z {
                    z-index: 101 !important;
                 }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                 @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
            `}</style>
        </div>
    );
};
export default InteractiveTour;