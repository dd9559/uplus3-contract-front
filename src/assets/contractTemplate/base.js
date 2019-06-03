let contractConfig = {
    /**
     * 监听自适应输入框
     * @param callback 弹窗中多行文本框的输入回调
     * 注意弹窗必须是一个div.alert-viwer，子元素有textarea#inputArea、p.control-btn
     */
    inputListener: function (callback,success) {
        let inputAutoBoxs = document.querySelectorAll("*[tag='input-auto']")
        for (let i = 0; i < inputAutoBoxs.length; i++) {
            inputAutoBoxs[i].onclick = function (tip) {
                if (tip.target.getAttribute('systemParam')) {
                    return
                }
                //获取输入框的默认值
                let initVal=tip.target.innerHTML
                //获取文本弹窗
                let inputArea=document.querySelector('.alert-viwer')
                //获取文本框，并赋初值
                let textArea=document.getElementById('inputArea')
                textArea.value=initVal
                inputArea.style.display='block'
                textArea.focus()

                textArea.oninput=function (ev) {
                    tip.target.innerHTML=ev.target.value
                    callback&&callback(ev,tip)//回调要放在赋值之后，防止回调函数的数据操作无效了
                    tip.target.classList.remove('input-before')
                    if(ev.target.value.length===0){
                        tip.target.classList.add('input-before')
                    }
                }
                document.onclick=function (e) {
                    // console.log('test',e.target,inputArea.children)
                    let parentBox=Array.from(inputArea.children)
                    parentBox.push(inputArea)
                    let hiddenModal=parentBox.includes(e.target)||parentBox.includes(e.target.parentNode)
                    if(!hiddenModal&&e.target!==tip.target){
                        inputArea.style.display='none'
                        textArea.value=''
                    }
                }
                document.querySelector('.control-btn').onclick=function (e) {
                    let btn=e.target.innerHTML
                    if(btn==='取消'){
                        if(initVal.length>0){
                            tip.target.innerHTML=initVal
                            tip.target.classList.remove('input-before')
                        }else {
                            tip.target.innerHTML=''
                            tip.target.classList.add('input-before')
                        }
                        success&&success(tip)
                    }
                    if(e.target!==e.currentTarget){
                        inputArea.style.display='none'
                        textArea.value=''
                    }
                }
            }
        }
    },
    /**
     * 监听勾选框
     * @param success 当前勾选框选中的回调，此时状态还未改变，即勾线之前的操作
     * @param callback 勾选之后的操作
     */
    checkboxListener: function (success,callback) {
        let checkboxs = document.querySelectorAll(".info-checkbox")
        for (let i = 0; i < checkboxs.length; i++) {
            checkboxs[i].addEventListener('click', function (obj) {
                    let able = obj.currentTarget.getAttribute('readonly') //当前勾选框是否readonly
                    if (!able) {
                        let boxArray = document.getElementsByName(obj.currentTarget.getAttribute('name'));
                        for (let i = 0; i < boxArray.length; i++) {
                            let checkboxTip = boxArray[i].querySelector('p')
                            if(boxArray[i] === obj.currentTarget){
                                success&&success(obj,i)
                                if(checkboxTip.getAttribute('checked') === 'true'){
                                    checkboxTip.removeAttribute('checked')
                                }else{
                                    checkboxTip.setAttribute('checked', true)
                                }
                            }else {
                                !obj.currentTarget.getAttribute('more')&&checkboxTip.removeAttribute('checked')
                            }
                        }
                        callback&&callback(obj,boxArray)
                    }
                }
            )
        }
    }
}
export {
    contractConfig
}