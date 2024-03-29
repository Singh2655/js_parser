import * as acorn from "acorn"
import escodegen from "escodegen"

export default class Minifier{
    minifyCodeAndReturnMapNames(originalCode){
        const originalAST=acorn.parse(originalCode,{ecmaVersion:2022,locations:true})
        console.log(JSON.stringify(originalAST,null,2))
    }
}