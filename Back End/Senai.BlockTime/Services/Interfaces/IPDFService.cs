
using Domains.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IPDFService
    {
        List<HostDTO> InformacoesPDF(FormDTO form, int userID);
    }
}
