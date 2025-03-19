import { IInstitution } from "./institution"

export interface ILocation {
    name: string
    description: string
    id: string
    institutionId: string
    institution: IInstitution
}