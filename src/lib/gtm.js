import { browser } from '$app/environment';

export function trackPageView(url, title) {
    if (browser) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'page_view',
            page_path: url.pathname,
            page_title: title || document.title,
            page_location: url.href,
            page_search: url.search
        });
    }
}

export function trackEvent(eventName, parameters = {}) {
    if (browser) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: eventName,
            ...parameters
        });
    }
}

export function gtag(...args) {
    if (browser && window.dataLayer) {
        window.dataLayer.push(arguments);
    }
}