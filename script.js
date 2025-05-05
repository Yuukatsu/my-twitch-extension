// ------------------
// script.js
// ------------------

// 本地開發時覆寫 Twitch.ext，確保 stub 生效
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
if (isLocal) {
  window.Twitch = { ext: { onAuthorized: cb => cb({ userId: 'LOCAL_USER', token: 'LOCAL_TOKEN' }) } };
}

// 取得 Twitch.ext 物件
const twitch = window.Twitch.ext;
let userId = '';
let token  = '';

// Extension 授權完成，或本地 stub 觸發
twitch.onAuthorized(auth => {
  userId = auth.userId; // 使用者 Twitch ID
  token  = auth.token;  // JWT
});

// 綁定按鈕事件
document.getElementById('btnA').addEventListener('click', () => sendClick('A'));
document.getElementById('btnB').addEventListener('click', () => sendClick('B'));

/**
 * 發送按鈕點擊請求到後端 API
 * @param {string} buttonType - 按鈕類型：'A' 或 'B'
 */
function sendClick(buttonType) {
  console.log('>>> sending token:', token, ' userId:', userId);
  const apiUrl = 'http://localhost:3000/api/data'; // 後端 API 地址

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // 攜帶 JWT
    },
    body: JSON.stringify({ userId, buttonType })
  })
    .then(response => {
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('後端回傳：', data);
      // 若要在前端顯示，可在此更新畫面
    })
    .catch(error => console.error('請求失敗：', error));
}