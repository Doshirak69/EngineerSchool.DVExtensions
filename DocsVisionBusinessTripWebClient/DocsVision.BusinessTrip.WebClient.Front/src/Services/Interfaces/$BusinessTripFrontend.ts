import { IEmployeeChangeRequest } from "../../Models/IEmployeeChangeRequest";
import { ICityChangeRequest } from "../../Models/ICityChangeRequest";

export interface IBusinessTripFrontendService {
    updateFieldsOnEmployeeChange(request: IEmployeeChangeRequest): Promise<void>;
    updateFieldsOnCityChange(request: ICityChangeRequest): Promise<void>;
    getEmployeeAccountById(employeeId: string): Promise<string | null>;
}
