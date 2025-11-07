import { ExtensionManager } from "@docsvision/webclient/System/ExtensionManager";
import { Service } from "@docsvision/webclient/System/Service";
import * as $RequestManager from "@docsvision/webclient/System/$RequestManager";
import { $BusinessTripFrontendService, BusinessTripFrontendService } from "./Services/$BusinessTripFrontendService";
import { IEmployeeChangeRequest } from "./Models/IEmployeeChangeRequest";
import { ICityChangeRequest } from "./Models/ICityChangeRequest";

export function registerExtension(manager: ExtensionManager) {
      console.log("BusinessTripExtensionFrontend.registerExtension");
      const extensionConfig = {
        name: "BusinessTripExtension",
        version: "1.0.0",

        layoutServices: [
            Service.fromFactory(
                $BusinessTripFrontendService,
                (services: $RequestManager.$RequestManager) => new BusinessTripFrontendService(services)
            )
        ],
        cardOpen({layout, cardInfo }) {
            console.log("BusinessTripExtensionFrontend.cardOpen", cardInfo.id);

            const frontend = layout.getService($BusinessTripFrontendService);

            const travelingEmployeeField = cardInfo.fields.TravelingEmployee;
            const cityField = cardInfo.fields.City;
            const dateFromField = cardInfo.fields.DateFrom;
            const dateToField = cardInfo.fields.DateTo;

            if (travelingEmployeeField) {
                travelingEmployeeField.changed.add(async () => {
                    const employeeId = travelingEmployeeField.value as string | null;
                    console.log("TravelingEmployee.changed:", employeeId);
                    if (!employeeId) return;

                    const account = await frontend.getEmployeeAccountById(employeeId);
                    if (!account) return;

                    const req: IEmployeeChangeRequest = {
                        cardId: cardInfo.id,
                        employeeAccount: account
                    };

                    await frontend.updateFieldsOnEmployeeChange(req);
                    
                    await layout.refresh();
                });
            }else {
                console.warn("Поле TravelingEmployee не найдено в cardInfo.fields");
            }

            const updateCityAndAllowance = async () => {
                const cityName = cityField?.value as string | null;
                const dateFrom = dateFromField?.value as Date | null;
                const dateTo = dateToField?.value as Date | null;
                console.log("City/Date changed:", cityName, dateFrom, dateTo);
                if (cityName && dateFrom && dateTo) {
                    const req: ICityChangeRequest = {
                        cardId: cardInfo.id,
                        cityName: cityName,
                        dateFrom: dateFrom,
                        dateTo: dateTo
                    };
                    await frontend.updateFieldsOnCityChange(req);
                    await layout.refresh();
                }
            };

            cityField?.changed.add(updateCityAndAllowance);
            dateFromField?.changed.add(updateCityAndAllowance);
            dateToField?.changed.add(updateCityAndAllowance);
        }
    };
    manager.registerExtension(extensionConfig);
}

