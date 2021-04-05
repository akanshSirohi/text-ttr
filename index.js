const gd = require("node-gd");
const parseColor = require("parse-color");

const createTransparentImage = (w, h) => {
  let image = gd.createTrueColorSync(w, h);
  image.alphaBlending(0);
  image.saveAlpha(1);
  let col_t = image.colorAllocateAlpha(255, 255, 255, 127);
  image.filledRectangle(0, 0, w, h, col_t);
  image.alphaBlending(1);
  return image;
};

const imagettftextAS = (
  image,
  size,
  angle,
  x,
  y,
  color,
  font,
  text,
  spacing = 0
) => {
  if (spacing == 0) {
    image.stringFT(color, font, size, angle, x, y, text, false);
    console.log(x, y);
  } else {
    let temp_x = x;
    let bbox;
    for (i = 0; i < text.length; i++) {
      bbox = image.stringFT(color, font, size, angle, temp_x, y, text[i], true); // Bug, not writting text
      image.stringFT(color, font, size, angle, temp_x, y, text[i], false);
      temp_x += spacing + (bbox[2] - bbox[0]);
    }
  }
  return image;
};

const rotate_transparent_img = (img_resource, angle) => {
  let img = createTransparentImage(img_resource.height, img_resource.width);
  img_resource.copyRotated(
    img,
    0,
    0,
    0,
    0,
    img_resource.height,
    img_resource.width,
    angle
  );
  img.alphaBlending(1);
  img.saveAlpha(1);
  return img;
};

module.exports = (
  options = {
    text1: null,
    text2: null,
    textColor: null,
    bgColor: null,
    type: null,
    file: null,
  }
) => {
  let text1 = "",
    text2 = "",
    textColor = [0, 0, 0, 0],
    bgColor = [255, 255, 255, 0],
    output_file = `TextTTR_${new Date().getTime()}.png`;

  let type = "b64"; // b64 | png

  if (typeof options.text1 === "string") {
    text1 = options.text1;
  }
  if (typeof options.text2 === "string") {
    text2 = options.text2;
  }

  if (
    typeof options.textColor === "string" &&
    options.textColor.startsWith("#")
  ) {
    let c = parseColor(options.textColor).rgb;
    if (c != undefined) {
      textColor = [c[0], c[1], c[2], 0];
    } else {
      return null;
    }
  }

  if (typeof options.bgColor === "string" && options.bgColor.startsWith("#")) {
    let c = parseColor(options.bgColor).rgb;
    if (c != undefined) {
      bgColor = [c[0], c[1], c[2], 0];
    } else {
      return null;
    }
  }

  if (typeof options.type === "string") {
    if (["b64", "png"].includes(options.type)) {
      type = options.type;
    }
  }

  if (typeof options.file === "string") {
    if (!options.file.endsWith(".png")) {
      options.file = options.file + ".png";
    }
    output_file = options.file;
  }

  if (text1.length > 0) {
    let w = 19999;
    let h = 500;
    const lowLim = 35;
    const upLim = 50;
    const font_size = 350;
    let duo = false;
    let image, image2;

    text1 = text1.toUpperCase();

    if (text2.length > 0) {
      duo = true;
      text2 = text2.toUpperCase();
    }

    if (text1.length > upLim) {
      text1 = text1.substring(0, upLim - 1);
    }

    if (duo) {
      if (text2.length > upLim) {
        text2 = text2.substring(0, upLim - 1);
      }
    }

    // Create Base Image
    image = createTransparentImage(w, h);

    // Calculate Text Dimensions And Write On Image
    let tCol = image.colorAllocateAlpha(
      textColor[0],
      textColor[1],
      textColor[2],
      textColor[3]
    );
    let text_box = image.stringFTBBox(
      tCol,
      "./node_modules/text-ttr/assets/abstract_slab.ttf",
      font_size,
      0,
      0,
      0,
      text1
    );
    let text_width = text_box[2] - text_box[0];
    let text_height = text_box[7] - text_box[1];
    let x = w / 2 - text_width / 2;
    let y = h / 2 - text_height / 2;
    image = imagettftextAS(
      image,
      font_size,
      0,
      x,
      y,
      tCol,
      "./node_modules/text-ttr/assets/abstract_slab.ttf",
      text1,
      50
    );

    //Resize Child Image
    let nw = image.width / 11;
    let nh = image.height * 2.5;

    let res_img = createTransparentImage(nw, nh);

    let tt = res_img.colorAllocateAlpha(255, 255, 255, 127);
    res_img.fill(0, 0, tt);

    image.copyResized(res_img, 0, 0, 0, 0, nw, nh, w, h);

    image.destroy();
    image = res_img;

    cropped = image.cropAuto(4);
    if (cropped !== false) {
      image.destroy();
      image = cropped;
    }

    if (duo) {
      w = 19999;
      h = 500;

      image2 = createTransparentImage(w, h);

      // Calculate Text Dimensions And Write On Image
      tCol = image2.colorAllocateAlpha(
        textColor[0],
        textColor[1],
        textColor[2],
        textColor[3]
      );
      text_box = image2.stringFTBBox(
        tCol,
        "./node_modules/text-ttr/assets/abstract_slab.ttf",
        font_size,
        0,
        0,
        0,
        text2
      );
      text_width = text_box[2] - text_box[0];
      text_height = text_box[7] - text_box[1];
      x = w / 2 - text_width / 2;
      y = h / 2 - text_height / 2;
      image2 = imagettftextAS(
        image2,
        font_size,
        0,
        x,
        y,
        tCol,
        "./node_modules/text-ttr/assets/abstract_slab.ttf",
        text2,
        50
      );

      //Resize Child Image
      nw = image2.width / 11;
      nh = image2.height * 2.5;

      res_img = createTransparentImage(nw, nh);

      tt = res_img.colorAllocateAlpha(255, 255, 255, 127);
      res_img.fill(0, 0, tt);

      image2.copyResized(res_img, 0, 0, 0, 0, nw, nh, w, h);

      image2.destroy();
      image2 = res_img;

      image2 = rotate_transparent_img(image2, -90);

      cropped = image2.cropAuto(4);
      if (cropped !== false) {
        image2.destroy();
        image2 = cropped;
      }
    }

    w = 1000;
    h = 1000;
    if (text1.length <= lowLim) {
      w = 1000;
    } else {
      w = 1400;
    }

    if (duo) {
      if (text2.length <= lowLim) {
        h = 1000;
      } else {
        h = 1400;
      }
    }

    let bg_color = image.colorAllocateAlpha(
      bgColor[0],
      bgColor[1],
      bgColor[2],
      bgColor[3]
    );
    let bg_image = createTransparentImage(w, h);
    bg_image.fill(0, 0, bg_color);

    image.copy(
      bg_image,
      bg_image.width / 2 - image.width / 2,
      bg_image.height / 2 - image.height / 2,
      0,
      0,
      image.width,
      image.height
    );
    image.destroy();

    if (duo) {
      image2.copy(
        bg_image,
        bg_image.width / 2 - image2.width / 2,
        bg_image.height / 2 - image2.height / 2,
        0,
        0,
        image2.width,
        image2.height
      );
      image2.destroy();
    }

    let fullImage = createTransparentImage(bg_image.width, bg_image.height);
    bg_image.copy(fullImage, 0, 0, 0, 0, bg_image.width, bg_image.height);
    bg_image.destroy();

    if (type === "b64") {
      let buff = Buffer.from(fullImage.pngPtr(), "binary");
      let b64 = "data:image/png;base64," + buff.toString("base64");
      return b64;
    } else if (type === "png") {
      fullImage.savePng(output_file, 0);
      return output_file;
    } else {
      return null;
    }
  } else {
    return null;
  }
};
