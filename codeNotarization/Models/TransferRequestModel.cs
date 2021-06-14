using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace codeNotarization.Models
{
    public class TransferRequestModel
    {
        public string HashDoc { get; set; }
        public string HashMetadata { get; set; }
        public string AddrRequester { get; set; }
        public string AddrNewProp { get; set; }
        public string Descricao { get; set; }
        public string Requester { get; set; }
    }
}
