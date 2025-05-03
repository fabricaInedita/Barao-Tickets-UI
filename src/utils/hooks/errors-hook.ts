import { MatSnackBar } from "@angular/material/snack-bar";
import { UtilsService } from "../../services/utils-service";

function useErrors(error: any, UtilsService: UtilsService) {

    try {
        const errors = error.error.errors
        const keys = Object.keys(errors);
        const values = keys.map((key) => errors[key]);

        values.flatMap((item: any) => {
            return item.map((error: any) =>
                UtilsService.snack(error, "error")
            );

        });
    } catch (error) {
        UtilsService.snack("Ocorreu um erro desconhecido.", "error");
    }
}

export {
    useErrors
}