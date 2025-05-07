// import axios from 'axios';
// window.axios = axios;

// window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import axios from 'axios';

declare global {
    interface Window {
        axios: typeof axios;
    }
}

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
