const IS_DEV = process.env.EAS_BUILD_PROFILE === 'development';
const IS_PREVIEW = process.env.EAS_BUILD_PROFILE === 'preview';

const getAppName = () => {
  if (IS_DEV) return 'DatingQuest DEV';
  if (IS_PREVIEW) return 'DatingQuest Preview';
  return 'Dating Quest';
};

const getAppIdentifier = () => {
  const base = 'com.karakum.datingquest';
  if (IS_DEV) return `${base}.dev`;
  if (IS_PREVIEW) return `${base}.preview`;
  return base;
};

const getAppIcon = () => {
  if (IS_DEV) return './assets/icon-dev.png';
  if (IS_PREVIEW) return './assets/icon-preview.png';
  return './assets/icon.png';
};

const getAdaptiveIcon = () => {
  if (IS_DEV) return './assets/adaptive-icon-dev.png';
  if (IS_PREVIEW) return './assets/adaptive-icon-preview.png';
  return './assets/adaptive-icon.png';
};

export default {
  expo: {
    name: getAppName(),
    slug: 'dating-quest',
    version: '1.0.0',
    orientation: 'portrait',
    icon: getAppIcon(),
    scheme: 'datingquest',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#1a1a2e',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: getAppIdentifier(),
      infoPlist: {
        UIStatusBarStyle: 'UIStatusBarStyleLightContent',
        UIViewControllerBasedStatusBarAppearance: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: getAdaptiveIcon(),
        backgroundColor: '#1a1a2e',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: getAppIdentifier(),
      versionCode: 1,
      config: {
        googleMaps: {
          apiKey: 'AIzaSyDl47GB_Au0WbAZ0Y92xayFXM5tygR76-Y',
        },
      },
      navigationBar: {
        backgroundColor: '#000000',
        barStyle: 'light-content',
      },
      statusBar: {
        backgroundColor: '#000000',
        barStyle: 'light-content',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-dev-client'],
    owner: 'karakum',
    extra: {
      eas: {
        projectId: '6dc6c2c6-97ce-442a-a426-fc146927c752',
      },
    },
  },
};

