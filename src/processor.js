import fs from "fs";
import path, { basename } from "path";
import Minifier from "./minifier.js";
import SourceMapper from "./sourcemapper.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export  default class Processor {
    static generateMinifiedCode({ originalCode, minifiedFilePath, minifiedLocalPath }) {
    const minifier = new Minifier();
    const {minifiedCode,nameMap} = minifier.minifyCodeAndReturnMapNames(originalCode);
    const sourceMapURL=`//# sourceMappingURL=${minifiedLocalPath}.map`
    fs.writeFileSync(minifiedFilePath,`${minifiedCode}\n${sourceMapURL}`)
    return {
        minifiedCode,
        nameMap
    }
  }

  static #generateSourceMap({originalCode,minifiedFilePath,minifiedCode,nameMap,minifiedLocalPath}){
    const sourceMapper=new SourceMapper({minifiedLocalPath})
    const sourceMapContent=sourceMapper.generateSourceMap({originalCode,minifiedCode,nameMap})
    const sourceMapFilePath=`${minifiedFilePath}.map`
    fs.writeFileSync(sourceMapFilePath,sourceMapContent)
  }

  static generatedMinifiedFilePath(filename) {
    return filename.replace(".js", ".min.js");
  }

   static run(filename) {
    const originalCode = fs.readFileSync(filename, "utf8");
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
const  minifiedFilePath = this.generatedMinifiedFilePath(filename);
    const minifiedLocalPath = basename(minifiedFilePath);
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
const {minifiedCode,nameMap}=this.generateMinifiedCode({
      originalCode,
      minifiedFilePath,
      minifiedLocalPath,
    });
    this.#generateSourceMap({minifiedCode,minifiedFilePath,minifiedLocalPath,nameMap,originalCode})
    console.log(minifiedLocalPath);
    console.log(
      `Minified code and source map generated with success-${filename}`
    );
  }
};
