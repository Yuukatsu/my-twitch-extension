// 偵測本地或 GitHub Pages 域名，模擬授權
const isLocal = ['localhost','127.0.0.1'].includes(window.location.hostname)
                 || window.location.hostname.endsWith('github.io');
if (isLocal) {
  window.Twitch = { ext: { onAuthorized: cb => cb({ userId:'LOCAL_USER',token:'LOCAL_TOKEN' }) } };
}

const twitch = window.Twitch.ext;
let userId = '', token = '';
twitch.onAuthorized(auth=>{ userId=auth.userId; token=auth.token; });

document.getElementById('btnA').onclick = ()=>sendClick('A');
document.getElementById('btnB').onclick = ()=>sendClick('B');

function sendClick(buttonType) {
  // 本地測試用 localhost, 正式請替換為公開域名
  const apiUrl = 'http://localhost:3000/api/data';
  console.log('>>> sending',userId,buttonType,token);
  fetch(apiUrl, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
    body: JSON.stringify({ userId, buttonType })
  })
  .then(r=>{ if(!r.ok) throw new Error(`Server ${r.status}`); return r.json(); })
  .then(d=>console.log('後端回傳：',d))
  .catch(e=>console.error('請求失敗：',e));
}