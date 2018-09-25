# fidj-resources

> Resources generator for your fidj app (based on Cordova).

Create a splash screen (2732x2732 png) and an icon (1024x1024 png) once in the resources folder of your Cordova project and use *fidj-resources* to automatically crop and copy it for all the platforms your project supports (currenty works with iOS, Android and Windows 10).

Create one marketing json file to generate all your required marketing stuff in */resources/marketing* directory.

## Installation

```bash
    sudo npm install fidj-resources -g
```

## Requirements

- GraphicsMagick installed (*Mac*: `brew install graphicsmagick`, *Debian/Ubuntu*: `sudo apt-get install graphicsmagick`, *Windows*: [See here](http://www.graphicsmagick.org/INSTALL-windows.html))
- ghostscript installed (*Mac*: `brew install ghostscript`, ...)

## Usage

For your app platform (like android, ios ...), create a `splash.png` and a `icon.png` files in the `/resources` folder of your cordova project and run:

```bash
    fidj-resources --android --ios
```

For your marketing, create a `marketing.json` as

```json
{
  "marketing": [
    {
      "text": "My app is doing this",
      "landscape": "resources/marketing-01-ipad.png",
      "portrait": "resources/marketing-01-iphone.png"
    },
    {
      "text": "and doing that !",
      "landscape": "resources/marketing-02-iphone.png",
      "portrait": "resources/marketing-02-ipad.png"
    }
  ]
}
```

and run

```bash
    fidj-resources --marketing
```

or

```bash
    fidj-resources --android --ios --marketing
```

## License

MIT

*Fork from (and thanks to) [https://github.com/helixhuang/cordova-resources](https://github.com/helixhuang/cordova-resources)*

Please fork it also !
