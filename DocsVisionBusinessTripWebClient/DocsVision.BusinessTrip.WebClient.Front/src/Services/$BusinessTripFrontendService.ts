import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/web/core/services";

import { IEmployeeChangeRequest } from "../Models/IEmployeeChangeRequest";
import { ICityChangeRequest } from "../Models/ICityChangeRequest";
import { IEmployeeAccountResponse } from "../Models/IEmployeeAccountResponse";
import { IBusinessTripFrontendService } from "./Interfaces/$BusinessTripFrontend";

export type $BusinessTripServiceKey = {businessTripFrontendService: IBusinessTripFrontendService;};

export const $BusinessTripFrontendService =
  serviceName((x:$BusinessTripServiceKey) => x.businessTripFrontendService);

export class BusinessTripFrontendService implements IBusinessTripFrontendService {

    constructor(private services: $RequestManager) { }

    // POST /api/BusinessTripApi/UpdateOnEmployeeChange
    async updateFieldsOnEmployeeChange(request: IEmployeeChangeRequest): Promise<void> {
        console.log("POST UpdateOnEmployeeChange", request);
        await this.services.requestManager.post("/api/BusinessTripApi/UpdateOnEmployeeChange", request);
    }

    // POST /api/BusinessTripApi/UpdateOnCityChange
    async updateFieldsOnCityChange(request: ICityChangeRequest): Promise<void> {
        console.log("POST UpdateOnCityChange", request);
        await this.services.requestManager.post("/api/BusinessTripApi/UpdateOnCityChange", request);
    }

    // GET /api/BusinessTripApi/GetEmployeeAccount/{employeeId}
    async getEmployeeAccountById(employeeId: string): Promise<string | null> {
        console.log("GET GetEmployeeAccount", employeeId);
        try {
            const resp = await this.services.requestManager
                .get<IEmployeeAccountResponse>(`/api/BusinessTripApi/GetEmployeeAccount/${employeeId}`);
                console.log("Response GetEmployeeAccount:", resp);
                return resp.accountName;
        } catch (e) {
            console.error("getEmployeeAccountById error:", e);
            return null;
        }
    }
}