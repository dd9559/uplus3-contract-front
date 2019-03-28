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
            print(printCallBack) {
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
                // html
                f.contentDocument.body.innerHTML = printhtml;
                // css
                this.getStyle(f,printCallBack);

            },
            // PageSetup_Null() {
            //         var hkey_root, hkey_path, hkey_key;
            //         hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
            //         try {
            //             var RegWsh = new ActiveXObject("WScript.Shell");
            //             RegWsh.RegWrite(hkey_path + "header", "");
            //             RegWsh.RegWrite(hkey_path + "footer", "");
            //         } catch (e) {}
            // },
            getStyle(printI,printCallBack) {
                var str = "",
                    styles1 = document.querySelectorAll("style");
                for (var i = 0; i < styles1.length; i++) {
                    str += styles1[i].outerHTML;
                }
                str +=`<style>header, footer {display: none;}</style>`
                printI.contentDocument.head.innerHTML = str;
                // 添加link引入
                let styles = document.querySelectorAll("link");
                let lastLink = '';
                for (let i = 0; i < styles.length; i++) {
                    // chrome 正常，firefox不正常，能执行到，但是添加没结果
                    let link = document.createElement("link");
                    link.setAttribute("rel", "stylesheet");
                    if (styles[i].type){
                        link.setAttribute("type", styles[i].type)
                    }else{
                        link.setAttribute("type", 'text/css')
                    };
                    // link.setAttribute("href", `${styles[i].href}?time=${new Date().getTime()}`);
                    // link.setAttribute("href", styles[i].href);
                    link.setAttribute("href", styles[i].href);
                    link.setAttribute('media', 'all');
                    printI.contentDocument.head.appendChild(link);
                    if(styles.length-1 === i){
                        lastLink = link;
                    }
                }
                this.loadCss(lastLink,()=>{
                    // window.frames['printf'].focus();
                    // printI.contentDocument.close();
                    // var explorer = window.navigator.userAgent ;
                    try {
                        window.frames['printf'].print();
                    } catch (e) {
                        printI.contentWindow.print();
                    }
                    printCallBack();
                })

            },
            loadCss(node, callback) {
                // for IE6-9 and Opera
                if (node.attachEvent) {
                    node.attachEvent('onload', callback);
                    // NOTICE:
                    // 1. "onload" will be fired in IE6-9 when the file is 404, but in
                    // this situation, Opera does nothing, so fallback to timeout.
                    // 2. "onerror" doesn't fire in any browsers!
                }
                // polling for Firefox, Chrome, Safari
                else {
                    setTimeout(function () {
                        poll(node, callback);
                    }, 0); // for cache
                }

                function poll(node, callback) {
                    if (callback.isCalled) {
                        return;
                    }
                    var isLoaded = false;
                    if (node['sheet']) {
                        isLoaded = true;
                    }
                    
                    if (isLoaded) {
                        // give time to render.
                        setTimeout(callback, 100);
                    } else {
                        setTimeout(function () {
                            poll(node, callback);
                        }, 1);
                    }
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