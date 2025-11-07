using System;
using DocsVision.BackOffice.ObjectModel;
using DocsVision.BusinessTrip.WebClient.Models;
using DocsVision.BusinessTrip.WebClient.Services.Interfaces;
using DocsVision.Platform.WebClient;
using Microsoft.AspNetCore.Mvc;


namespace DocsVision.BusinessTrip.WebClient.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusinessTripApiController : ControllerBase
    {
        private readonly ICurrentObjectContextProvider _contextProvider;
        private readonly IBusinessTripBackendService _backendService;

        public BusinessTripApiController(ICurrentObjectContextProvider contextProvider, IBusinessTripBackendService backendService)
        {
            _contextProvider = contextProvider ?? throw new ArgumentNullException(nameof(contextProvider));
            _backendService = backendService ?? throw new ArgumentNullException(nameof(backendService));
        }

        [HttpPost("UpdateOnEmployeeChange")]
        public IActionResult UpdateOnEmployeeChange([FromBody] EmployeeChangeRequest request)
        {
            var sessionContext = _contextProvider.GetOrCreateCurrentSessionContext();
            var objectContext = sessionContext.ObjectContext;

            try
            {
                var card = objectContext.GetObject<Document>(request.CardId);
                _backendService.UpdateFieldsOnEmployeeChange(card, request.EmployeeAccount);
                return Ok(new { Message = "Fields updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error updating fields: {ex.Message}" });
            }
        }

        [HttpPost("UpdateOnCityChange")]
        public IActionResult UpdateOnCityChange([FromBody] CityChangeRequest request)
        {
            var sessionContext = _contextProvider.GetOrCreateCurrentSessionContext();
            var objectContext = sessionContext.ObjectContext;

            try
            {
                var card = objectContext.GetObject<Document>(request.CardId);
                _backendService.UpdateFieldsOnCityChange(card, request.CityName, request.DateFrom, request.DateTo);
                return Ok(new { Message = "Fields updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error updating fields: {ex.Message}" });
            }
        }


        [HttpGet("GetEmployeeAccount/{employeeId}")]
        public IActionResult GetEmployeeAccount(string employeeId)
        {
            if (!Guid.TryParse(employeeId, out var guid))
            {
                return BadRequest(new { Message = "Invalid employee identifier format." });
            }

            try
            {                var session = _contextProvider.GetOrCreateCurrentSessionContext();
                var oc = session.ObjectContext;
                var employee = oc.GetObject<StaffEmployee>(guid);
                if (employee == null)
                {
                    return NotFound(new { Message = "Employee with Id = {guid} not found." });
                }
                var response = new EmployeeAccountResponse
                {
                    AccountName = employee.AccountName
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error retrieving account information: {ex.Message}" });
            }
        }
    }

}