using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DocsVision.BusinessTrip.WebClient.Models
{
    public class EmployeeChangeRequest
    {
        public Guid CardId { get; set; }
        public string EmployeeAccount { get; set; } = string.Empty;
    }
}