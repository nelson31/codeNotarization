using System;

namespace codeNotarization.Exceptions
{
    public class UserNotRegistedException : Exception
    {
        public UserNotRegistedException() : base() { }

        public UserNotRegistedException(string s) : base(s) { }
    }
}
