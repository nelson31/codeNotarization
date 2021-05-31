using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace codeNotarization.Models
{
    public class DocumentModel
    {
        public string Hash { get; set; }
        public string AddrOwner { get; set; }
        public string HashMetadata { get; set; }
        public Dictionary<String, String> Metadata { get; set; }
    }
}
