import * as acorn from "acorn";
import escodegen from "escodegen";
import ASTHelper from "./astHelper.js";

export default class Minifier {
    #nameMap=new Map()
    #alphabet=Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    #generateNameIfNotExisting(name){
        if(this.#nameMap.has(name)){
            return this.#nameMap.get(name)
        }
        if(!this.#alphabet){
            throw new Error("No more names available!!")
        }
        return this.#alphabet.shift()
    }
    #updateMap(oldName,newName,{loc:{start}}){
        if(this.#nameMap.has(oldName)){
            const nameMap=this.#nameMap.get(oldName)
            nameMap.positions.push(start)
            this.#nameMap.set(oldName,nameMap)
            return
        }
        this.#nameMap.set(oldName,{newName,positions:[start]})
    }
    #handleDeclaration(declaration){
        const oldName=declaration.name
        const newName=this.#generateNameIfNotExisting(oldName)
        this.#updateMap(oldName,newName,declaration)
        declaration.name=newName
    }

    #traverse(node) {
        const astHelper = new ASTHelper();
        astHelper
            .setVariableDeclarationHook(node => {
                for (const declaration of node.declarations) {
                    this.#handleDeclaration(declaration.id);
                }
            })
            .setFunctionDeclarationHook(node => {
                this.#handleDeclaration(node.id);
                for (const param of node.params) {
                    this.#handleDeclaration(param);
                }
            })
            .setIdentifierHook(node => {
                const oldName = node.name;
                const name = this.#nameMap.get(oldName)?.newName;
                if (!name) return;

                this.#updateMap(oldName, name, node);
                node.name = name;
            })
            .traverse(node);
    }

  minifyCodeAndReturnMapNames(originalCode) {
    const originalAST = acorn.parse(originalCode, {
      ecmaVersion: 2022,
      locations: true,
    });
    this.#traverse(originalAST)
    console.log(JSON.stringify(originalAST,null,2))
    const minifiedCode = escodegen.generate(originalAST,{format:{compact:true}});
  }
}
