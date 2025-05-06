import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class UtilsService {
    private _snack = inject(MatSnackBar);

    snack(message: string, type: "error" | "success") {
        if (type == 'error') {
            this._snack.open(message, 'Close', {
                panelClass: 'app-notification-error',
                duration: 2000
            }
            )
        }
        if (type == 'success') {
            this._snack.open(message, 'Close', {
                panelClass: 'app-notification-success',
                duration: 2000
            }
            )
        }
    }

    downloadBlob(blob: Blob, fileName: string) {
        console.log(blob)
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(blobUrl);
    }
}