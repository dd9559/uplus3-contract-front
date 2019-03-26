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
        methods: {
            print() {
                var printhtml = document.getElementById('printHtml').innerHTML;
                var f = document.getElementById('printf');
                // printhtml = `
                // <div style='position:relative;z-index:100;'>${printhtml}</div>
                // <div style='position:absolute;z-index:99;left:0;top:0;right:0;bottom:0;background-color:#fff'></div>
                // `
                if (navigator.userAgent.indexOf("Firefox") > 0) {
                    printhtml = `
                            <div>${printhtml}</div>
                            <div></div>
                            `;
                }else{
                    printhtml = `
                            <div style='position:relative;z-index:100;'>${printhtml}</div>
                            <div style='position:absolute;z-index:99;left:0;top:0;right:0;bottom:0;background-color:#fff'></div>
                            `;
                }
                // css
                this.getStyle(f);
                // html
                f.contentDocument.body.innerHTML = printhtml;
                // js
                // let script = document.createElement('script');
                // script.type = 'text/javascript';
                // // script.charset = 'GBK';
                // script.onload = script.onreadystatechange = function() {
                //     if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
                //         // callback();
                //         script.onload = script.onreadystatechange = null;
                //     }
                // };
                // var strHtml = '';
                //     strHtml+='console.log(1);';
                //     strHtml+='var hkey_root, hkey_path, hkey_key;';
                //     strHtml+='hkey_path = "HKEY_CURRENT_USER\\\\Software\\\\Microsoft\\\\Internet Explorer\\\\PageSetup\\\\";';
                //     strHtml+='try {';
                //     strHtml+='    var RegWsh = new ActiveXObject("WScript.Shell");';
                //     strHtml+='    RegWsh.RegWrite(hkey_path + "header", "");';
                //     strHtml+='    RegWsh.RegWrite(hkey_path + "footer", "");';
                //     strHtml+='} catch (e) {};';
                // script.innerHTML = strHtml;
                
                // f.contentDocument.body.appendChild(script)

                window.frames['printf'].focus();
                f.contentDocument.close();
                var explorer = window.navigator.userAgent ;
                // //ie 
                // if (explorer.indexOf("MSIE") >= 0) {
                //     this.PageSetup_Null();
                // }
                setTimeout(()=>{
                    try {
                        window.frames['printf'].print();
                    } catch (e) {
                        f.contentWindow.print();
                    }
                },150)
            },
            PageSetup_Null() {
                    var hkey_root, hkey_path, hkey_key;
                    hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
                    try {
                        var RegWsh = new ActiveXObject("WScript.Shell");
                        RegWsh.RegWrite(hkey_path + "header", "");
                        RegWsh.RegWrite(hkey_path + "footer", "");
                    } catch (e) {}
            },
            getStyle(printI) {
                // let printI = document.getElementById("easyPrintIframe");
                var str = "",
                    styles1 = document.querySelectorAll("style");
                for (var i = 0; i < styles1.length; i++) {
                    str += styles1[i].outerHTML;
                }
                str +=`<style>header, footer {
    display: none;
}</style>`
                printI.contentDocument.head.innerHTML = str;
                // 添加link引入
                let styles = document.querySelectorAll("link");
                for (let i = 0; i < styles.length; i++) {
                    // chrome 正常，firefox不正常，能执行到，但是添加没结果
                    let link = document.createElement("link");
                    link.setAttribute("rel", "stylesheet");
                    if (styles[i].type) link.setAttribute("type", styles[i].type);
                    else link.setAttribute("type", 'text/css');
                    // link.setAttribute("href", `${styles[i].href}?time=${new Date().getTime()}`);
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