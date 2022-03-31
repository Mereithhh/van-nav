#!/bin/bash
const firstUpperCase = ([first, ...rest]) => first?.toUpperCase() + rest.join('')
const fs = require("fs")
const args = process.argv.slice(2);
if (args.length !==2) {
  console.log("参数数量错误");
}
const type = args[0];
const rawName = args[1];
const upper = firstUpperCase(rawName)
const teplate = `
import './index.css'
export interface ${upper}Props  {

}
export const ${upper}: React.FC<${upper}Props> = (props) => {
  return <></>
}
`
console.log(`新增${type==="page" ? "页面": "组件"} ${upper}...`)
try {
  switch(type) {
    case "page":
      fs.mkdirSync(`src/pages/${upper}`);
      fs.writeFileSync(`src/pages/${upper}/index.tsx`,teplate);
      fs.writeFileSync(`src/pages/${upper}/index.css`,"\n");
      break;
    case "c":
      fs.mkdirSync(`src/components/${upper}`);
      fs.writeFileSync(`src/components/${upper}/index.tsx`,teplate);
      fs.writeFileSync(`src/components/${upper}/index.css`,"\n");
      break;
    case "components":
      fs.mkdirSync(`src/components/${upper}`);
      fs.writeFileSync(`src/components/${upper}/index.tsx`,teplate);
      fs.writeFileSync(`src/components/${upper}/index.css`,"\n");
      break;
    case "layout":
      fs.mkdirSync(`src/layout/${upper}`);
      fs.writeFileSync(`src/layout/${upper}/index.tsx`,teplate);
      fs.writeFileSync(`src/layout/${upper}/index.css`,"\n");
      break;
    default:
      console.log("未知参数")
  }
} catch (err) {
  console.log(err.message)
}

