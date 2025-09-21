import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { Student } from '../types';
import { ChevronDownIcon, ChartBarIcon } from './Icons';

type SortKey = 'name' | 'points' | 'challengesCompleted';
type SortDirection = 'asc' | 'desc';

const StudentRoster: React.FC = () => {
    const { t } = useI18n();
    const { students } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('points');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const filteredStudents = useMemo(() => {
        return students.filter(student => 
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    const sortedStudents = useMemo(() => {
        return [...filteredStudents].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return a.name.localeCompare(b.name); // Secondary sort by name
        });
    }, [filteredStudents, sortKey, sortDirection]);
    
    const topScore = useMemo(() => Math.max(...students.map(s => s.points), 0), [students]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    const SortableHeader: React.FC<{ headerKey: SortKey, title: string, className?: string }> = ({ headerKey, title, className = '' }) => (
        <th scope="col" className={`px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider ${className}`}>
            <button onClick={() => handleSort(headerKey)} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-white">
                {title}
                {sortKey === headerKey && <ChevronDownIcon className={`w-4 h-4 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
            </button>
        </th>
    );

    return (
        <div className="space-y-6">
            <style>{`
                @media (max-width: 768px) {
                    .responsive-table thead {
                        display: none;
                    }
                    .responsive-table tr {
                        display: block;
                        margin-bottom: 1rem;
                        border-radius: 0.75rem;
                        overflow: hidden;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                    }
                    .responsive-table td {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.75rem 1rem;
                        text-align: right;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .dark .responsive-table td {
                        border-bottom-color: #374151;
                    }
                    .responsive-table td:last-child {
                        border-bottom: 0;
                    }
                    .responsive-table td::before {
                        content: attr(data-label);
                        font-weight: 600;
                        text-align: left;
                        margin-right: 1rem;
                    }
                }
            `}</style>
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('student_roster')}</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{t('student_roster_subtitle')}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-green-200 dark:border-green-800">
                <input
                    type="text"
                    placeholder={t('search_students')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 responsive-table">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('rank')}</th>
                            <SortableHeader headerKey="name" title={t('student')} />
                            <SortableHeader headerKey="points" title={t('points')} />
                            <SortableHeader headerKey="challengesCompleted" title={t('challenges_done')} className="text-center" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 md:divide-y-0">
                        {sortedStudents.map((student, index) => (
                             <tr key={student.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td data-label={t('rank')} className="px-6 py-4 whitespace-nowrap text-md font-bold text-gray-700 dark:text-gray-300">{index + 1}</td>
                                <td data-label={t('student')} className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-11 w-11">
                                            <img className="h-11 w-11 rounded-full object-cover" src={student.avatar} alt={`${student.name}'s avatar`} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-md font-semibold text-gray-900 dark:text-gray-100">{student.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{student.school}</div>
                                        </div>
                                    </div>
                                </td>
                                <td data-label={t('points')} className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <span className="text-md font-bold text-yellow-600 dark:text-yellow-400 w-16 text-right">{student.points.toLocaleString()}</span>
                                        <div className="hidden md:block w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(student.points / topScore) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td data-label={t('challenges_done')} className="px-6 py-4 whitespace-nowrap text-center text-md font-semibold text-green-700 dark:text-green-300">{student.challengesCompleted}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {sortedStudents.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-b-2xl">
                        <ChartBarIcon className="mx-auto w-12 h-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No students found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Adjust your search or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRoster;