import { ILayout } from "@docsvision/webclient/System/$Layout";
import { StaffDirectoryItems } from "@docsvision/webclient/BackOffice/StaffDirectoryItems";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { TextArea } from "@docsvision/webclient/Platform/TextArea";
import { CommonLogic } from "./CommonLogic";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";

export class BusinessTripRegistrationLogic extends CommonLogic{

     public async savingConfirmed(layout:ILayout): Promise<boolean> {
        try {
            await layout.getService($MessageBox).showConfirmation('Сохранить карточку?');
            return true;
        } catch(e) {
            return false;
        }
    }

    public async sendSavingMsg(layout:ILayout) {
        await layout.getService($MessageBox).showInfo('Карточка сохраняется!');
    }
    
    public async sendSavedMsg(layout:ILayout) {
        await layout.getService($MessageBox).showInfo('Карточка сохранена!');
    }
    
    public async validateControlFilled(layout: ILayout): Promise<boolean> {
        const controlInfo = { 
            controlName: "travelingEmployee",
            fieldName: "Командируемый"
        }; 
        const control = layout.controls.tryGet<StaffDirectoryItems>(controlInfo.controlName);

        if (!control) {
            const errorMessage = `Критическая ошибка: Контрол "${controlInfo.controlName}" не найден в разметке. Обратитесь к администратору системы.`;
            await layout.getService($MessageBox).showError(errorMessage);
            return false;
        }
        if (!control.params ||!control.params.value) {
            await layout.getService($MessageBox).showError(`Пожалуйста, укажите сотрудника в поле "${controlInfo.fieldName}".`);
            return false;
        }
        return true;
    }

    public async validateTextBoxFilled(layout: ILayout): Promise<boolean> {
        const controlInfo = { 
            controlName: "applicationNameHeader",
             fieldName: "Название"
            }; 
        const control = layout.controls.tryGet<TextBox>(controlInfo.controlName);

        if (!control) {
            await layout.getService($MessageBox).showError(
                `Критическая ошибка: контрол "${controlInfo.controlName}" не найден в разметке. Обратитесь к администратору системы.`
            );
            return false;
        }

        const stringRaw = control.getParamValue?.("value");

        if (stringRaw == null) {
            await layout.getService($MessageBox).showError(`Пожалуйста, заполните поле "${controlInfo.fieldName}".`);
            return false;
        }

        const value = String(stringRaw);

        if (this.isBlank(value)) {
            await layout.getService($MessageBox).showError(`Пожалуйста, заполните поле "${controlInfo.fieldName}".`);
            control.params.value = null;
            return false;
        }

        if (this.hasLeadingWhitespace(value)) {
            await layout.getService($MessageBox).showError(
                `В поле "${controlInfo.fieldName}" недопустим ведущий пробел. Удалите пробел в начале.`
            );
            return false;
        }

        return true;
    }

    public async validateDateRangeOnForm(layout: ILayout): Promise<void> {
        const messageBox = layout.getService($MessageBox);

        const dateControls = {
            tripStartDate: {
                control: "tripStartDate",
                fieldName: "Дата с"
            },
            tripEndDate: {
                control: "tripEndDate",
                fieldName: "Дата по"
            }
        };

        const dateFromCtrl = layout.controls.tryGet<DateTimePicker>(dateControls.tripStartDate.control);
        const dateToCtrl   = layout.controls.tryGet<DateTimePicker>(dateControls.tripEndDate.control);

        if (!dateFromCtrl || !dateToCtrl) {
            console.error("Контролы дат не найдены.");
            return;
        }
        
        const fromRaw = dateFromCtrl.getParamValue?.("value");
        const toRaw   = dateToCtrl.getParamValue?.("value");

        const dateFrom = this.parseDate(fromRaw);
        const dateTo   = this.parseDate(toRaw);

        if (dateFrom == null || dateTo == null) return;

        if (dateTo.getTime() <= dateFrom.getTime()) {
            await messageBox.showError("Дата завершения командировки должна быть позднее даты ее начала.");
            dateToCtrl.params.value = null;
        }
    }


    public async showCardSummary(layout: ILayout): Promise<void> {
        const messageBox = layout.getService($MessageBox);

        const APPLICATION_NAME_CTRL = "applicationNameHeader";   // TextBox "Название"
        const DATE_FROM_CTRL = "tripStartDate";                 // DateTimePicker "Дата с"
        const DATE_TO_CTRL = "tripEndDate";                    // DateTimePicker "Дата по"
        const TRIP_BASIS_TEXT_CTRL = "tripReasonDescription"; // TextArea "Основание"
        const CREATED_DATE_CTRL = "regDate";                 // DateTimePicker "Дата создания"
        const TRIP_CITY_CTRL = "destinationCity";       // DirectoryDesignerRow "Город назначения"

        const nameCtrl = layout.controls.tryGet<TextBox>(APPLICATION_NAME_CTRL);
        const cardTitle =this.formatText(nameCtrl.getParamValue?.("value"));

        const createdCtrl = layout.controls.tryGet<DateTimePicker>(CREATED_DATE_CTRL);
        const createdRaw = createdCtrl.getParamValue?.("value");
        const createdAt = this.parseDate(createdRaw);

        const fromCtrl = layout.controls.tryGet<DateTimePicker>(DATE_FROM_CTRL);
        const toCtrl = layout.controls.tryGet<DateTimePicker>(DATE_TO_CTRL);

        const fromRaw = fromCtrl.getParamValue?.("value");
        const toRaw = toCtrl.getParamValue?.("value");

        const fromDate = this.parseDate(fromRaw);
        const toDate   = this.parseDate(toRaw);

        let basis: string | null = null;

        const basisTextCtrl = layout.controls.tryGet<TextArea>(TRIP_BASIS_TEXT_CTRL);
        if (basisTextCtrl) {
                const basisRaw = basisTextCtrl.getParamValue?.("value");
                const basisPlain = this.htmlToPlainText(basisRaw);
                basis = this.formatText(basisPlain);
        }

        const cityCtrl = layout.controls.tryGet<DirectoryDesignerRow>(TRIP_CITY_CTRL);
        let cityText: string | null = null;

        if (cityCtrl) {
            const cityValue = cityCtrl.getParamValue?.("value");
            if (cityValue) {
                cityText = cityValue.name;
            }
        }
        cityText = this.formatText(cityText);

        const lines = [
            `Название карточки: ${nameCtrl ? cardTitle: "Контрол не найден"}`,
            `Дата создания: ${createdCtrl ? this.formatDate(createdAt) : "Контрол не найден"}`,
            `Дата с: ${fromCtrl ? this.formatDate(fromDate) : "Контрол не найден"}`,
            `Дата по: ${toCtrl ? this.formatDate(toDate) : "Контрол не найден"}`,
            `Город назначения: ${cityCtrl ? cityText: "Контрол не найден"}`,
            `Основание для поездки: ${basis ?? "Контрол не найден"}`
        ].join("\n");

        await messageBox.showInfo(lines, "Информация о командировке");
    }
}