using System;

namespace codeNotarization.Exceptions
{
    class DocumentExistsException : Exception
    {
        public DocumentExistsException() : base() { }

        public DocumentExistsException(String s) : base(s) { }
    }
}
