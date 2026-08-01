import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import TBLogo from '../assets/tizenbrew.svg';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function InfoCard({ label, value, id }) {
    const { ref, focused } = useFocusable();
    useEffect(() => {
        if (focused) {
            ref.current.scrollIntoView({
                block: 'center',
                inline: 'center',
            });
        }
    }, [focused, ref]);

    return (
        <div
            ref={ref}
            className={classNames(
                'bg-slate-800 rounded-2xl p-6 border border-slate-700',
                focused ? 'focus' : ''
            )}
        >
            <div className="text-gray-400 text-sm font-medium">{label}</div>
            <div className="text-white text-xl font-bold mt-2 truncate">{value}</div>
        </div>
    );
}

function SystemCard({ title, items }) {
    const { ref, focused } = useFocusable();
    useEffect(() => {
        if (focused) {
            ref.current.scrollIntoView({
                block: 'center',
                inline: 'center',
            });
        }
    }, [focused, ref]);

    return (
        <div
            ref={ref}
            className={classNames(
                'bg-slate-800 rounded-2xl p-6 border border-slate-700',
                focused ? 'focus' : ''
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
                <p className="text-gray-400 text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8vh)' }}>
            <div className="mx-auto max-w-5xl px-8 py-8">
                <div className="flex flex-col items-center mb-10">
                    <img src={TBLogo} className="h-[18vh] w-auto" />
                    <h1 className="text-3xl font-bold text-white mt-4">TizenBrew</h1>
                    <p className="text-gray-400 text-base mt-2">Modular Web Experience for Samsung TVs</p>
                    <div className="flex items-center gap-3 mt-4">
                        <span className="px-4 py-1 rounded-full bg-indigo-900 border border-indigo-700 text-indigo-300 text-sm font-medium">
                            v{info.appVersion}
                        </span>
                        <span className="px-4 py-1 rounded-full bg-purple-900 border border-purple-700 text-purple-300 text-sm font-medium">
                            Tizen {info.tizenVersion}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <InfoCard label={t('about.tvModel')} value={info.tvModel} id={0} />
                    <InfoCard label={t('about.tizenVersion')} value={info.tizenVersion} id={1} />
                    <InfoCard label={t('about.appVersion')} value={info.appVersion} id={2} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <SystemCard
                        title={t('about.deviceInfo')}
                        items={[
                            { label: t('about.manufacturer'), value: info.manufacturer },
                            { label: t('about.tvModel'), value: info.tvModel },
                            { label: t('about.firmware'), value: info.firmware },
                            { label: t('about.cpuArch'), value: info.cpuArch },
                            { label: t('about.uiLanguage'), value: info.uiLanguage }
                        ]}
                    />
                    <SystemCard
                        title={t('about.displayInfo')}
                        items={[
                            { label: t('about.screenResolution'), value: info.screenWidth + ' x ' + info.screenHeight },
                            { label: t('about.dpi'), value: info.dpi },
                            { label: t('about.webApiVersion'), value: info.webApiVersion },
                            { label: t('about.networkType'), value: info.networkType },
                            { label: t('about.bluetooth'), value: info.bluetooth }
                        ]}
                    />
                </div>

                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
                    <h3 className="text-indigo-400 text-lg font-bold mb-3">{t('about.aboutTizenBrew')}</h3>
                    <p className="text-gray-300 text-base leading-relaxed">
                        {t('about.aboutDescription')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                            <div className="text-indigo-400 font-bold text-base">{t('about.openSource')}</div>
                            <div className="text-gray-400 text-sm mt-1">Community-driven development</div>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                            <div className="text-indigo-400 font-bold text-base">{t('about.modular')}</div>
                            <div className="text-gray-400 text-sm mt-1">Install only what you need</div>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                            <div className="text-indigo-400 font-bold text-base">{t('about.lightweight')}</div>
                            <div className="text-gray-400 text-sm mt-1">Optimized for TV hardware</div>
                        </div>
                    </div>
                </div>

                <div className="text-center pb-8">
                    <p className="text-gray-500 text-sm">
                        {t('about.madeWithLove')}
                    </p>
                </div>
            </div>
        </div>
    );
}