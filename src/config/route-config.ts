export interface IRouteConfig {
    routerLink: string
    path: string
    titlePage: string
    sidebarTitle: string
    claim: string[] | null
}
export const ROUTE_CONFIG = {
    HOME: {
        routerLink: "/",
        path: "",
        titlePage: "Enviar ticket",
        sidebarTitle: "",
        sidebar: false,
        claim: ["admin", "student"]
    },
    CATEGORY_ANALYSIS: {
        routerLink: "/category-analysis",
        path: "category-analysis",
        titlePage: "Análise de categorias",
        sidebarTitle: "Análise de categorias",
        sidebar: true,
        claim: ["admin"]
    },
    TICKET_LIST: {
        routerLink: "/ticket-list",
        path: "ticket-list",
        titlePage: "Lista de tickets",
        sidebarTitle: "Lista de tickets",
        sidebar: true,
        claim: ["admin"]
    },
    SEND_FEEDBACK: {
        routerLink: "/send-ticket",
        path: "send-ticket",
        titlePage: "Enviar ticket",
        sidebarTitle: "Enviar ticket",
        sidebar: true,
        claim: null
    },
    TICKET_VIEW: {
        routerLink: "/ticket-view",
        path: "ticket-view",
        titlePage: "Visualizar Ticket",
        sidebarTitle: "Visualizar Ticket",
        sidebar: false,
        claim: ["admin"]
    },
    LOGIN: {
        routerLink: "/login",
        path: "login",
        titlePage: "Entrar",
        sidebarTitle: "Login",
        sidebar: false,
        claim: ["admin"]
    },
    SIGNUP: {
        routerLink: "/signup",
        path: "signup",
        titlePage: "Cadastrar",
        sidebarTitle: "Cadastrar",
        sidebar: false,
        claim: ["admin"]
    },
    CATEGORY_LIST: {
        routerLink: "/categorys-list",
        path: "categorys-list",
        titlePage: "Categorias",
        sidebarTitle: "Categorias",
        sidebar: true,
        claim: ["admin"]
    },
    INSTITUTION_LIST: {
        routerLink: "/institutions-list",
        path: "institutions-list",
        titlePage: "Unidades ",
        sidebarTitle: "Unidades ",
        sidebar: true,
        claim: ["admin"]
    },
    AMBIENCE_LIST: {
        routerLink: "/location-list",
        path: "location-list",
        titlePage: "Ambientes",
        sidebarTitle: "Ambientes",
        sidebar: true,
        claim: ["admin"]
    },
    USER_LIST: {
        routerLink: "/user-list",
        path: "user-list",
        titlePage: "Usuários",
        sidebarTitle: "Usuários",
        sidebar: true,
        claim: ["admin"]
    },
} 
