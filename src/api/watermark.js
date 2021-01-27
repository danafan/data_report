'use strict'
let watermark = {}

let setWatermark = (str,str2) => {
  let id = '1.23452384164.123412416';

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }

  let can = document.createElement('canvas')

  let cans = can.getContext('2d')
  cans.rotate(-20 * Math.PI / 180)
  cans.font = '11px Vedana'
  cans.fillStyle = '#bfbfbf'   // 字体颜色
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str, 15, 40)    //第一行字体
  cans.fillText(str2, 15, 65)  //第二行字体

  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '20px'
  div.style.left = '80px'
  div.style.right = '30px'
  div.style.bottom = '20px'
  div.style.opacity=0.3    //调节字体颜色的深浅
  div.style.position = 'absolute'
  div.style.zIndex = '100000'
  div.style.width = document.documentElement.clientWidth + 'px'
  div.style.height = document.documentElement.clientHeight + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  document.body.style.overflow = 'hidden';
  return id;
}

watermark.set = (str,str2) => {
  let id = setWatermark(str, str2)
  if (document.getElementById(id) === null) {
    id = setWatermark(str, str2)
  }
  window.onresize = () => {
    setWatermark(str,str2);
  };
}
export default watermark;