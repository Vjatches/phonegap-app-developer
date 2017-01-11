/* global hockeyapp */
import { options, h, render } from 'preact';
import { IntlProvider } from 'react-intl';
import FastClick from 'react-fastclick-alt';

import 'source-sans-pro/source-sans-pro.css';

import 'adobe-mobile-ui/css/root-mobile.css'; // eslint-disable-line import/imports-first
import 'adobe-mobile-ui/css/button-mobile.css'; // eslint-disable-line import/imports-first
import 'adobe-mobile-ui/css/combobox-mobile.css'; // eslint-disable-line import/imports-first
import 'adobe-mobile-ui/css/tab-bar-mobile.css'; // eslint-disable-line import/imports-first
import 'adobe-mobile-ui/css/icon-button-mobile.css'; // eslint-disable-line import/imports-first
import 'adobe-mobile-ui/css/list-mobile.css'; // eslint-disable-line import/imports-first
import 'adobe-mobile-ui/css/navigation-bar-mobile.css'; // eslint-disable-line import/imports-first

import './index.less';

if (!window.Intl) {
  require('intl'); // eslint-disable-line global-require
  require('intl/locale-data/jsonp/en'); // eslint-disable-line global-require
}

// options.debounceRendering = f => f();
options.syncComponentUpdates = true;

let root;
function init() {
  window.navigator && window.navigator.splashscreen && window.navigator.splashscreen.hide();

  // check to see if hockey app is installed and run update command if needed
  if (typeof hockeyapp !== 'undefined') {
    // conditionally set this by platform
    const hockeyID = 'ab4f4cd2ab5045708c0b4ee0b9e2fe39';

    hockeyapp.start(() => {
      hockeyapp.checkForUpdate(() => {
        alert('Update available from HockeyApp');
      }, () => {
        // failed to get update
        alert('Unable to get the update from HockeyApp');
      });
    }, () => {
    }, hockeyID);
  }

  let platform = 'browser';
  if (window.device && window.device.platform) {
    platform = window.device.platform.toLowerCase();
  }
  document.body.className = platform;

  const App = require('./containers/App').default; // eslint-disable-line global-require

  root = render(
    <FastClick><IntlProvider locale="en"><App /></IntlProvider></FastClick>,
    document.getElementById('application'),
    root
  );
}

if (!window.cordova) {
  console.log('Cordova not found, starting anyways');
  init();
} else {
  console.log('Cordova found, starting now');
  document.addEventListener('deviceready', init, false);
}

if (module.hot) {
  require('preact/devtools'); // eslint-disable-line global-require

  module.hot.accept('./containers/App', () => requestAnimationFrame(() => {
    init();
  }));
}
