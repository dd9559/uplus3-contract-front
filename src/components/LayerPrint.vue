<template>
    <div>
        <div id="printHtml">
            <slot></slot>
        </div>
        <iframe src="" id="printf" frameborder="0"></iframe>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                HKEY_Root: "HKEY_CURRENT_USER",
                HKEY_Path: "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\",
                HKEY_Key: "",
            }
        },
        methods: {
            print() {
                var printhtml = document.getElementById('printHtml').innerHTML;
                var f = document.getElementById('printf');
                // var str = "",
                //     styles1 = document.getElementsByTagName('style');
                // 样式
                // var cssLink = document.createElement("link");    
                // cssLink.href = "style.css";    
                // cssLink.rel = "stylesheet";    
                // cssLink.type = "text/css";    
                // window.frames['printf'].document.body.appendChild(cssLink);
                // console.log(window.frames['printf'])
                // <link rel="stylesheet" href="./static/print.min.css?${new Date().getTime()}">
                // for (var i = 0; i < styles1.length; i++) {
                //     // console.log(styles1[i])
                //     str += styles1[i].outerHTML;
                // }
                // console.log(document.getElementsByTagName('style'))
             
                // var htmlP = `
                //     <html>
                //     <head>
                //         ${str}
                //     </head>
                //     <body>
                //         ${printhtml}
                //     </body>
                //     </html>`
                // <html><head></head></html>
                // console.log(f.contentDocument)
                // f.contentDocument.write(htmlP);

                // css
                this.getStyle(f);
                // html
                f.contentDocument.body.innerHTML = printhtml;
                
                window.frames['printf'].focus();
                f.contentDocument.close();

                // this.PageSetup_Null();
                // if(window.frames['printf'] === null){
                //     console.log(1)
                //     window.frames['printf'].focus();
                //     window.frames['printf'].print();
                // }else{
                //     console.log(2)
                //     f.focus();
                //     f.contentWindow.print();
                // }
                setTimeout(()=>{
                    try {
                        window.frames['printf'].print();
                    } catch (e) {
                        f.contentWindow.print();
                    }
                },100)
                
                // var HKEY_Root, HKEY_Path, HKEY_Key;
                // HKEY_Root = "HKEY_CURRENT_USER";
                // HKEY_Path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
                // function jqprintDiv() {
                //打印初始化
                // var isIE = /msie/.test(navigator.userAgent.toLowerCase()); //jquery1.9之后采用
                // //var isIE = $.browser.msie;//jquery1.9之前采用
                // if (isIE) {
                //     //IE浏览器执行
                //     this.printitIE('PrintArea');
                // } else {
                //     //其他浏览器执行通用打印
                //     $("#PrintArea").jqprint();
                // }
                // }
            },
            // printitIE(MyDiv) {
            //     this.PageSetup_Null();
            //     //提示窗口
            //     // if (confirm('确定打印吗？')) {
            //     var newstr = document.getElementById(MyDiv).innerHTML;
            //     document.body.innerHTML = "<div style='position:absolute;left:20px;top:20px;'>" + newstr + "</div>";
            //     window.print();
            //     return false;
            //     // }
            // },
            PageSetup_Null() {
                try {
                    var Wsh = new ActiveXObject("WScript.Shell");
                    this.HKEY_Key = "header";
                    Wsh.RegWrite(this.HKEY_Root + this.HKEY_Path + this.HKEY_Key, "");
                    this.HKEY_Key = "footer";
                    Wsh.RegWrite(this.HKEY_Root + this.HKEY_Path + this.HKEY_Key, "");
                }
                catch (e) {}
            },
            getStyle(printI) {
                // let printI = document.getElementById("easyPrintIframe");
                var str = "",
                    styles1 = document.querySelectorAll("style");
                for (var i = 0; i < styles1.length; i++) {
                    str += styles1[i].outerHTML;
                }

                printI.contentDocument.head.innerHTML = str;
                // 添加link引入
                let styles = document.querySelectorAll("link");
                for (let i = 0; i < styles.length; i++) {
                    // chrome 正常，firefox不正常，能执行到，但是添加没结果
                    let link = document.createElement("link");
                    link.setAttribute("rel", "stylesheet");
                    if (styles[i].type) link.setAttribute("type", styles[i].type);
                    else link.setAttribute("type", 'text/css');
                    link.setAttribute("href", styles[i].href);
                    link.setAttribute('media', 'all');
                    printI.contentDocument.head.appendChild(link);
                }

            },
        },
    }
</script>

<style>
#printf{
    width: 100px;
    height: 100px;
    position: fixed;
    top: -100px;
    left: -100px;
    z-index: 0;
}
</style>