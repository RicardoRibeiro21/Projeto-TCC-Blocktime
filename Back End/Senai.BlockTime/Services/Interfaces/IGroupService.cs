
using Domains.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IGroupService
    {
        List<GroupDTO> ListarGroups(int idUsuario);
    }
}
