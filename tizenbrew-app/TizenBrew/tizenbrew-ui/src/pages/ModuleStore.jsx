import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { useEffect, useContext, useState } from 'react';
import { GlobalStateContext } from '../components/ClientContext.jsx';
import { Events } from '../components/WebSocketClient.js';
import { useTranslation } from 'react-i18next';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function StoreItem({ module, id, state, isInstalled, hasUpdate }) {
    const { t } = useTranslation();
    const { ref, focused } = useFocusable();

    useEffect(() => {
        if (focused) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        }
    }, [focused, ref]);

    function handleOnClick() {
        if (isInstalled && hasUpdate) {
            state.client.updateModule(module.fullName);
        } else if (!isInstalled) {
            state.client.send({
                type: Events.ModuleAction,
                payload: {
                    action: 'add',
                    module: module.fullName
                }
            });
            state.client.send({
                type: Events.GetModules,
                payload: true
            });
            state.client.browseModules();
        }
    }

    var buttonText = isInstalled ? (hasUpdate ? t('store.update') : t('store.installed')) : t('store.install');
    var buttonColor = isInstalled ? (hasUpdate ? 'bg-purple-600 hover:bg-purple-500' : 'bg-green-700') : 'bg-indigo-600 hover:bg-indigo-500';

    return (
        <div
            key={id}
            ref={ref}
            onClick={handleOnClick}
            className={classNames(
                'relative bg-gray-900 shadow-2xl rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 h-[35vh] w-[20vw] flex flex-col',
                focused ? 'focus' : '',
                id === 0 ? 'ml-4' : ''
            )}
        >
            <h3 className='text-indigo-400 text-base/7 font-semibold truncate'>
                {module.appName} ({module.version || '...'})
            </h3>
            <p className='text-gray-300 mt-4 text-base/7 flex-1 overflow-hidden'>
                {module.description}
            </p>
            <div className="flex items-center gap-2 mt-4">
                {module.featured && (
                    <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">
                        {t('store.featured')}
                    </span>
                )}
                {module.category && (
                    <span className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded-full">
                        {t('store.category.' + module.category) !== 'store.category.' + module.category ? t('store.category.' + module.category) : module.category}
                    </span>
                )}
            </div>
            <div className={classNames('mt-4 text-center py-2 rounded-lg text-white text-base/7', buttonColor)}>
                {buttonText}
            </div>
        </div>
    );
}

function SearchBar({ value, onChange, onSearch, t }) {
    const { ref, focused } = useFocusable();

    useEffect(() => {
        if (focused) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        }
    }, [focused, ref]);

    return (
        <div
            ref={ref}
            className={classNames(
                'relative bg-gray-900 shadow-2xl rounded-3xl p-6 ring-1 ring-gray-900/10 w-[60vw]',
                focused ? 'focus' : ''
            )}
        >
            <input
                type="text"
                value={value}
                className="w-full p-2 rounded-lg bg-gray-800 text-gray-200 text-base/7"
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onSearch();
                }}
                placeholder={t('store.searchPlaceholder')}
            />
        </div>
    );
}

function CategoryButton({ category, label, active, onClick, t }) {
    const { ref, focused } = useFocusable();

    return (
        <div
            ref={ref}
            onClick={onClick}
            className={classNames(
                'px-6 py-3 rounded-full text-base/7 cursor-pointer',
                active ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300',
                focused ? 'focus' : ''
            )}
        >
            {label || t('store.category.all')}
        </div>
    );
}

export default function ModuleStore() {
    const { state } = useContext(GlobalStateContext);
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [filteredModules, setFilteredModules] = useState([]);

    var storeData = state?.sharedData?.storeModules;
    var storeModules = storeData?.modules || [];
    var categories = storeData?.categories || {};
    var installedModules = state?.sharedData?.modules || [];
    var moduleUpdates = state?.sharedData?.moduleUpdates || [];

    useEffect(() => {
        if (state?.client) {
            state.client.browseModules();
            state.client.checkUpdates();
        }
    }, [state?.client]);

    useEffect(() => {
        if (!storeModules) return;
        var filtered = storeModules;
        if (activeCategory !== 'all') {
            filtered = filtered.filter(function(m) { return m.category === activeCategory; });
        }
        if (searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            filtered = filtered.filter(function(m) {
                return (m.appName && m.appName.toLowerCase().indexOf(q) !== -1) ||
                       (m.description && m.description.toLowerCase().indexOf(q) !== -1) ||
                       (m.tags && m.tags.some(function(tag) { return tag.toLowerCase().indexOf(q) !== -1; }));
            });
        }
        setFilteredModules(filtered);
    }, [storeModules, activeCategory, searchQuery]);

    function isModuleInstalled(moduleFullName) {
        return installedModules.some(function(m) { return m.fullName === moduleFullName; });
    }

    function hasModuleUpdate(moduleFullName) {
        return moduleUpdates.some(function(u) { return u.fullName === moduleFullName && u.updateAvailable; });
    }

    var featuredModules = filteredModules.filter(function(m) { return m.featured; });
    var regularModules = filteredModules.filter(function(m) { return !m.featured; });

    return (
        <div className="relative isolate lg:px-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8vh)' }}>
            <div className="mx-auto flex flex-col items-center gap-4 top-4 relative pb-8">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={() => {}}
                    t={t}
                />

                <div className="flex flex-wrap justify-center gap-2">
                    <CategoryButton
                        category="all"
                        active={activeCategory === 'all'}
                        onClick={() => setActiveCategory('all')}
                        t={t}
                    />
                    {Object.keys(categories).map(function(key) {
                        return (
                            <CategoryButton
                                key={key}
                                category={key}
                                label={categories[key]}
                                active={activeCategory === key}
                                onClick={() => setActiveCategory(key)}
                                t={t}
                            />
                        );
                    })}
                </div>

                {featuredModules.length > 0 && (
                    <>
                        <h2 className="text-2xl text-yellow-400 font-semibold mt-4 self-start ml-4">
                            {t('store.featuredSection')}
                        </h2>
                        <div className="mx-auto flex flex-wrap justify-center gap-4 relative">
                            {featuredModules.map((module, idx) => (
                                <StoreItem
                                    key={module.fullName}
                                    module={module}
                                    id={idx}
                                    state={state}
                                    isInstalled={isModuleInstalled(module.fullName)}
                                    hasUpdate={hasModuleUpdate(module.fullName)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {regularModules.length > 0 && (
                    <>
                        <h2 className="text-2xl text-indigo-400 font-semibold mt-4 self-start ml-4">
                            {t('store.allModules')}
                        </h2>
                        <div className="mx-auto flex flex-wrap justify-center gap-4 relative">
                            {regularModules.map((module, idx) => (
                                <StoreItem
                                    key={module.fullName}
                                    module={module}
                                    id={idx}
                                    state={state}
                                    isInstalled={isModuleInstalled(module.fullName)}
                                    hasUpdate={hasModuleUpdate(module.fullName)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {filteredModules.length === 0 && storeModules && storeModules.length > 0 && (
                    <p className="text-gray-400 text-base/7 mt-8">{t('store.noResults')}</p>
                )}

                {(!storeModules || storeModules.length === 0) && (
                    <p className="text-gray-400 text-base/7 mt-8">{t('store.loading')}</p>
                )}
            </div>
        </div>
    );
}
