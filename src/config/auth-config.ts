import Cookies from "js-cookie"

const AUTH = {
  AUTHORIZE_NOT_REQUIRED: [
    "/login",
    "/signup"
  ],
  DISABLE_AUTH: false,
  STARTER_LENGTH_HISTORY: window.history.length,
  DEFAULT_AUTHORIZATION_TOKEN: () => `Bearer ${Cookies.get("accessToken")}`
}

export {
  AUTH
}