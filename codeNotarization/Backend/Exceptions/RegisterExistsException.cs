using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace codeNotarization.Exceptions
{
    class RegisterExistsException : Exception
    {
        public RegisterExistsException() : base() { }

        public RegisterExistsException(String s) : base(s) { }
    }
}
