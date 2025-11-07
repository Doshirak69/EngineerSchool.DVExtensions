import { ILayout } from "@docsvision/webclient/System/$Layout";
import { CancelableEventArgs } from "@docsvision/webclient/System/CancelableEventArgs";
import { ICardSavingEventArgs } from "@docsvision/webclient/System/ICardSavingEventArgs";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { IDataChangedEventArgsEx } from "@docsvision/webclient/System/IDataChangedEventArgs";
import { BusinessTripRegistrationLogic } from "../Logic/BusinessTripRegistrationLogic";
import { ICancelableEventArgs } from "@docsvision/webclient/System/ICancelableEventArgs";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { Layout } from "@docsvision/webclient/System/Layout";

/**
 * Событие во время сохранения карточки
 * @param layout разметка
 * @param args аргументы
 */
export async function ddBusinessTripRegistration_cardSaving(layout: ILayout, args: CancelableEventArgs<ICardSavingEventArgs>) {
	if (!layout) { return; }
	let logic = new BusinessTripRegistrationLogic();

    args.wait();
    if (!await logic.savingConfirmed(layout)) {
        args.cancel();
        return;
    } 
    
    await logic.sendSavingMsg(layout);
    args.accept();
}


/**
 * Событие после сохранения карточки
 * @param layout разметка
 */
export async function ddBusinessTripRegistration_cardSaved(layout: Layout) {
	if (!layout) { return; }
	let logic = new BusinessTripRegistrationLogic();
    await logic.sendSavedMsg(layout);
}

/**
 * Событие перед сохранением карточки. Проверяет заполненность поля "Командируемый".
 * @param layout Разметка карточки.
 * @param args Аргументы события сохранения.
 */
export async function ddBusinessTripRegistration_TravelingEmployeeStaffDirectoryItems_cardSaving(
    layout: ILayout,
    args: CancelableEventArgs<ICardSavingEventArgs>
) {
    if (!layout) { return; }
    let logic = new BusinessTripRegistrationLogic();

    args.wait();
    if (!(await logic.validateControlFilled(layout))) {
        args.cancel();
        return;
    }
    args.accept()
}

/**
 * Событие перед сохранением карточки. Проверяет заполненность поля "Название".
 * @param layout Разметка карточки.
 * @param args Аргументы события сохранения.
 */
export async function ddBusinessTripRegistration_applicationNameHeaderTextBox_cardSaving(
  layout: ILayout,
  args: CancelableEventArgs<ICardSavingEventArgs>
) {
    if (!layout) { return; }
    let logic = new BusinessTripRegistrationLogic();

    args.wait();
    if (!(await logic.validateTextBoxFilled(layout))) {
        args.cancel();
        return;
    }
    args.accept()
}

/**
 * Событие после изменения значения в контроле «Дата с»
 * @param sender Контрол DateTimePicker «Дата с».
 */
export async function ddBusinessTripRegistration_dateFrom_onDataChanged(
    sender: DateTimePicker,
    args: IDataChangedEventArgsEx<Date>
) {
    if (!sender || !sender.layout) return;
    const logic = new BusinessTripRegistrationLogic();
    await logic.validateDateRangeOnForm(sender.layout);
}

/**
 * Событие после изменения значения в контроле «Дата по»
 * @param sender Контрол DateTimePicker «Дата по».
 */
export async function ddBusinessTripRegistration_dateTo_onDataChanged(
    sender: DateTimePicker,
    args: IDataChangedEventArgsEx<Date>
) {
    if (!sender || !sender.layout) return;
    const logic = new BusinessTripRegistrationLogic();
    await logic.validateDateRangeOnForm(sender.layout);
}

/**
 * Событие по щелчку кнопки. Вывод краткой информации о документе.
 * @param layout Разметка карточки.
 */
export async function ddBusinessTripRegistration_InformCustomButton_onClick(
    sender: CustomButton,
    args: ICancelableEventArgs<void>
) {
    if (!sender || !sender.layout) return;
    const logic = new BusinessTripRegistrationLogic();
    await logic.showCardSummary(sender.layout);
}