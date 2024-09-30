export const tokenFromCookies = (cookies) => {
    const cookieArr = cookies.split(';');
    for (let cookie of cookieArr) {
        let [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === 'token') {
            return cookieValue;
        }
    }
}