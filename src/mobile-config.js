// ==================
// Mobile Preferences
// ==================

App.info( {
  id: 'com.mantarayar.fontmatcher',
  name : 'Font Matcher',
  description: 'Find new font combinations for your web applications!',
  author : 'Ivan Montiel @ Mantaray AR LLC',
  email : 'admin@mantarayar.com',
  website : 'http://fontmatcher.mantarayar.com'
} );

App.setPreference('BackgroundColor', '0x387ef5ff');

App.icons( {
  // iOS
  'iphone':    'public/apple-touch-icon-60x60.png',
  'iphone_2x': 'public/apple-touch-icon-120x120.png',
  'ipad':      'public/apple-touch-icon-72x72.png',
  'ipad_2x':   'public/apple-touch-icon-144x144.png',

  // Android
  'android_ldpi':  'public/android-chrome-36x36.png',
  'android_mdpi':  'public/android-chrome-48x48.png',
  'android_hdpi':  'public/android-chrome-72x72.png',
  'android_xhdpi': 'public/android-chrome-96x96.png'
} );

App.launchScreens({
  // iOS
  'iphone':            '../raw-images/splash-screens/font-matcher-splashscreen-iphone-320x480.png',
  'iphone_2x':         '../raw-images/splash-screens/font-matcher-splashscreen-iphone2x320x480x2.png',
  'iphone5':           '../raw-images/splash-screens/font-matcher-splashscreen-iphone5-320x568.png',
  'ipad_portrait':     '../raw-images/splash-screens/font-matcher-splashscreen-ipadportrait-768x1024.png',
  'ipad_portrait_2x':  '../raw-images/splash-screens/font-matcher-splashscreen-ipadportraitx2-768-1024x2.png',
  'ipad_landscape':    '../raw-images/splash-screens/font-matcher-splashscreen-ipadlandscape-1024x768.png',
  'ipad_landscape_2x': '../raw-images/splash-screens/font-matcher-splashscreen-ipadlandscapex2-1024x768x2.png',

  // Android
  'android_ldpi_portrait':   '../raw-images/splash-screens/font-matcher-splashscreen-ldpi-portrait-200x320.png',
  'android_ldpi_landscape':  '../raw-images/splash-screens/font-matcher-splashscreen-ldpi-landscape-320x200.png',
  'android_mdpi_portrait':   '../raw-images/splash-screens/font-matcher-splashscreen-mdpi-portrait-320x480.png',
  'android_mdpi_landscape':  '../raw-images/splash-screens/font-matcher-splashscreen-mdpi-landscape-480x320.png',
  'android_hdpi_portrait':   '../raw-images/splash-screens/font-matcher-splashscreen-hdpi-portrait-480x800.png',
  'android_hdpi_landscape':  '../raw-images/splash-screens/font-matcher-splashscreen-hdpi-landscape-800x480.png',
  'android_xhdpi_portrait':  '../raw-images/splash-screens/font-matcher-splashscreen-xhdpi-portrait-720x1280.png',
  'android_xhdpi_landscape': '../raw-images/splash-screens/font-matcher-splashscreen-xhdpi-landscape-1280x720.png'
});