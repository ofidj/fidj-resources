var fs = require('fs-extra');
var path = require('path');
var gm = require('gm');
var colors = require('colors');
var _ = require('underscore');
var Promise = require('promise');

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  {name: 'android', type: Boolean},
  {name: 'ios', type: Boolean},
  {name: 'windows', type: Boolean},
  {name: 'marketing', type: Boolean}
];

const options = commandLineArgs(optionDefinitions);

var isEmpty = function (object) {
  return JSON.stringify(object) === '{}';
};

function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t)
  });
}

Promise.prototype.delay = function (t) {
  return this.then(function (v) {
    return delay(t, v);
  });
}

/**
 * @var {Object} settings - names of the config file and of the icon image
 * TODO: add option to get these values as CLI params
 */
var settings = {};
settings.ICON_FILE = 'resources/icon.png';
settings.SPLASH_FILE = 'resources/splash.png';

/**
 * Check which platforms are added to the project and return their icon names and sizes
 *
 * @param  {String} projectName
 * @return {Promise} resolves with an array of platforms
 */
var getPlatforms = function () {
  var platforms = [];
  platforms.push({
    name: 'ios',
    // TODO: use async fs.exists
    isAdded: !!options.ios,// fs.existsSync('platforms/ios'),
    iconsPath: 'resources/ios/icon/',
    icons: [
      {name: 'icon-40.png', size: 40},
      {name: 'icon-40@2x.png', size: 80},
      {name: 'icon-40@3x.png', size: 120},
      {name: 'icon-50.png', size: 50},
      {name: 'icon-50@2x.png', size: 100},
      {name: 'icon-50@3x.png', size: 120},
      {name: 'icon-60.png', size: 60},
      {name: 'icon-60@2x.png', size: 120},
      {name: 'icon-60@3x.png', size: 180},
      {name: 'icon-72.png', size: 72},
      {name: 'icon-72@2x.png', size: 144},
      {name: 'icon-76.png', size: 76},
      {name: 'icon-76@2x.png', size: 152},
      {name: 'icon-small.png', size: 29},
      {name: 'icon-small@2x.png', size: 58},
      {name: 'icon-small@3x.png', size: 87},
      {name: 'icon.png', size: 57},
      {name: 'icon@2x.png', size: 114},
      {name: 'icon-83.5@2x.png', size: 167},
      {name: 'icon-1024.png', size: 1024, flatten: true}
    ],
    splashPath: 'resources/ios/splash/',
    splashes: [
      // iPhone
      {name: 'Default~iphone.png', width: 320, height: 480},
      {name: 'Default@2x~iphone.png', width: 640, height: 960},
      {name: 'Default-568h@2x~iphone.png', width: 640, height: 1136},
      {name: 'Default-667h.png', width: 750, height: 1334},
      {name: 'Default-736h.png', width: 1242, height: 2208},
      {name: 'Default-Landscape-736h.png', width: 2208, height: 1242},
      // iPad
      {name: 'Default-Portrait~ipad.png', width: 768, height: 1024},
      {name: 'Default-Portrait@2x~ipad.png', width: 1536, height: 2048},
      {name: 'Default-Portrait@~ipadpro.png', width: 2048, height: 2732},
      {name: 'Default-Landscape~ipad.png', width: 1024, height: 768},
      {name: 'Default-Landscape@2x~ipad.png', width: 2048, height: 1536},
      {name: 'Default-Landscape@~ipadpro.png', width: 2732, height: 2048},
      {name: 'Default@2x~universal~anyany.png', width: 2732, height: 2732}
    ]
  });
  platforms.push({
    name: 'android',
    isAdded: !!options.android,//fs.existsSync('platforms/android'),
    iconsPath: 'resources/android/icon/',
    icons: [
      {name: 'drawable-icon.png', size: 96},
      {name: 'drawable-hdpi-icon.png', size: 72},
      {name: 'drawable-ldpi-icon.png', size: 36},
      {name: 'drawable-mdpi-icon.png', size: 48},
      {name: 'drawable-xhdpi-icon.png', size: 96},
      {name: 'drawable-xxhdpi-icon.png', size: 144},
      {name: 'drawable-xxxhdpi-icon.png', size: 192}
    ],
    splashPath: 'resources/android/splash/',
    splashes: [
      // Landscape
      {name: 'drawable-land-ldpi-screen.png', width: 320, height: 200},
      {name: 'drawable-land-mdpi-screen.png', width: 480, height: 320},
      {name: 'drawable-land-hdpi-screen.png', width: 800, height: 480},
      {name: 'drawable-land-xhdpi-screen.png', width: 1280, height: 720},
      {name: 'drawable-land-xxhdpi-screen.png', width: 1600, height: 960},
      {name: 'drawable-land-xxxhdpi-screen.png', width: 1920, height: 1280},
      // Portrait
      {name: 'drawable-port-ldpi-screen.png', width: 200, height: 320},
      {name: 'drawable-port-mdpi-screen.png', width: 320, height: 480},
      {name: 'drawable-port-hdpi-screen.png', width: 480, height: 800},
      {name: 'drawable-port-xhdpi-screen.png', width: 720, height: 1280},
      {name: 'drawable-port-xxhdpi-screen.png', width: 960, height: 1600},
      {name: 'drawable-port-xxxhdpi-screen.png', width: 1280, height: 1920}
    ]
  });

  platforms.push({
    name: 'windows',
    isAdded: !!options.windows,//fs.existsSync('platforms/windows'),
    iconsPath: 'resources/windows/icon/',
    icons: [
      {name: 'StoreLogo.scale-100.png', size: 50},
      {name: 'StoreLogo.scale-125.png', size: 63},
      {name: 'StoreLogo.scale-150.png', size: 75},
      {name: 'StoreLogo.scale-200.png', size: 100},
      {name: 'StoreLogo.scale-400.png', size: 200},

      {name: 'Square44x44Logo.scale-100.png', size: 44},
      {name: 'Square44x44Logo.scale-125.png', size: 55},
      {name: 'Square44x44Logo.scale-150.png', size: 66},
      {name: 'Square44x44Logo.scale-200.png', size: 88},
      {name: 'Square44x44Logo.scale-400.png', size: 176},

      {name: 'Square71x71Logo.scale-100.png', size: 71},
      {name: 'Square71x71Logo.scale-125.png', size: 89},
      {name: 'Square71x71Logo.scale-150.png', size: 107},
      {name: 'Square71x71Logo.scale-200.png', size: 142},
      {name: 'Square71x71Logo.scale-400.png', size: 284},

      {name: 'Square150x150Logo.scale-100.png', size: 150},
      {name: 'Square150x150Logo.scale-125.png', size: 188},
      {name: 'Square150x150Logo.scale-150.png', size: 225},
      {name: 'Square150x150Logo.scale-200.png', size: 300},
      {name: 'Square150x150Logo.scale-400.png', size: 600},

      {name: 'Square310x310Logo.scale-100.png', size: 310},
      {name: 'Square310x310Logo.scale-125.png', size: 388},
      {name: 'Square310x310Logo.scale-150.png', size: 465},
      {name: 'Square310x310Logo.scale-200.png', size: 620},
      {name: 'Square310x310Logo.scale-400.png', size: 1240},

      {name: 'Wide310x150Logo.scale-100.png', size: 310, height: 150},
      {name: 'Wide310x150Logo.scale-125.png', size: 388, height: 188},
      {name: 'Wide310x150Logo.scale-150.png', size: 465, height: 225},
      {name: 'Wide310x150Logo.scale-200.png', size: 620, height: 300},
      {name: 'Wide310x150Logo.scale-400.png', size: 1240, height: 600}
    ],
    splashPath: 'resources/windows/splash/',
    splashes: [
      {name: 'SplashScreen.scale-100.png', width: 620, height: 300},
      {name: 'SplashScreen.scale-125.png', width: 775, height: 375},
      {name: 'SplashScreen.scale-150.png', width: 930, height: 450},
      {name: 'SplashScreen.scale-200.png', width: 1240, height: 600},
      {name: 'SplashScreen.scale-400.png', width: 2480, height: 1200}
    ]
  });
  // TODO: add missing platforms
  return Promise.resolve(platforms);
};

/**
 * @var {Object} console utils
 */
var display = {};
display.success = function (str) {
  str = '✓  '.green + str;
  console.log('  ' + str);
};
display.error = function (str) {
  str = '✗  '.red + str;
  console.log('  ' + str);
};
display.header = function (str) {
  console.log('');
  console.log(' ' + str.cyan.underline);
  console.log('');
};

/**
 * Resizes, crops (if needed) and creates a new icon in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} icon
 * @return {Promise}
 */
var generateIcon = function (platform, icon) {
  var srcPath = settings.ICON_FILE;
  var platformPath = srcPath.replace(/\.png$/, '-' + platform.name + '.png');
  if (fs.existsSync(platformPath)) {
    srcPath = platformPath;
  }
  var dstPath = platform.iconsPath + icon.name;
  var dst = path.dirname(dstPath);
  if (!fs.existsSync(dst)) {
    try {
      fs.mkdirsSync(dst);
    } catch (e) {
    }
  }

  var result = gm(srcPath).resize(icon.size, icon.size);

  if (icon.height) {
    result = gm(srcPath).crop(icon.size, icon.height);
  }

  if (icon.flatten) {
    result = result.flatten();
  }

  return new Promise(function (resolve, reject) {
    result.write(dstPath, function (err) {
      if (err) {
        display.error(icon.name + ' error: ' + err);
        reject(err);
      } else {
        display.success(icon.name + ' created');
        resolve();
      }
    });
  });
};

/**
 * Crops and creates a new splash in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} splash
 * @return {Promise}
 */
var generateSplash = function (platform, splash) {

  var srcPath = settings.SPLASH_FILE;
  var platformPath = srcPath.replace(/\.png$/, '-' + platform.name + '.png');
  if (fs.existsSync(platformPath)) {
    srcPath = platformPath;
  }
  var dstPath = platform.splashPath + splash.name;
  var dst = path.dirname(dstPath);
  if (!fs.existsSync(dst)) {
    fs.mkdirsSync(dst);
  }
  var x = (Math.max(splash.width, splash.height) - splash.width) / 2;
  var y = (Math.max(splash.width, splash.height) - splash.height) / 2;


  return new Promise(function (resolve, reject) {
    gm(srcPath)
      .resize(Math.max(splash.width, splash.height))
      .crop(splash.width, splash.height, x, y)
      .write(dstPath, function (err) {
        if (err) {
          reject(err);
        } else {
          display.success(splash.name + ' created');
          resolve();
        }
      });
  });
};

/**
 * Generates icons based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateIconsForPlatform = function (platform) {
  display.header('Generating Icons for ' + platform.name);
  var all = [];
  var icons = platform.icons;
  icons.forEach(function (icon) {
    all.push(generateIcon(platform, icon));
  });
  return Promise.all(all);
};

/**
 * Generates splash based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateSplashForPlatform = function (platform) {
  display.header('Generating splash screen for ' + platform.name);
  var all = [];
  var splashes = platform.splashes;
  splashes.forEach(function (splash) {
    all.push(generateSplash(platform, splash));
  });
  return Promise.all(all);
};


var generateMarketingGlobal = function () {

  var iconSrc = 'resources/icon.png';
  var icon512Dst = 'resources/marketing/icon_521x512.png';
  var icon1024Dst = 'resources/marketing/icon_1024x1024.png';
  var dst = path.dirname(icon512Dst);
  if (!fs.existsSync(icon512Dst)) {
    try {
      fs.mkdirsSync(dst);
    } catch (e) {
    }
  }

  var allDone = [];
  allDone.push(new Promise(function (resolve, reject) {
    gm(iconSrc)
      .resize(512, 512)
      .crop(512, 512)
      .write(icon512Dst, function (err) {
        if (err) {
          display.error(icon512Dst + ' error: ' + err);
          reject(err);
        } else {
          display.success(icon512Dst + ' created');
          resolve();
        }
      });
  }));
  allDone.push(new Promise(function (resolve, reject) {
    gm(iconSrc)
      .resize(1024, 1024)
      .crop(1024, 1024)
      .write(icon1024Dst, function (err) {
        if (err) {
          display.error(icon1024Dst + ' error: ' + err);
          reject(err);
        } else {
          display.success(icon1024Dst + ' created');
          resolve();
        }
      });
  }));

  return Promise.all(allDone);
};

var generateMarketingImage = function (index, marketing) {

  var srcPath1 = marketing.landscape;
  var srcPath2 = marketing.portrait;
  var dstTempPath = 'resources/marketing/.' + index + '.png';
  var dst2732Path = 'resources/marketing/2732x2048.' + index + '.jpg';
  var dst2208Path = 'resources/marketing/2208x1242.' + index + '.jpg';
  var dst1024Path = 'resources/marketing/1024x500.' + index + '.jpg';
  var dst = path.dirname(dstTempPath);
  if (!fs.existsSync(dst)) {
    try {
      fs.mkdirsSync(dst);
    } catch (e) {
    }
  }

  new Promise(function (resolve, reject) {

    gm(srcPath1)
      .type('TrueColorMatte')
      .borderColor('transparent')
      .resize(null, 700)
      .crop(1200, 700)
      .append(srcPath2, true)
      .border(20, 200)
      .write(dstTempPath, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  })
    .delay(1000)
    .then(function () {

      return new Promise(function (resolve, reject) {
        gm(dstTempPath)
          .background('#ffffff')
          .resize(null, 2048)
          .crop(2732, 2048)
          .resize(2732, null)
          .crop(2732, 2048)
          .region(2532, 200, 100, 100)
          .gravity('Center')
          .fill('#f48f52')
          .fontSize(144)
          .font('arial')
          .drawText(0, 0, marketing.text)
          .flatten()
          .write(dst2732Path, function (err) {
            if (err) {
              reject(err);
            } else {
              return resolve();
            }
          });
      });
    })
    .delay(1000)
    .then(function () {

      return new Promise(function (resolve, reject) {
        gm(dst2732Path)
          .background('#ffffff')
          //.resize(2208, 1242)
          .resize(null, 1242)
          .crop(2208, 1242)
          .resize(2208, null)
          .crop(2208, 1242)
          .flatten()
          .write(dst2208Path, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });

      });
    })
    .then(function () {

      return new Promise(function (resolve, reject) {
        gm(dst2732Path)
          .background('#ffffff')
          //.resize(1024, 500)
          .resize(null, 500)
          .crop(1024, 500)
          .resize(1024, null)
          .crop(1024, 500)
          .flatten()
          .write(dst1024Path, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });

      });
    })
    .then(function () {
      display.success(dstTempPath + ' created');
      return Promise.resolve();
    })
    .catch(function (err) {
      display.error(dstTempPath + 'error: ' + err);
      return Promise.reject(err);
    });

};

var generateMarketing = function () {
  display.header('Generating Marketing');
  var marketingPath = process.cwd() +'/resources/marketing.json';

  if (!fs.existsSync(marketingPath)) {
    return Promise.reject('no ' + marketingPath);
  }
  var marketing = require(marketingPath);
  var all = [];
  var length = marketing.marketing.length;
  for (var i = 0; i < length; i++) {
    all.push(generateMarketingImage(i, marketing.marketing[i]));
  }

  all.push(generateMarketingGlobal());

  return Promise.all(all);
};

/**
 * Goes over all the platforms and triggers icon generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateIcons = function (platforms) {
  var sequence = Promise();
  var all = [];
  _(platforms).where({isAdded: true}).forEach(function (platform) {
    sequence = sequence.then(function () {
      return generateIconsForPlatform(platform);
    });
    all.push(sequence);
  });
  return Promise.all(all);
};

/**
 * Goes over all the platforms and triggers splash screen generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateSplashes = function (platforms) {
  var sequence = Promise();
  var all = [];
  _(platforms).where({isAdded: true}).forEach(function (platform) {
    sequence = sequence.then(function () {
      return generateSplashForPlatform(platform);
    });
    all.push(sequence);
  });
  return Promise.all(all);
};

/**
 * Goes over all the platforms and triggers splash screen generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateResources = function (platforms) {
  var all = [];
  _(platforms)
    .where({isAdded: true})
    .forEach(function (platform) {
      all.push(generateIconsForPlatform(platform).then(function () {
        return generateSplashForPlatform(platform);
      }));
    });

  return Promise.all(all);
};

var generateResourcesMarketing = function () {
  if (isEmpty(options) || options.marketing) {
    return generateMarketing();
  }
  return Promise.resolve();
}

/**
 * Checks if at least one platform was added to the project
 *
 * @return {Promise} resolves if at least one platform was found, rejects otherwise
 */
var atLeastOnePlatformFound = function () {
  return getPlatforms().then(function (platforms) {
    var activePlatforms = _(platforms).where({isAdded: true});
    if (activePlatforms.length > 0) {
      display.success('platforms found: ' + _(activePlatforms).pluck('name').join(', '));
      return Promise.resolve();
    } else {
      display.error('No cordova platforms found.' +
        'Make sure you are in the root folder of your Cordova project' +
        'and add platforms with \'cordova platform add\'');
      return Promise.reject();
    }
  });
};

/**
 * Checks if a valid icon file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validIconExists = function () {

  return new Promise(function (resolve, reject) {
    fs.exists(settings.ICON_FILE, function (exists) {
      if (exists) {
        display.success(settings.ICON_FILE + ' exists');
        resolve();
      } else {
        display.error(settings.ICON_FILE + ' does not exist in the root folder');
        reject();
      }
    });
  });
};

/**
 * Checks if a valid splash file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validSplashExists = function () {


  return new Promise(function (resolve, reject) {
    fs.exists(settings.SPLASH_FILE, function (exists) {
      if (exists) {
        display.success(settings.SPLASH_FILE + ' exists');
        resolve();
      } else {
        display.error(settings.SPLASH_FILE + ' does not exist in the root folder');
        reject();
      }
    });
  });

};

display.header('Checking Project & Icon');

validIconExists()
  .then(function () {
    return validSplashExists();
  })
  .then(function () {
    return getPlatforms();
  })
  .then(function (platforms) {
    return generateResources(platforms);
  })
  .then(function () {
    return generateResourcesMarketing();
  })
  .then(function () {
    // console.log('finished.');
  })
  .catch(function (err) {
    console.log('error :', err);
  });

