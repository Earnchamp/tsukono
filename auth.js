/* DEMO-ONLY ACCESS GATE. This is client-side protection, not production authentication. */
(function(){
  const DEMO_USER = 'admin';
  const DEMO_PASS = 'GoldPay@2026';
  const LOGIN_KEY = 'goldpay_demo_admin_authenticated';
  const isPagesFolder = /\/pages\//.test(window.location.pathname);
  const loginPath = isPagesFolder ? '../login.html' : 'login.html';
  const onLoginPage = /\/login\.html$/.test(window.location.pathname);

  if (onLoginPage) {
    if (sessionStorage.getItem(LOGIN_KEY) === 'yes') window.location.replace('index.html');
    window.addEventListener('DOMContentLoaded', function(){
      const form = document.getElementById('loginForm');
      if (!form) return;
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const error = document.getElementById('loginError');
        if (username === DEMO_USER && password === DEMO_PASS) {
          sessionStorage.setItem(LOGIN_KEY, 'yes');
          const next = new URLSearchParams(window.location.search).get('next');
          window.location.replace(next && next.startsWith('/') === false && !next.includes('://') ? next : 'index.html');
        } else {
          error.textContent = 'Incorrect username or password. Please try again.';
          document.getElementById('password').value = '';
        }
      });
    });
    return;
  }

  if (sessionStorage.getItem(LOGIN_KEY) !== 'yes') {
    const next = window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(loginPath + '?next=' + encodeURIComponent(next.replace(/^\//, '')));
    return;
  }

  window.addEventListener('DOMContentLoaded', function(){
    const host = document.querySelector('.admin') || document.querySelector('.top') || document.querySelector('header');
    if (!host || document.getElementById('goldpayLogout')) return;
    const btn = document.createElement('button');
    btn.id = 'goldpayLogout';
    btn.type = 'button';
    btn.textContent = 'Log out';
    btn.style.cssText = 'margin-left:12px;padding:8px 13px;border:1px solid #8dbce5;border-radius:3px;background:#087bd1;color:#fff;font-weight:700;cursor:pointer';
    btn.addEventListener('click', function(){
      sessionStorage.removeItem(LOGIN_KEY);
      window.location.replace(loginPath);
    });
    host.appendChild(btn);
  });
})();
