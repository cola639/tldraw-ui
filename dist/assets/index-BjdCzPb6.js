function l(t=window.location.href){const c=decodeURIComponent(t.split("?")[1]).replace(/\+/g," ");if(!c)return{};const n={};return c.split("&").forEach(o=>{const r=o.indexOf("=");if(r!==-1){const s=o.substring(0,r),a=o.substring(r+1,o.length);n[s]=a}}),n}function i(t=[]){Object.keys(localStorage).filter(e=>!t.includes(e)).forEach(e=>{localStorage.removeItem(e)})}export{i as c,l as p};
