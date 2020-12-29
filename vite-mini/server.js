const koa = require("koa")
const fs = require("fs-extra")
const path = require("path")
const compilerSFC = require("@vue/compiler-sfc")
const compilerDOM = require("@vue/compiler-dom")

const app = new koa()

/**
 * 改引入名称
 */
function rewriteImport(content) {
    return content.replace(/from ['"]([^'"]+)['"]/g, (s0, s1) => {
        if ( s1[0] !== "." && s1[0] !== "/" ) {
            return `from "/@modules/${s1}"`
        }

        return s0
    })
}

app.use(async (ctx, next) => {

    const {request: {url, query}} = ctx

    if(url == "/") {
        let content = fs.readFileSync("./index.html", "utf-8")
        ctx.body = `
        <script>
            window.process = {
                env: {
                    NOVE_ENV: "aaa"
                }
            }
        </script>
        `+content
        ctx.type = "text/html"

    } else if (url.endsWith(".js")) {

        const p = path.resolve(__dirname, url.slice(1))
        const content = fs.readFileSync(p, "utf-8")
        ctx.type = "application/javascript"
        ctx.body = rewriteImport(content)
            
    } else if (url.indexOf(".vue") !== -1) {

        const p = path.resolve(__dirname, url.split("?")[0].slice(1))
        // 解析成ast
        const { descriptor } = compilerSFC.parse(fs.readFileSync(p, "utf-8"))

        if(!query.type) {
            // 没带类型 编译js
            ctx.type = "application/javascript"
            ctx.body = `
                ${rewriteImport(descriptor.script.content).replace("export default", "const __script =")}
                import {render as _render} from "${url}?type=template"
                __script.render = _render
                export default __script
            `
        } else if (query.type === "template") {

            // 编译template
            const template = descriptor.template
            const render = compilerDOM.compile(template.content, {mode: "module"}).code
            ctx.type = "application/javascript"
            ctx.body = rewriteImport(render)

        }

    } else if (url.startsWith("/@modules/")) {

        // 加载node_modules
        const prefix = path.resolve(__dirname, "..", "node_modules", url.replace("/@modules/", ""))
        const module = require(prefix+"/package.json").module
        const content = fs.readFileSync(path.resolve(prefix, module), "utf-8")
        ctx.type = "application/javascript"
        ctx.body = rewriteImport(content)

    } else {
        ctx.body = "not render"
    }

    await next()
})

app.listen(3000)