import { MatSnackBar } from "@angular/material/snack-bar";

function useErrors(error: any, _snackBar: MatSnackBar) {

    try {
        const errors = error.error.errors
        const keys = Object.keys(errors);
        const values = keys.map((key) => errors[key]);

        values.flatMap((item: any) => {
            return item.map((error: any) =>
                _snackBar.open(error, "Fechar")
            );

        });
    } catch (error) {
        _snackBar.open("Ocorreu um erro desconhecido.", "Fechar");
    }
}

export {
    useErrors
}