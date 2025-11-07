define(['tslib', '@docsvision/webclient/System/$MessageBox', '@docsvision/webclient/System/DateTimeUtils', '@docsvision/webclient/System/ExtensionManager'], (function (tslib, $MessageBox, DateTimeUtils, ExtensionManager) { 'use strict';

    var CommonLogic = /** @class */ (function () {
        function CommonLogic() {
        }
        CommonLogic.prototype.parseDate = function (val) {
            if (val == null)
                return null;
            if (val instanceof Date)
                return isNaN(val.getTime()) ? null : val;
            try {
                var d = new Date(val);
                return isNaN(d.getTime()) ? null : d;
            }
            catch (_a) {
                return null;
            }
        };
        CommonLogic.prototype.formatDate = function (date) {
            return date instanceof Date && !isNaN(date.getTime()) ? DateTimeUtils.formatDateTime(date) : "-";
        };
        CommonLogic.prototype.formatText = function (val) {
            if (val == null)
                return "—";
            var s = String(val).trim();
            return s.length ? s : "—";
        };
        CommonLogic.prototype.isBlank = function (value) {
            return value.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "").length === 0;
        };
        CommonLogic.prototype.hasLeadingWhitespace = function (value) {
            return /^[\s\u00A0]/.test(value);
        };
        CommonLogic.prototype.htmlToPlainText = function (input) {
            if (input == null)
                return "";
            var s = String(input);
            // Переводы строк
            s = s
                .replace(/<br\s*\/?>/gi, "\n")
                .replace(/<\/p\s*>/gi, "\n");
            // Удаление тегов
            s = s.replace(/<[^>]+>/g, "");
            // Декодирование
            s = s
                .replace(/&nbsp;/gi, " ")
                .replace(/&amp;/gi, "&")
                .replace(/&quot;/gi, '"')
                .replace(/&#39;/gi, "'")
                .replace(/&lt;/gi, "<")
                .replace(/&gt;/gi, ">");
            // Нормализация пробелов/переносов
            s = s.replace(/\u00A0/g, " ");
            s = s.replace(/\r\n?/g, "\n");
            s = s.replace(/\n{3,}/g, "\n\n");
            return s.trim();
        };
        return CommonLogic;
    }());

    var BusinessTripRegistrationLogic = /** @class */ (function (_super) {
        tslib.__extends(BusinessTripRegistrationLogic, _super);
        function BusinessTripRegistrationLogic() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BusinessTripRegistrationLogic.prototype.savingConfirmed = function (layout) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showConfirmation('Сохранить карточку?')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BusinessTripRegistrationLogic.prototype.sendSavingMsg = function (layout) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showInfo('Карточка сохраняется!')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        BusinessTripRegistrationLogic.prototype.sendSavedMsg = function (layout) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showInfo('Карточка сохранена!')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        BusinessTripRegistrationLogic.prototype.validateControlFilled = function (layout) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var controlInfo, control, errorMessage;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            controlInfo = {
                                controlName: "travelingEmployee",
                                fieldName: "Командируемый"
                            };
                            control = layout.controls.tryGet(controlInfo.controlName);
                            if (!!control) return [3 /*break*/, 2];
                            errorMessage = "\u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430: \u041A\u043E\u043D\u0442\u0440\u043E\u043B \"" + controlInfo.controlName + "\" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0432 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0435. \u041E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u043A \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0443 \u0441\u0438\u0441\u0442\u0435\u043C\u044B.";
                            return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showError(errorMessage)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, false];
                        case 2:
                            if (!(!control.params || !control.params.value)) return [3 /*break*/, 4];
                            return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showError("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430 \u0432 \u043F\u043E\u043B\u0435 \"" + controlInfo.fieldName + "\".")];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/, true];
                    }
                });
            });
        };
        BusinessTripRegistrationLogic.prototype.validateTextBoxFilled = function (layout) {
            var _a;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var controlInfo, control, stringRaw, value;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            controlInfo = {
                                controlName: "applicationNameHeader",
                                fieldName: "Название"
                            };
                            control = layout.controls.tryGet(controlInfo.controlName);
                            if (!!control) return [3 /*break*/, 2];
                            return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showError("\u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430: \u043A\u043E\u043D\u0442\u0440\u043E\u043B \"" + controlInfo.controlName + "\" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0432 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0435. \u041E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u043A \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0443 \u0441\u0438\u0441\u0442\u0435\u043C\u044B.")];
                        case 1:
                            _b.sent();
                            return [2 /*return*/, false];
                        case 2:
                            stringRaw = (_a = control.getParamValue) === null || _a === void 0 ? void 0 : _a.call(control, "value");
                            if (!(stringRaw == null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showError("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043F\u043E\u043B\u0435 \"" + controlInfo.fieldName + "\".")];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, false];
                        case 4:
                            value = String(stringRaw);
                            if (!this.isBlank(value)) return [3 /*break*/, 6];
                            return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showError("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043F\u043E\u043B\u0435 \"" + controlInfo.fieldName + "\".")];
                        case 5:
                            _b.sent();
                            control.params.value = null;
                            return [2 /*return*/, false];
                        case 6:
                            if (!this.hasLeadingWhitespace(value)) return [3 /*break*/, 8];
                            return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showError("\u0412 \u043F\u043E\u043B\u0435 \"" + controlInfo.fieldName + "\" \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C \u0432\u0435\u0434\u0443\u0449\u0438\u0439 \u043F\u0440\u043E\u0431\u0435\u043B. \u0423\u0434\u0430\u043B\u0438\u0442\u0435 \u043F\u0440\u043E\u0431\u0435\u043B \u0432 \u043D\u0430\u0447\u0430\u043B\u0435.")];
                        case 7:
                            _b.sent();
                            return [2 /*return*/, false];
                        case 8: return [2 /*return*/, true];
                    }
                });
            });
        };
        BusinessTripRegistrationLogic.prototype.validateDateRangeOnForm = function (layout) {
            var _a, _b;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var messageBox, dateControls, dateFromCtrl, dateToCtrl, fromRaw, toRaw, dateFrom, dateTo;
                return tslib.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            messageBox = layout.getService($MessageBox.$MessageBox);
                            dateControls = {
                                tripStartDate: {
                                    control: "tripStartDate",
                                    fieldName: "Дата с"
                                },
                                tripEndDate: {
                                    control: "tripEndDate",
                                    fieldName: "Дата по"
                                }
                            };
                            dateFromCtrl = layout.controls.tryGet(dateControls.tripStartDate.control);
                            dateToCtrl = layout.controls.tryGet(dateControls.tripEndDate.control);
                            if (!dateFromCtrl || !dateToCtrl) {
                                console.error("Контролы дат не найдены.");
                                return [2 /*return*/];
                            }
                            fromRaw = (_a = dateFromCtrl.getParamValue) === null || _a === void 0 ? void 0 : _a.call(dateFromCtrl, "value");
                            toRaw = (_b = dateToCtrl.getParamValue) === null || _b === void 0 ? void 0 : _b.call(dateToCtrl, "value");
                            dateFrom = this.parseDate(fromRaw);
                            dateTo = this.parseDate(toRaw);
                            if (dateFrom == null || dateTo == null)
                                return [2 /*return*/];
                            if (!(dateTo.getTime() <= dateFrom.getTime())) return [3 /*break*/, 2];
                            return [4 /*yield*/, messageBox.showError("Дата завершения командировки должна быть позднее даты ее начала.")];
                        case 1:
                            _c.sent();
                            dateToCtrl.params.value = null;
                            _c.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        BusinessTripRegistrationLogic.prototype.showCardSummary = function (layout) {
            var _a, _b, _c, _d, _e, _f;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var messageBox, APPLICATION_NAME_CTRL, DATE_FROM_CTRL, DATE_TO_CTRL, TRIP_BASIS_TEXT_CTRL, CREATED_DATE_CTRL, TRIP_CITY_CTRL, nameCtrl, cardTitle, createdCtrl, createdRaw, createdAt, fromCtrl, toCtrl, fromRaw, toRaw, fromDate, toDate, basis, basisTextCtrl, basisRaw, basisPlain, cityCtrl, cityText, cityValue, lines;
                return tslib.__generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            messageBox = layout.getService($MessageBox.$MessageBox);
                            APPLICATION_NAME_CTRL = "applicationNameHeader";
                            DATE_FROM_CTRL = "tripStartDate";
                            DATE_TO_CTRL = "tripEndDate";
                            TRIP_BASIS_TEXT_CTRL = "tripReasonDescription";
                            CREATED_DATE_CTRL = "regDate";
                            TRIP_CITY_CTRL = "destinationCity";
                            nameCtrl = layout.controls.tryGet(APPLICATION_NAME_CTRL);
                            cardTitle = this.formatText((_a = nameCtrl.getParamValue) === null || _a === void 0 ? void 0 : _a.call(nameCtrl, "value"));
                            createdCtrl = layout.controls.tryGet(CREATED_DATE_CTRL);
                            createdRaw = (_b = createdCtrl.getParamValue) === null || _b === void 0 ? void 0 : _b.call(createdCtrl, "value");
                            createdAt = this.parseDate(createdRaw);
                            fromCtrl = layout.controls.tryGet(DATE_FROM_CTRL);
                            toCtrl = layout.controls.tryGet(DATE_TO_CTRL);
                            fromRaw = (_c = fromCtrl.getParamValue) === null || _c === void 0 ? void 0 : _c.call(fromCtrl, "value");
                            toRaw = (_d = toCtrl.getParamValue) === null || _d === void 0 ? void 0 : _d.call(toCtrl, "value");
                            fromDate = this.parseDate(fromRaw);
                            toDate = this.parseDate(toRaw);
                            basis = null;
                            basisTextCtrl = layout.controls.tryGet(TRIP_BASIS_TEXT_CTRL);
                            if (basisTextCtrl) {
                                basisRaw = (_e = basisTextCtrl.getParamValue) === null || _e === void 0 ? void 0 : _e.call(basisTextCtrl, "value");
                                basisPlain = this.htmlToPlainText(basisRaw);
                                basis = this.formatText(basisPlain);
                            }
                            cityCtrl = layout.controls.tryGet(TRIP_CITY_CTRL);
                            cityText = null;
                            if (cityCtrl) {
                                cityValue = (_f = cityCtrl.getParamValue) === null || _f === void 0 ? void 0 : _f.call(cityCtrl, "value");
                                if (cityValue) {
                                    cityText = cityValue.name;
                                }
                            }
                            cityText = this.formatText(cityText);
                            lines = [
                                "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438: " + (nameCtrl ? cardTitle : "Контрол не найден"),
                                "\u0414\u0430\u0442\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F: " + (createdCtrl ? this.formatDate(createdAt) : "Контрол не найден"),
                                "\u0414\u0430\u0442\u0430 \u0441: " + (fromCtrl ? this.formatDate(fromDate) : "Контрол не найден"),
                                "\u0414\u0430\u0442\u0430 \u043F\u043E: " + (toCtrl ? this.formatDate(toDate) : "Контрол не найден"),
                                "\u0413\u043E\u0440\u043E\u0434 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F: " + (cityCtrl ? cityText : "Контрол не найден"),
                                "\u041E\u0441\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u043F\u043E\u0435\u0437\u0434\u043A\u0438: " + (basis !== null && basis !== void 0 ? basis : "Контрол не найден")
                            ].join("\n");
                            return [4 /*yield*/, messageBox.showInfo(lines, "Информация о командировке")];
                        case 1:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return BusinessTripRegistrationLogic;
    }(CommonLogic));

    /**
     * Событие во время сохранения карточки
     * @param layout разметка
     * @param args аргументы
     */
    function ddBusinessTripRegistration_cardSaving(layout, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!layout) {
                            return [2 /*return*/];
                        }
                        logic = new BusinessTripRegistrationLogic();
                        args.wait();
                        return [4 /*yield*/, logic.savingConfirmed(layout)];
                    case 1:
                        if (!(_a.sent())) {
                            args.cancel();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, logic.sendSavingMsg(layout)];
                    case 2:
                        _a.sent();
                        args.accept();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Событие после сохранения карточки
     * @param layout разметка
     */
    function ddBusinessTripRegistration_cardSaved(layout) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!layout) {
                            return [2 /*return*/];
                        }
                        logic = new BusinessTripRegistrationLogic();
                        return [4 /*yield*/, logic.sendSavedMsg(layout)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Событие перед сохранением карточки. Проверяет заполненность поля "Командируемый".
     * @param layout Разметка карточки.
     * @param args Аргументы события сохранения.
     */
    function ddBusinessTripRegistration_TravelingEmployeeStaffDirectoryItems_cardSaving(layout, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!layout) {
                            return [2 /*return*/];
                        }
                        logic = new BusinessTripRegistrationLogic();
                        args.wait();
                        return [4 /*yield*/, logic.validateControlFilled(layout)];
                    case 1:
                        if (!(_a.sent())) {
                            args.cancel();
                            return [2 /*return*/];
                        }
                        args.accept();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Событие перед сохранением карточки. Проверяет заполненность поля "Название".
     * @param layout Разметка карточки.
     * @param args Аргументы события сохранения.
     */
    function ddBusinessTripRegistration_applicationNameHeaderTextBox_cardSaving(layout, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!layout) {
                            return [2 /*return*/];
                        }
                        logic = new BusinessTripRegistrationLogic();
                        args.wait();
                        return [4 /*yield*/, logic.validateTextBoxFilled(layout)];
                    case 1:
                        if (!(_a.sent())) {
                            args.cancel();
                            return [2 /*return*/];
                        }
                        args.accept();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Событие после изменения значения в контроле «Дата с»
     * @param sender Контрол DateTimePicker «Дата с».
     */
    function ddBusinessTripRegistration_dateFrom_onDataChanged(sender, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sender || !sender.layout)
                            return [2 /*return*/];
                        logic = new BusinessTripRegistrationLogic();
                        return [4 /*yield*/, logic.validateDateRangeOnForm(sender.layout)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Событие после изменения значения в контроле «Дата по»
     * @param sender Контрол DateTimePicker «Дата по».
     */
    function ddBusinessTripRegistration_dateTo_onDataChanged(sender, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sender || !sender.layout)
                            return [2 /*return*/];
                        logic = new BusinessTripRegistrationLogic();
                        return [4 /*yield*/, logic.validateDateRangeOnForm(sender.layout)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Событие по щелчку кнопки. Вывод краткой информации о документе.
     * @param layout Разметка карточки.
     */
    function ddBusinessTripRegistration_InformCustomButton_onClick(sender, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sender || !sender.layout)
                            return [2 /*return*/];
                        logic = new BusinessTripRegistrationLogic();
                        return [4 /*yield*/, logic.showCardSummary(sender.layout)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }

    var BussinessTripRegistrationHandlers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ddBusinessTripRegistration_cardSaving: ddBusinessTripRegistration_cardSaving,
        ddBusinessTripRegistration_cardSaved: ddBusinessTripRegistration_cardSaved,
        ddBusinessTripRegistration_TravelingEmployeeStaffDirectoryItems_cardSaving: ddBusinessTripRegistration_TravelingEmployeeStaffDirectoryItems_cardSaving,
        ddBusinessTripRegistration_applicationNameHeaderTextBox_cardSaving: ddBusinessTripRegistration_applicationNameHeaderTextBox_cardSaving,
        ddBusinessTripRegistration_dateFrom_onDataChanged: ddBusinessTripRegistration_dateFrom_onDataChanged,
        ddBusinessTripRegistration_dateTo_onDataChanged: ddBusinessTripRegistration_dateTo_onDataChanged,
        ddBusinessTripRegistration_InformCustomButton_onClick: ddBusinessTripRegistration_InformCustomButton_onClick
    });

    // Главная входная точка всего расширения
    // Данный файл должен импортировать прямо или косвенно все остальные файлы, 
    // чтобы rollup смог собрать их все в один бандл.
    // Регистрация расширения позволяет корректно установить все
    // обработчики событий, сервисы и прочие сущности web-приложения.
    ExtensionManager.extensionManager.registerExtension({
        name: "DVWebExtension",
        version: "1.0",
        globalEventHandlers: [BussinessTripRegistrationHandlers],
        layoutServices: [],
        controls: []
    });

}));
//# sourceMappingURL=extension.js.map
