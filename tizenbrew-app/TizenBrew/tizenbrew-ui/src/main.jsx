import { render } from 'preact'
import './index.css'
import App from './app.jsx'
import { GlobalStateProvider } from './components/ClientContext.jsx'
import { init, setFocus } from '@noriginmedia/norigin-spatial-navigation';

init({ });

window.shouldDisableAutoLaunch = false;
window.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        var focusedEl = document.querySelector('.focus');
        if (focusedEl) focusedEl.click();
    } else if (e.keyCode === 10009) {
        if (location.pathname !== '/tizenbrew-ui/dist/index.html') {
            history.back();
            setFocus('sn:focusable-item-1');
        } else {
            try { tizen.application.getCurrentApplication().exit(); } catch (e) {}
        }
    } else if (e.keyCode === 38) {
        window.shouldDisableAutoLaunch = true;
    }
});
try {
    if (localStorage.getItem('userAgent') && tizen.websetting) tizen.websetting.setUserAgentString(localStorage.getItem('userAgent'), function() {});
}
catch (e) {}
try {
    tizen.tvinputdevice.registerKey("ColorF0Red");
    tizen.tvinputdevice.registerKey("ColorF1Green");
    tizen.tvinputdevice.registerKey("ColorF2Yellow");
    tizen.tvinputdevice.registerKey("ColorF3Blue");
} catch (e) {}

render(<GlobalStateProvider><App /></GlobalStateProvider>, document.getElementById('app'));