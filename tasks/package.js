/**
 * Packages the application into executable .app and .exe files.
 * For more info, see https://github.com/electron-userland/electron-packager.
 */
var path = require('path')
var packager = require('electron-packager')
var appManifest = require('../app/package.json')
var devManifest = require('../package.json')

var config = {
    dir: path.join(__dirname, '../build'),
    out: 'releases/',
    name: appManifest.productName,
    'app-version': appManifest.version,
    version: '0.36.7' || devManifest.devDependencies['electron-prebuilt'].replace(/^\D+/, ''),
    platform: 'win32' || 'all',
    arch: 'x64',
    overwrite: true,
    ignore: Object.keys(appManifest.devDependencies).map(function(name) {
        return '/node_modules/' + name + '($|/)'
    })
}

packager(config, function(err, appPath) {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('packaged to ' + appPath)
})
