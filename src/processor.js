import fs from "fs";
import path, { basename } from "path";
import Minifier from "./minifier.js";

export default class Processor {
    static generateMinifiedCode({ originalCode, minifiedFilePath, minifiedLocalPath }) {
    const minifier = new Minifier();
    const minifiedCode = minifier.minifyCodeAndReturnMapNames(originalCode);
  }
  static generatedMinifiedFilePath(filename) {
    return filename.replace(".js", ".min.js");
  }

   static run(filename) {
    const originalCode = fs.readFileSync(filename, "utf8");
    const minifiedFilePath = this.generatedMinifiedFilePath(filename);
    const minifiedLocalPath = basename(minifiedFilePath);
    this.generateMinifiedCode({
      originalCode,
      minifiedFilePath,
      minifiedLocalPath,
    });
    console.log(minifiedLocalPath);
    console.log(
      `Minified code and source map generated with success-${filename}`
    );
  }
};
