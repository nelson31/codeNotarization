using System;

namespace codeNotarization.Exceptions
{
    class RegisterExistsException : Exception
    {
        public RegisterExistsException() : base() { }

        public RegisterExistsException(String s) : base(s) { }
    }
}
