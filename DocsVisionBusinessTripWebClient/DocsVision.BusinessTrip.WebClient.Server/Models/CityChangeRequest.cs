using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DocsVision.BusinessTrip.WebClient.Models
{
    public class CityChangeRequest
    {
        public Guid CardId { get; set; }
        public string CityName { get; set; } = string.Empty;
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
    }
}
