import Cookies from 'js-cookie'
import { ICookies } from '../interfaces/shared/cookie'

class CookiesService {
    public get(cookie: keyof ICookies) {
        return Cookies.get(cookie)
    }
    public set(cookie: keyof ICookies, value: string) {
        return Cookies.set(cookie, value)
    }
}

const cookiesService = new CookiesService()

export {
    CookiesService,
    cookiesService
}