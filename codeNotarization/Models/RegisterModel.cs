using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace codeNotarization.Models
{
    public class RegisterModel
    {
        public string Address { get; set; }
        public string Token { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Telemovel { get; set; }
        public string Pais { get; set; }
        public string Cidade { get; set; }
        public string NumDocs { get; set; }
    }
}
