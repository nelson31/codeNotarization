using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace codeNotarization.Exceptions
{
    public class UserNotRegistedException : Exception
    {
        public UserNotRegistedException() : base() { }

        public UserNotRegistedException(string s) : base(s) { }
    }
}
