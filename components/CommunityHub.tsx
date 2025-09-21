import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { CommunityEvent, EventCategory } from '../types';
import { UsersIcon, XIcon, CheckmarkIcon, CalendarDaysIcon, ClockIcon, MapIcon } from './Icons';

// --- Propose Event Modal ---
const ProposeEventModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useI18n();
    const { proposeEvent } = useAuth();
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const eventData = {
            titleKey: formData.get('title') as string,
            descriptionKey: formData.get('description') as string,
            category: formData.get('category') as EventCategory,
            maxMembers: parseInt(formData.get('maxMembers') as string, 10),
            points: parseInt(formData.get('points') as string, 10),
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            venue: formData.get('venue') as string,
        };
        // Basic validation
        if (eventData.titleKey && eventData.descriptionKey && eventData.maxMembers > 0 && eventData.points > 0) {
            proposeEvent(eventData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('propose_event_modal_title')}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('propose_event_modal_desc')}</p>
                    </div>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('event_title_label')}</label>
                            <input type="text" name="title" id="title" required className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('event_desc_label')}</label>
                            <textarea name="description" id="description" rows={3} required className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('event_date')}</label>
                                <input type="date" name="date" id="date" required className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                             <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('event_time')}</label>
                                <input type="text" name="time" id="time" placeholder="e.g., 10:00 AM" required className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('event_venue')}</label>
                            <input type="text" name="venue" id="venue" placeholder="e.g., Central Park" required className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('event_category_label')}</label>
                            <select name="category" id="category" required className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                                {Object.values(EventCategory).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('event_members_label')}</label>
                                <input type="number" name="maxMembers" id="maxMembers" min="2" max="50" required className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label htmlFor="points" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('event_points_label')}</label>
                                <input type="number" name="points" id="points" min="50" max="1000" step="10" required className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 rounded-b-2xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 btn-subtle-interactive">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-green-700 btn-hover">{t('submit_for_review')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Event Card Component ---
const EventCard: React.FC<{ event: CommunityEvent; onJoin: (id: number) => void; }> = ({ event, onJoin }) => {
    const { t } = useI18n();
    const isFull = event.currentMembers >= event.maxMembers;
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col transition-shadow duration-300 hover:shadow-lg">
            <div className="flex justify-between items-start">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">{event.category}</span>
                <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-500">{event.points}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('points').toUpperCase()}</p>
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-3">{t(event.titleKey as any)}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 mb-4">{t(event.descriptionKey as any)}</p>
            
             <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-gray-500" />
                    <span>{event.venue}</span>
                </div>
            </div>

            <div className="flex-grow mt-auto">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('participants')} ({event.currentMembers}/{event.maxMembers})</h4>
                {event.participants.length > 0 ? (
                    <div className="flex items-center space-x-2">
                        <div className="flex -space-x-3">
                            {event.participants.slice(0, 4).map(name => (
                                <img
                                    key={name}
                                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                                    src={`https://i.pravatar.cc/100?u=${encodeURIComponent(name)}`}
                                    alt={name}
                                    title={name}
                                />
                            ))}
                        </div>
                        {event.participants.length > 4 && (
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">+{event.participants.length - 4} more</span>
                        )}
                    </div>
                ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">{t('no_participants')}</p>
                )}
            </div>

            <button
                onClick={() => onJoin(event.id)}
                disabled={isFull || event.isJoined}
                className={`w-full mt-6 py-2.5 px-4 font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 btn-hover
                    ${event.isJoined ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed' : 
                     isFull ? 'bg-red-200 text-red-600 dark:bg-red-900/50 dark:text-red-300 cursor-not-allowed' : 
                     'bg-brand-primary text-white hover:bg-green-700'}`}
            >
                {event.isJoined ? <><CheckmarkIcon className="w-5 h-5"/>{t('joined')}</> : isFull ? t('event_full') : t('join_event')}
            </button>
        </div>
    );
};

// --- Main Events Component ---
const Events: React.FC = () => {
    const { t } = useI18n();
    const { events, joinEvent } = useAuth();
    const [activeTab, setActiveTab] = useState<EventCategory | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = ['all', ...Object.values(EventCategory)];

    const filteredEvents = useMemo(() => {
        if (activeTab === 'all') return events;
        return events.filter(p => p.category === activeTab);
    }, [events, activeTab]);

    return (
        <div className="space-y-6">
            {isModalOpen && <ProposeEventModal onClose={() => setIsModalOpen(false)} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('events')}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{t('events_subtitle')}</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex-shrink-0 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2 btn-hover">
                    <UsersIcon className="w-5 h-5"/>
                    {t('propose_event')}
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category as EventCategory | 'all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-full btn-subtle-interactive ${
                            activeTab === category
                                ? 'bg-brand-primary text-white shadow'
                                : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        {category === 'all' ? t(category) : category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} onJoin={joinEvent} />
                ))}
            </div>
        </div>
    );
};

export default Events;