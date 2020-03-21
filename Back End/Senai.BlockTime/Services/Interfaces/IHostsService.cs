
using Domains.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IHostsService
    {
        List<HostDTO> ListarHostsPorIdGroup(int idGroup, int userID);
    }
}
