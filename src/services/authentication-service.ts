export type RedirectType = "authenticate" | "not-required" | "logout"

export class AuthenticationService {
    public static timeoutStarted = false

    public static authenticationPipeline(
        token: string | undefined,
        currentRoute: string,
        expirationDate: Date,
        disableAuth: boolean,
        unprotectedPaths: string[],
        redirect: (event: RedirectType) => boolean | void | null | undefined
    ) {

        const timeDiference2 = new Date(expirationDate).getTime() - new Date().getTime()

        console.log({
            token,
            currentRoute,
            expirationDate,
            disableAuth,
            unprotectedPaths,
            timeDiference2
        })

        if (disableAuth == true) {
            return redirect("authenticate") ?? true
        }

        if (unprotectedPaths.includes(currentRoute)) {
            return redirect("not-required") ?? true
        }

        else if ((expirationDate == null || expirationDate == undefined) && (token == null || token == undefined)) {
            if (unprotectedPaths.includes(currentRoute)) {
                return redirect("not-required") ?? true
            }

            return redirect("logout") ?? false
        }

        const timeDiference = new Date(expirationDate).getTime() - new Date().getTime()

        if (!this.timeoutStarted) {
            this.timeoutStarted = true
            setTimeout(() => {
                return redirect("logout") ?? false
            }, timeDiference);
        }

        return redirect("authenticate") ?? true
    }
}