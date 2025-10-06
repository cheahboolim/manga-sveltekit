<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Props for configuration
  export let idzone = 5743168;
  export let adsHost = 'a.pemsrv.com';
  export let syndicationHost = 's.pemsrv.com';
  export let popupFallback = false;
  export let popupForce = false;
  export let chromeEnabled = true;
  export let newTab = false;
  export let frequencyPeriod = 60;
  export let frequencyCount = 1;
  export let triggerMethod = 3;
  export let triggerClass = '';
  export let triggerDelay = 0;
  export let cappingEnabled = true;
  export let tcfEnabled = true;
  export let onlyInline = false;
  export let cat = '';
  export let tags = '';
  export let el = '';
  export let sub = '';
  export let sub2 = '';
  export let sub3 = '';
  export let customTargeting = {};
  export let cookieConsent = true;
  export let shouldFire = () => true;
  export let onRedirect = null;

  let popMagic = null;

  onMount(() => {
    // Ensure we're in the browser environment
    if (!browser) return;

    const adConfig = {
      ads_host: adsHost,
      syndication_host: syndicationHost,
      idzone: idzone,
      popup_fallback: popupFallback,
      popup_force: popupForce,
      chrome_enabled: chromeEnabled,
      new_tab: newTab,
      frequency_period: frequencyPeriod,
      frequency_count: frequencyCount,
      trigger_method: triggerMethod,
      trigger_class: triggerClass,
      trigger_delay: triggerDelay,
      capping_enabled: cappingEnabled,
      tcf_enabled: tcfEnabled,
      only_inline: onlyInline,
      cat: cat,
      tags: tags,
      el: el,
      sub: sub,
      sub2: sub2,
      sub3: sub3,
      cookieconsent: cookieConsent,
      should_fire: shouldFire,
      on_redirect: onRedirect
    };

    window.customTargeting = customTargeting;

    // Initialize PopMagic
    popMagic = {
      version: 7,
      cookie_name: '',
      url: '',
      config: {},
      open_count: 0,
      top: null,
      browser: null,
      venor_loaded: false,
      venor: false,
      tcfData: null,

      init(config) {
        if (!config.idzone) return;

        // Merge config
        const defaults = {
          ads_host: '',
          syndication_host: '',
          idzone: '',
          frequency_period: 720,
          frequency_count: 1,
          trigger_method: 1,
          trigger_class: '',
          popup_force: false,
          popup_fallback: false,
          chrome_enabled: true,
          new_tab: false,
          cat: '',
          tags: '',
          el: '',
          sub: '',
          sub2: '',
          sub3: '',
          only_inline: false,
          trigger_delay: 0,
          capping_enabled: true,
          tcf_enabled: false,
          cookieconsent: true,
          should_fire: () => true,
          on_redirect: null
        };

        this.config = { ...defaults, ...config };

        if (!this.config.only_inline) {
          this.loadHosted();
        }

        const self = this;
        this.checkTCFConsent(() => {
          if (document.readyState === 'complete') {
            self.preparePopWait();
          } else {
            window.addEventListener('load', () => self.preparePop());
          }
        });
      },

      getCountFromCookie() {
        if (!this.config.cookieconsent) return 0;
        const cookie = this.getCookie(this.cookie_name);
        let count = cookie === undefined ? 0 : parseInt(cookie);
        return isNaN(count) ? 0 : count;
      },

      getLastOpenedTimeFromCookie() {
        const cookie = this.getCookie(this.cookie_name);
        let time = null;
        if (cookie !== undefined) {
          const parts = cookie.split(';')[1];
          time = parts > 0 ? parseInt(parts) : 0;
        }
        return isNaN(time) ? null : time;
      },

      shouldShow(initial = false) {
        if (!this.config.capping_enabled) {
          let should = true;
          const callback = this.config.should_fire;
          try {
            if (!initial && typeof callback === 'function') {
              should = Boolean(callback());
            }
          } catch (e) {
            console.error('Error executing should fire callback:', e);
          }
          return should && this.open_count === 0;
        }

        if (this.open_count >= this.config.frequency_count) return false;

        const count = this.getCountFromCookie();
        const lastTime = this.getLastOpenedTimeFromCookie();
        const now = Math.floor(Date.now() / 1000);
        const nextAllowed = lastTime + this.config.trigger_delay;

        if (lastTime && nextAllowed > now) return false;

        this.open_count = count;
        return !(count >= this.config.frequency_count);
      },

      venorShouldShow() {
        return this.venor_loaded && this.venor === '0';
      },

      setAsOpened(event) {
        const target = event ? (event.target || event.srcElement) : null;
        const detail = {
          id: target?.id || '',
          tagName: target?.tagName || '',
          classes: target?.classList || '',
          text: target?.outerText || '',
          href: target?.href || '',
          elm: target || ''
        };

        const customEvent = new CustomEvent(`creativeDisplayed-${this.config.idzone}`, { detail });
        document.dispatchEvent(customEvent);

        if (this.config.capping_enabled) {
          let count = this.open_count !== 0 ? this.open_count + 1 : this.getCountFromCookie() + 1;
          const time = Math.floor(Date.now() / 1000);
          if (this.config.cookieconsent) {
            this.setCookie(this.cookie_name, `${count};${time}`, this.config.frequency_period);
          }
        } else {
          this.open_count++;
        }
      },

      loadHosted() {
        const script = document.createElement('script');
        script.type = 'application/javascript';
        script.async = true;
        script.src = `//${this.config.ads_host}/popunder1000.js`;
        script.id = 'popmagicldr';

        for (const key in this.config) {
          if (key !== 'ads_host' && key !== 'syndication_host') {
            script.setAttribute(`data-exo-${key}`, this.config[key]);
          }
        }

        const body = document.body;
        if (body.firstChild) {
          body.insertBefore(script, body.firstChild);
        } else {
          body.appendChild(script);
        }
      },

      preparePopWait() {
        setTimeout(() => this.preparePop(), 400);
      },

      preparePop() {
        if (typeof window.exoJsPop101 === 'object' && window.exoJsPop101?.add) return;

        this.top = self;
        if (this.top !== self) {
          try {
            if (top.document.location.toString()) {
              this.top = top;
            }
          } catch (e) {}
        }

        this.cookie_name = `zone-cap-${this.config.idzone}`;

        if (!this.config.capping_enabled) {
          document.cookie = `${this.cookie_name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
        }

        if (this.shouldShow(true)) {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              this.venor_loaded = true;
              this.venor = xhr.status === 200 ? xhr.responseText : '0';
            }
          };

          const protocol = !['https:', 'http:'].includes(document.location.protocol) 
            ? 'https:' 
            : document.location.protocol;

          xhr.open('GET', `${protocol}//${this.config.syndication_host}/venor.php`, true);
          try {
            xhr.send();
          } catch (e) {
            this.venor_loaded = true;
          }
        }

        this.buildUrl();
        this.browser = this.browserDetector.getBrowserInfo();

        if (this.config.chrome_enabled || !this.browser.isChrome) {
          const method = this.getPopMethod(this.browser);
          this.addEvent('click', method);
        }
      },

      getPopMethod(browser) {
        if (this.config.popup_force || (this.config.popup_fallback && browser.isChrome && browser.version >= 68 && !browser.isMobile)) {
          return this.methods.popup.bind(this);
        }
        if (browser.isMobile) return this.methods.default.bind(this);
        if (browser.isChrome) return this.methods.chromeTab.bind(this);
        return this.methods.default.bind(this);
      },

      checkTCFConsent(callback) {
        if (this.config.tcf_enabled && typeof window.__tcfapi === 'function') {
          const self = this;
          window.__tcfapi('addEventListener', 2, (tcData, success) => {
            if (success) {
              self.tcfData = tcData;
              if (tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete') {
                window.__tcfapi('removeEventListener', 2, () => {}, tcData.listenerId);
                callback();
              }
            }
          });
        } else {
          callback();
        }
      },

      buildUrl() {
        const protocol = !['https:', 'http:'].includes(document.location.protocol) 
          ? 'https:' 
          : document.location.protocol;
        const page = top === self ? document.URL : document.referrer;
        const info = { type: 'inline', name: 'popMagic', ver: this.version };
        
        let customParams = '';
        if (window.customTargeting && Object.keys(window.customTargeting).length) {
          Object.keys(window.customTargeting).forEach(key => {
            const value = window.customTargeting[key];
            const param = key.replace('data-exo-', '');
            customParams += `&${param}=${value}`;
          });
        }

        const gdpr = this.tcfData?.gdprApplies === true ? 1 : 0;
        const scrInfo = btoa(`${info.type}|${info.name}|${info.ver}`);

        this.url = `${protocol}//${this.config.syndication_host}/v1/link.php?cat=${this.config.cat}&idzone=${this.config.idzone}&type=8&p=${encodeURIComponent(page)}&sub=${this.config.sub}`;
        
        if (this.config.sub2) this.url += `&sub2=${this.config.sub2}`;
        if (this.config.sub3) this.url += `&sub3=${this.config.sub3}`;
        
        this.url += `&block=1&el=${this.config.el}&tags=${this.config.tags}&scr_info=${encodeURIComponent(scrInfo)}${customParams}&gdpr=${gdpr}&cb=${Math.floor(Math.random() * 1e9)}`;

        if (this.tcfData?.tcString) {
          this.url += `&gdpr_consent=${encodeURIComponent(this.tcfData.tcString)}`;
        } else {
          this.url += `&cookieconsent=${this.config.cookieconsent}`;
        }
      },

      getTriggerClasses() {
        let classes = this.config.trigger_class.indexOf(',') === -1
          ? this.config.trigger_class.split(' ')
          : this.config.trigger_class.replace(/\s/g, '').split(',');
        
        return classes.filter(c => c !== '').map(c => `.${c}`);
      },

      addEvent(eventType, handler) {
        if (this.config.trigger_method === '3') {
          document.addEventListener(eventType, handler, false);
        } else if (this.config.trigger_method === '2' && this.config.trigger_class === '') {
          const links = document.querySelectorAll('a');
          links.forEach(link => link.addEventListener(eventType, handler, false));
        } else if (this.config.trigger_method === '2' && this.config.trigger_class !== '') {
          const classes = this.getTriggerClasses();
          const elements = document.querySelectorAll(classes.join(', '));
          elements.forEach(el => el.addEventListener(eventType, handler, false));
        } else if (this.config.trigger_method === '4' && this.config.trigger_class !== '') {
          const classes = this.getTriggerClasses();
          document.addEventListener(eventType, (e) => {
            const match = classes.some(cls => e.target.closest(cls) !== null);
            if (match) handler.call(e.target, e);
          }, false);
        } else if (this.config.trigger_method === '5' && this.config.trigger_class !== '') {
          const excludeClasses = this.getTriggerClasses();
          const selector = 'a' + excludeClasses.map(c => `:not(${c})`).join('');
          const links = document.querySelectorAll(selector);
          links.forEach(link => link.addEventListener(eventType, handler, false));
        }
      },

      setCookie(name, value, minutes) {
        if (!this.config.cookieconsent) return false;
        const date = new Date();
        date.setMinutes(date.getMinutes() + parseInt(minutes));
        const cookie = `${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
        document.cookie = `${name}=${cookie}`;
      },

      getCookie(name) {
        if (!this.config.cookieconsent) return false;
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          const [key, value] = cookie.split('=');
          if (key.trim() === name) {
            return decodeURIComponent(value);
          }
        }
        return undefined;
      },

      isValidUserEvent(event) {
        if ('isTrusted' in event && !event.isTrusted) {
          if (this.browser.name !== 'ie' && this.browser.name !== 'safari') {
            return false;
          }
        }
        return event.screenX !== 0 || event.screenY !== 0;
      },

      isValidHref(href) {
        if (href === undefined || href === '') return false;
        return !/\s?javascript\s?:/i.test(href);
      },

      findLinkToOpen(element) {
        let current = element;
        let href = false;
        
        try {
          for (let i = 0; i < 20 && !current.getAttribute('href') && current !== document && current.nodeName.toLowerCase() !== 'html'; i++) {
            current = current.parentNode;
          }
          
          const target = current.getAttribute('target');
          if (!target || target.indexOf('_blank') === -1) {
            href = current.getAttribute('href');
          }
        } catch (e) {}

        return this.isValidHref(href) ? href : window.location.href;
      },

      getPuId() {
        return 'ok_' + Math.floor(Math.random() * 89999999 + 10000000);
      },

      executeOnRedirect() {
        try {
          if (!this.config.capping_enabled && typeof this.config.on_redirect === 'function') {
            this.config.on_redirect();
          }
        } catch (e) {
          console.error('Error executing on redirect callback:', e);
        }
      },

      browserDetector: {
        browserDefinitions: [
          ['firefox', /Firefox\/([0-9.]+)(?:\s|$)/],
          ['opera', /Opera\/([0-9.]+)(?:\s|$)/],
          ['opera', /OPR\/([0-9.]+)(:?\s|$)$/],
          ['edge', /Edg(?:e|)\/([0-9._]+)/],
          ['ie', /Trident\/7\.0.*rv:([0-9.]+)\).*Gecko$/],
          ['ie', /MSIE\s([0-9.]+);.*Trident\/[4-7].0/],
          ['ie', /MSIE\s(7\.0)/],
          ['safari', /Version\/([0-9._]+).*Safari/],
          ['chrome', /(?!Chrom.*Edg(?:e|))Chrom(?:e|ium)\/([0-9.]+)(:?\s|$)/],
          ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9.]+)(:?\s|$)/],
          ['bb10', /BB10;\sTouch.*Version\/([0-9.]+)/],
          ['android', /Android\s([0-9.]+)/],
          ['ios', /Version\/([0-9._]+).*Mobile.*Safari.*/],
          ['yandexbrowser', /YaBrowser\/([0-9._]+)/],
          ['crios', /CriOS\/([0-9.]+)(:?\s|$)/]
        ],

        isChromeOrChromium() {
          const nav = window.navigator;
          const ua = (nav.userAgent || '').toLowerCase();
          const vendor = nav.vendor || '';

          if (ua.indexOf('crios') !== -1) return true;

          if (nav.userAgentData?.brands?.length > 0) {
            const brands = nav.userAgentData.brands;
            const hasChrome = brands.some(b => b.brand === 'Google Chrome');
            const hasChromium = brands.some(b => b.brand === 'Chromium') && brands.length === 2;
            return hasChrome || hasChromium;
          }

          const hasChrome = !!window.chrome;
          const isEdge = ua.indexOf('edg') !== -1;
          const isOpera = !!window.opr || ua.indexOf('opr') !== -1;
          const isBrave = !!(nav.brave?.isBrave);
          const isVivaldi = ua.indexOf('vivaldi') !== -1;
          const isYandex = ua.indexOf('yabrowser') !== -1;
          const isSamsung = ua.indexOf('samsungbrowser') !== -1;
          const isUC = ua.indexOf('ucbrowser') !== -1;

          return hasChrome && vendor === 'Google Inc.' && !isEdge && !isOpera && !isBrave && !isVivaldi && !isYandex && !isSamsung && !isUC;
        },

        getBrowserInfo() {
          const ua = window.navigator.userAgent;
          const info = {
            name: 'other',
            version: '1.0',
            versionNumber: 1,
            isChrome: this.isChromeOrChromium(),
            isMobile: !!ua.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WebOS|Windows Phone/i)
          };

          for (const [name, regex] of this.browserDefinitions) {
            if (regex.test(ua)) {
              const match = regex.exec(ua);
              const versionParts = match && match[1].split(/[._]/).slice(0, 3);
              const minorVersion = versionParts?.slice(1).join('') || '0';
              
              if (versionParts && versionParts.length < 3) {
                versionParts.push(...(versionParts.length === 1 ? [0, 0] : [0]));
              }

              info.name = name;
              info.version = versionParts?.join('.') || '1.0';
              info.versionNumber = parseFloat(`${versionParts?.[0]}.${minorVersion}`) || 1;
              break;
            }
          }

          return info;
        }
      },

      methods: {
        default(event) {
          if (!popMagic.shouldShow() || !popMagic.venorShouldShow() || !popMagic.isValidUserEvent(event)) {
            return true;
          }

          const target = event.target || event.srcElement;
          const href = popMagic.findLinkToOpen(target);

          window.open(href, '_blank');
          popMagic.setAsOpened(event);
          popMagic.executeOnRedirect();
          popMagic.top.document.location = popMagic.url;

          if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
          }

          return true;
        },

        chromeTab(event) {
          if (!popMagic.shouldShow() || !popMagic.venorShouldShow() || !popMagic.isValidUserEvent(event)) {
            return true;
          }

          if (event.preventDefault === undefined) return true;

          event.preventDefault();
          event.stopPropagation();

          const link = document.createElement('a');
          const target = event.target || event.srcElement;
          link.href = popMagic.findLinkToOpen(target);
          document.body.appendChild(link);

          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: true,
            altKey: false,
            shiftKey: false,
            metaKey: true,
            button: 0
          });

          clickEvent.preventDefault = undefined;
          link.dispatchEvent(clickEvent);
          link.parentNode.removeChild(link);

          popMagic.executeOnRedirect();
          window.open(popMagic.url, '_self');
          popMagic.setAsOpened(event);
        },

        popup(event) {
          if (!popMagic.shouldShow() || !popMagic.venorShouldShow() || !popMagic.isValidUserEvent(event)) {
            return true;
          }

          let options = '';
          if (popMagic.config.popup_fallback && !popMagic.config.popup_force) {
            const height = Math.max(Math.round(window.innerHeight * 0.8), 300);
            const width = Math.max(Math.round(window.innerWidth * 0.7), 300);
            options = `menubar=1,resizable=1,width=${width},height=${height},top=${window.screenY + 100},left=${window.screenX + 100}`;
          }

          const currentUrl = document.location.href;
          const popup = window.open(currentUrl, popMagic.getPuId(), options);

          popMagic.setAsOpened(event);

          setTimeout(() => {
            popup.location.href = popMagic.url;
            popMagic.executeOnRedirect();
          }, 200);

          if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
    };

    popMagic.init(adConfig);

    return () => {
      // Cleanup when component is destroyed
      const script = document.getElementById('popmagicldr');
      if (script) script.remove();
    };
  });
</script>

<!-- This component has no visual output - it only initializes the ad script -->