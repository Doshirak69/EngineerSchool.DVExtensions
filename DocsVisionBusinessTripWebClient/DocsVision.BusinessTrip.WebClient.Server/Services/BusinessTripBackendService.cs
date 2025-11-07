using DocsVision.BackOffice.CardLib.CardDefs;
using DocsVision.BackOffice.ObjectModel.Services;
using DocsVision.BackOffice.ObjectModel;
using DocsVision.Platform.ObjectModel;
using DocsVision.Platform.WebClient;
using System;
using System.Collections.Generic;
using System.Linq;
using DocsVision.BusinessTrip.WebClient.Services.Interfaces;

namespace DocsVision.BusinessTrip.WebClient.Services
{
    public class BusinessTripBackendService: IBusinessTripBackendService
    {
        private readonly ObjectContext _context;

        public BusinessTripBackendService(ObjectContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public void FillFieldsOnCreate(Document card, SessionContext sessionContext)
        {
            Console.WriteLine($"Filling fields on create for card {card.GetObjectId()}");

            var currentUser = sessionContext.UserInfo.EmployeeId; 

            var travelingEmployee = _context.GetObject<StaffEmployee>(currentUser);
            if (travelingEmployee != null)
            {
                card.MainInfo["TravelingEmployee"] = travelingEmployee.GetObjectId();
                UpdateFieldsBasedOnEmployee(card, travelingEmployee);
            }
            
            var secretary = FindFirstActiveEmployeeInGroup(sessionContext, "секретарь"); 
            if (secretary != null)
            {
                card.MainInfo["ResponsibleEmployee"] = secretary.GetObjectId();
            }

            FillApprovers(card, sessionContext);
            _context.AcceptChanges();
        }

        public void UpdateFieldsOnEmployeeChange(Document card, string employeeAccount)
        {
            Console.WriteLine($"Updating fields on employee change for card {card.GetObjectId()} with account {employeeAccount}");
            var travelingEmployee = FindEmployeeByAccount(employeeAccount);
            if (travelingEmployee != null)
            {
                card.MainInfo["TravelingEmployee"] = travelingEmployee.GetObjectId();
                UpdateFieldsBasedOnEmployee(card, travelingEmployee);
                _context.AcceptChanges();
            }
        }

        public void UpdateFieldsOnCityChange(Document card, string cityName, DateTime dateFrom, DateTime dateTo)
        {
            Console.WriteLine($"Updating fields on city change for card {card.GetObjectId()} with city {cityName}");

            var cityItem = GetUniversalItemByName("Города", cityName);
            if (cityItem != null)
            {
                card.MainInfo["City"] = cityItem.GetObjectId();

                var dsa = (decimal)cityItem.ItemCard.MainInfo["DailySubsistenceAllowance"];

                if ( decimal.TryParse(dsa.ToString(), out decimal dailyAllowance))
                {
                    int numberOfDays = (int)(dateTo - dateFrom).TotalDays + 1;
                    decimal totalAllowance = dailyAllowance * numberOfDays;
                    card.MainInfo["TripAllowanceAmount"] = totalAllowance;
                }
                else
                {
                    Console.WriteLine($"Could not get or parse 'TripAllowanceAmount' for city '{cityName}'.");
                }
            }
            else
            {
                Console.WriteLine($"City '{cityName}' not found.");
            }
            _context.AcceptChanges();
        }

        private void UpdateFieldsBasedOnEmployee(Document card, StaffEmployee travelingEmployee)
        {
            var manager = FindEmployeeManager(travelingEmployee);
            if (manager != null)
            {
                card.MainInfo["Manager"] = manager.GetObjectId();
                card.MainInfo["PhoneNumber"] = manager.Phone;
            }
            else
            {
                Console.WriteLine($"Manager not found for employee {travelingEmployee.AccountName}.");
            }

            PartnersCompany? organization = FindPartnersCompanyByName(travelingEmployee);
            if (organization != null)
            {
                card.MainInfo["OrganizationName"] = organization.GetObjectId();
            }
        }

        private void FillApprovers(Document card, SessionContext sessionContext)
        {
            IStaffService staffService = _context.GetService<IStaffService>();
            var travelingEmployeeAccount = card.MainInfo["TravelingEmployee"]?.ToString();
            if (string.IsNullOrEmpty(travelingEmployeeAccount)) return;

            var travelingEmployee = _context.GetObject<StaffEmployee>(new Guid(travelingEmployeeAccount));
            if (travelingEmployee == null) return;

            var approversSection = card.GetSection(CardDocument.Approvers.ID) as IList<BaseCardSectionRow>;

            StaffEmployee? approver = null;
            bool isDepartmentHead = IsDepartmentHead(travelingEmployee); 
            if (isDepartmentHead)
            {
                approver = FindDirector(travelingEmployee); 
            }
            else
            {
                approver = staffService.GetEmployeeManager(travelingEmployee);
            }

            if (approver != null)
            {
                var approverRow = new BaseCardSectionRow();
                approverRow[CardDocument.Approvers.Approver] = approver.GetObjectId();
                approversSection.Add(approverRow);
            }
        }

        private StaffEmployee? FindEmployeeByAccount(string accountName)
        {
            IStaffService staffService = _context.GetService<IStaffService>();
            return staffService.FindEmpoyeeByAccountName(accountName);
        }

        private StaffEmployee? FindEmployeeManager(StaffEmployee employee)
        {
            IStaffService staffService = _context.GetService<IStaffService>();
            return staffService.GetEmployeeManager(employee);
        }

        private BaseUniversalItem? GetUniversalItemByName(string dictionaryName, string itemName)
        {
            IBaseUniversalService universalService = _context.GetService<IBaseUniversalService>();
            BaseUniversalItemType dictionaryType = universalService.FindItemTypeWithSameName(dictionaryName, null);
            if (dictionaryType == null) return null;
            return universalService.FindItemWithSameName(itemName, dictionaryType);
        }

        private StaffEmployee? FindFirstActiveEmployeeInGroup(SessionContext sessionContext, string groupName)
        {
            IStaffService staffService = _context.GetService<IStaffService>();
            var secretaryGroup = staffService.FindGroupByName(null, "Секретарь");
            var employeeList = secretaryGroup.Employees;
            return employeeList.FirstOrDefault(e => e.Status == StaffEmployeeStatus.Active);
        }

        private StaffEmployee? FindDirector(StaffEmployee employee)
        {
            var topLevelEmployeeUnit = GetOrganization(employee);

            return topLevelEmployeeUnit.Manager;
        }

        private bool IsDepartmentHead(StaffEmployee employee)
        {
            IStaffService staffService = _context.GetService<IStaffService>();
            if (staffService.GetEmployeeManager(employee) == employee)
            return true;

            return false;
        }

        public static StaffUnit GetOrganization(StaffEmployee employee)
        {
            StaffUnit organization = employee.Unit;

            while (organization.ParentUnit != null &&
                   organization.ParentUnit.Type != StaffUnitType.Organization)
            {
                organization = organization.ParentUnit;
            }
            return organization;
        }

        private PartnersCompany? FindPartnersCompanyByName(StaffEmployee employee)
        {
            IPartnersService partnersService = _context.GetService<IPartnersService>();
            var topLevelEmployeeUnit = GetOrganization(employee);

            var targetCompany = partnersService.FindSameCompanyOnServer(null, topLevelEmployeeUnit.Name, "");
            //var department = targetCompany.Companies
            //                                 .FirstOrDefault(c => c.Name == employeeDepartment.Name);
            return targetCompany;
        }
    }
}
