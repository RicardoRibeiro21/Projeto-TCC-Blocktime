
using Domains.DTO;
using Domains.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface ITriggerService
    {
        List<TriggerDTO> BuscarTriggers(Usuarios user, int groupID);
    }
}
