using System;

namespace codeNotarization.Exceptions
{
    class TransferRequestExistsException : Exception
    {
        public TransferRequestExistsException() : base() { }

        public TransferRequestExistsException(String s) : base(s) { }
    }
}
