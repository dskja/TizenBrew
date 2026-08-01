import { setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { useEffect, useContext, useState, useRef } from 'react';
import { GlobalStateContext } from '../components/ClientContext.jsx';
import { Events } from '../components/WebSocketClient.js';
import { useLocation } from 'preact-iso';
import { useTranslation } from 'react-i18next';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Item({ children, module, id, state, hasUpdate }) {
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
        const deleteConfirm = confirm(t('moduleManager.confirmDelete', { packageName: module.appName }));
        if (deleteConfirm) {
            state.client.send({
                type: Events.ModuleAction,
                payload: {
                    action: 'remove',
                    module: module.fullName
                }
            });

            state.client.send({
                type: Events.GetModules,
                payload: true
            });

            setFocus('sn:focusable-item-1');
        }
    }

    return (
        <div
            key={id}
            ref={ref}
            onClick={handleOnClick}
            className={classNames(
                'relative bg-gray-900 shadow-2xl rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 h-[35vh] w-[20vw]',
                focused ? 'focus' : '',
                id === 0 ? 'ml-4' : ''
            )}
        >
            {children}
            {hasUpdate && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    {t('store.updateAvailable')}
                </div>
            )}
        </div>
    );
}

function ItemBasic({ children, onClick }) {
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
            onClick={onClick}
            className={classNames(
                'relative bg-gray-900 shadow-2xl rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 h-[35vh] w-[20vw]',
                focused ? 'focus' : '',
            )}
        >
            {children}
        </div>
    );
}
function ActionButton({ children, onClick, className }) {
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
        <button
            ref={ref}
            onClick={onClick}
            className={classNames(
                className,
                focused ? 'focus ring-2 ring-indigo-400' : ''
            )}
        >
            {children}
        </button>
    );
}

export default function ModuleManager() {
    const { state } = useContext(GlobalStateContext);
    const loc = useLocation();
    const { t } = useTranslation();

    var moduleUpdates = (state && state.sharedData && state.sharedData.moduleUpdates) || [];

    function hasModuleUpdate(fullName) {
        return moduleUpdates.some(function(u) { return u.fullName === fullName && u.updateAvailable; });
    }

    function handleUpdateAll() {
        var toUpdate = moduleUpdates.filter(function(u) { return u.updateAvailable; });
        var i = 0;
        function updateNext() {
            if (i >= toUpdate.length) return;
            state.client.updateModule(toUpdate[i].fullName);
            i++;
            setTimeout(updateNext, 2000);
        }
        updateNext();
    }

    function handleRefresh() {
        state.client.send({ type: Events.GetModules, payload: true });
        state.client.checkUpdates();
    }

    return (
        <div className="relative isolate lg:px-8">
            <div className="flex justify-end gap-4 mb-4 mr-4">
                {moduleUpdates.length > 0 && (
                    <ActionButton
                        onClick={handleUpdateAll}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg text-base/7"
                    >
                        {t('store.updateAll')} ({moduleUpdates.length})
                    </ActionButton>
                )}
                <ActionButton
                    onClick={handleRefresh}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg text-base/7"
                >
                    {t('store.refresh')}
                </ActionButton>
            </div>
            <div className="mx-auto flex flex-wrap justify-center gap-4 top-4 relative">
                {state && state.sharedData && state.sharedData.modules && state.sharedData.modules.map((module, moduleIdx) => (
                    <Item key={moduleIdx} module={module} id={moduleIdx} state={state} hasUpdate={hasModuleUpdate(module.fullName)}>
                        <h3
                            className='text-indigo-400 text-base/7 font-semibold'
                        >
                            {module.appName} ({module.version})
                        </h3>
                        <p className='text-gray-300 mt-6 text-base/7'>
                            {module.description}
                        </p>
                    </Item>
                ))}
                <ItemBasic onClick={() => loc.route('/tizenbrew-ui/dist/index.html/module-manager/add?type=npm')}>
                    <h3 className='text-indigo-400 text-base/7 font-semibold'>
                        {t('moduleManager.addNPM')}
                    </h3>
                    <p className='text-gray-300 mt-6 text-base/7'>
                        {t('moduleManager.addNPMDesc')}
                    </p>
                </ItemBasic>
                <ItemBasic onClick={() => loc.route('/tizenbrew-ui/dist/index.html/module-manager/add?type=gh')}>
                    <h3 className='text-indigo-400 text-base/7 font-semibold'>
                        {t('moduleManager.addGH')}
                    </h3>
                    <p className='text-gray-300 mt-6 text-base/7'>
                        {t('moduleManager.addGHDesc')}
                    </p>
                </ItemBasic>

            </div>
        </div>
    )
}

function AddModule() {
    const [name, setName] = useState('');
    const loc = useLocation();
    const { state } = useContext(GlobalStateContext);
    const ref = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        ref.current.focus();
    }, [ref]);
    return (
        <div className="relative isolate lg:px-8">
            <div className="mx-auto flex flex-wrap justify-center gap-4 top-4 relative">
                <ItemBasic onClick={() => ref.current && ref.current.focus()}>
                    <input
                        type="text"
                        ref={ref}
                        value={name}
                        className="w-full p-2 rounded-lg bg-gray-800 text-gray-200"
                        onChange={(e) => setName(e.target.value)}
                        onBlur={(e) => {
                            if (name) {
                                state.client.send({
                                    type: Events.ModuleAction,
                                    payload: {
                                        action: 'add',
                                        module: `${loc.query.type}/${name}`
                                    }
                                });
                                state.client.send({
                                    type: Events.GetModules,
                                    payload: true
                                });
                            }
                            loc.route('/tizenbrew-ui/dist/index.html/module-manager');
                            setFocus('sn:focusable-item-1');
                        }}
                        placeholder={t('moduleManager.moduleName', { type: loc.query.type })}
                    />
                </ItemBasic>
            </div>
        </div>
    )
}

export {
    AddModule
}