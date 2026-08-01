import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import TBLogo from '../assets/tizenbrew.svg';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function InfoCard({ icon, label, value, id }) {
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
                'bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 transition-all duration-300',
                focused ? 'focus ring-2 ring-indigo-400 scale-105 shadow-2xl shadow-indigo-500/20' : 'hover:border-indigo-500/50'
            )}
        >
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-2xl">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</div>
                    <div className="text-white text-xl font-bold mt-1 truncate">{value}</div>
                </div>
            </div>
        </div>
    );
}

function SystemCard({ title, items }) {
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
                'bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 transition-all duration-300',
                focused ? 'focus ring-2 ring-indigo-400 scale-105 shadow-2xl shadow-indigo-500/20' : ''
            )}
        >
            <h3 className="text-indigo-400 text-lg font-bold mb-4">{title}</h3>
            <div className="space-y-3">
                {items.map(function(item, idx) {
                    return (
                        <div key={idx} className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">{item.label}</span>
                            <span className="text-white text-sm font-semibold">{item.value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getSystemInfo() {
    var info = {};
    try { info.tizenVersion = tizen.systeminfo.getCapability('http://tizen.org/feature/platform.version') || 'Unknown'; } catch (e) { info.tizenVersion = 'Unknown'; }
    try { info.tvModel = tizen.systeminfo.getCapability('http://tizen.org/system/model_name') || 'Unknown'; } catch (e) { info.tvModel = 'Unknown'; }
    try { info.appVersion = tizen.application.getCurrentApplication().appInfo.version || 'Unknown'; } catch (e) { info.appVersion = 'Unknown'; }
    try { info.webApiVersion = tizen.systeminfo.getCapability('http://tizen.org/feature/web.api.version') || 'Unknown'; } catch (e) { info.webApiVersion = 'Unknown'; }
    try { info.cpuArch = tizen.systeminfo.getCapability('http://tizen.org/feature/platform.core.cpu.arch') || 'Unknown'; } catch (e) { info.cpuArch = 'Unknown'; }
    try { info.screenWidth = tizen.systeminfo.getCapability('http://tizen.org/feature/screen.width') || 'Unknown'; } catch (e) { info.screenWidth = 'Unknown'; }
    try { info.screenHeight = tizen.systeminfo.getCapability('http://tizen.org/feature/screen.height') || 'Unknown'; } catch (e) { info.screenHeight = 'Unknown'; }
    try { info.dpi = tizen.systeminfo.getCapability('http://tizen.org/feature.screen.dpi') || 'Unknown'; } catch (e) { info.dpi = 'Unknown'; }
    try { info.manufacturer = tizen.systeminfo.getCapability('http://tizen.org/system/manufacturer') || 'Samsung'; } catch (e) { info.manufacturer = 'Samsung'; }
    try { info.firmware = tizen.systeminfo.getCapability('http://tizen.org/custom/sw_version') || 'Unknown'; } catch (e) { info.firmware = 'Unknown'; }
    try { info.networkType = tizen.systeminfo.getCapability('http://tizen.org/feature/network.wifi') ? 'WiFi' : 'Ethernet'; } catch (e) { info.networkType = 'Unknown'; }
    try { info.bluetooth = tizen.systeminfo.getCapability('http://tizen.org/feature/network.bluetooth') ? 'Yes' : 'No'; } catch (e) { info.bluetooth = 'Unknown'; }
    try { info.uiLanguage = tizen.systeminfo.getCapability('http://tizen.org/feature/platform.locale') || 'Unknown'; } catch (e) { info.uiLanguage = 'Unknown'; }
    return info;
}

export default function About() {
    const { t } = useTranslation();
    const [info, setInfo] = useState(null);

    useEffect(() => {
        setInfo(getSystemInfo());
    }, []);

    if (!info) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="relative isolate overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8vh)' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
            </div>

            <div className="relative mx-auto max-w-5xl px-8 py-8">
                <div className="flex flex-col items-center mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-20 animate-pulse"></div>
                        <img src={TBLogo} className="relative h-[20vh] w-auto drop-shadow-2xl" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mt-6 tracking-tight">TizenBrew</h1>
                    <p className="text-gray-400 text-lg mt-2">Modular Web Experience for Samsung TVs</p>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="px-4 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
                            v{info.appVersion}
                        </span>
                        <span className="px-4 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium">
                            Tizen {info.tizenVersion}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <InfoCard
                        icon="\u{1F4FA}"
                        label={t('about.tvModel')}
                        value={info.tvModel}
                        id={0}
                    />
                    <InfoCard
                        icon="\u{1F5A5}"
                        label={t('about.tizenVersion')}
                        value={info.tizenVersion}
                        id={1}
                    />
                    <InfoCard
                        icon="\u{1F4E6}"
                        label={t('about.appVersion')}
                        value={info.appVersion}
                        id={2}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <SystemCard
                        title="Device Information"
                        items={[
                            { label: 'Manufacturer', value: info.manufacturer },
                            { label: 'Model', value: info.tvModel },
                            { label: 'Firmware', value: info.firmware },
                            { label: 'CPU Architecture', value: info.cpuArch },
                            { label: 'UI Language', value: info.uiLanguage }
                        ]}
                    />
                    <SystemCard
                        title="Display & Graphics"
                        items={[
                            { label: 'Screen Resolution', value: info.screenWidth + ' x ' + info.screenHeight },
                            { label: 'DPI', value: info.dpi },
                            { label: 'Web API Version', value: info.webApiVersion },
                            { label: 'Network Type', value: info.networkType },
                            { label: 'Bluetooth', value: info.bluetooth }
                        ]}
                    />
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 mb-8">
                    <h3 className="text-indigo-400 text-lg font-bold mb-4">About TizenBrew</h3>
                    <p className="text-gray-300 text-base leading-relaxed">
                        TizenBrew is a modular system that lets you experience modded websites and install newer apps
                        on your Samsung TV without dealing with Tizen Studio multiple times. It supports site modification
                        modules, application modules, and background services.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                            <div className="text-2xl mb-2">{"\u{1F310}"}</div>
                            <div className="text-white font-semibold text-sm">Open Source</div>
                            <div className="text-gray-400 text-xs mt-1">Community-driven development</div>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                            <div className="text-2xl mb-2">{"\u{1F9F1}"}</div>
                            <div className="text-white font-semibold text-sm">Modular</div>
                            <div className="text-gray-400 text-xs mt-1">Install only what you need</div>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                            <div className="text-2xl mb-2">{"\u26A1"}</div>
                            <div className="text-white font-semibold text-sm">Lightweight</div>
                            <div className="text-gray-400 text-xs mt-1">Optimized for TV hardware</div>
                        </div>
                    </div>
                </div>

                <div className="text-center pb-8">
                    <p className="text-gray-500 text-sm">
                        Made with {"\u2764"} by the TizenBrew community
                    </p>
                </div>
            </div>
        </div>
    );
}