using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace codeNotarization.Exceptions
{
    class TransferRequestExistsException : Exception
    {
        public TransferRequestExistsException() : base() { }

        public TransferRequestExistsException(String s) : base(s) { }
    }
}
