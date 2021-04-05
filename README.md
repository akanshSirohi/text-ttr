# TextTTR

> NodeJS library that creates illusion image that can only be read when you tilt your screen

## Installation

### Note

- It uses [node-gd](https://github.com/y-a-v-a/node-gd), and `node-gd` require `libgd` that currently doesn't supports `windows` systems.

### On Debian/Ubuntu

```shell
$ sudo apt-get install libgd-dev
$ npm i text-ttr
```

### On RHEL/CentOS

```shell
$ sudo yum install gd-devel
$ npm i text-ttr
```

### On Mac OS/X

Using Homebrew

```shell
$ brew install pkg-config gd
$ npm i text-ttr
```

### On Mac OS/X

...or using MacPorts

```shell
$ sudo port install pkgconfig gd2
$ npm i text-ttr
```

### Windows

- I am not sure, but if there is some method to install `libgd` on windows then it would work fine on windows too.

## Usage

Simple usage

```js
const textTTR = require("text-ttr");
let img = textTTR({ text1: "TextTTR"})); // returns base64 image
console.log(img); // data:image/png;base64,iVBORw0KGgoAAAANSUhEU...
```

Advanced Usage

```js
const textTTR = require("text-ttr");
let img = textTTR({
  text1: "TextTTR",
  text2: "Illusion",
  type: "png",
  bgColor: "#000",
  textColor: "#f00",
}); // return randomly generated image name
console.log(img); // file_name.png
```

<b>OR</b>

```js
const textTTR = require("text-ttr");
let img = textTTR({
  text1: "TextTTR",
  text2: "Illusion",
  type: "png",
  bgColor: "#000",
  textColor: "#f00",
  file: "my_illusion_image.png",
}); // return filename i.e. my_illusion_image.png
console.log(img); // my_illusion_image.png
```

### API

```
textTTR(options);
```

<b>Options</b>

`text1` (Required) : Primary text written on image. <br/>
`text2` (Optional) : Secondary text written on image. <br/>
`type` (Optional) : Type of image output. It can contain two values i.e. "b64" or "png". (Default: "b64") <br/>
`bgColor` (Optional) : Background color of image. Hex color string can be passed. (Default: "#ffffff") <br/>
`textColor` (Optional) : Text color written on image. Hex color string can be passed. (Default: "#000000") <br/>
`file` (Optional) : Specify the output image full path when `type:"png"` is passed. (Example, `file: "path/to/any/folder/illusion.png"`). If you do not pass this when `type:"png"` then the ouput image automatically created with some random name in current folder.

## Misc

Any contribution on this library will be appreciated. If you have any feature idea related to this library or you are facing any issue, then just create `issue` on github and I will try to fix it soon.
