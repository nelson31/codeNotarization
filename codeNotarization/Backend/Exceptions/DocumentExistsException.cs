using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace codeNotarization.Exceptions
{
    class DocumentExistsException : Exception
    {
        public DocumentExistsException() : base() { }

        public DocumentExistsException(String s) : base(s) { }
    }
}
