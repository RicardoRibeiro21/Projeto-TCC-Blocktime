
using Domains.DTO;
using Domains.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IEventService
    {
        List<EventDTO> ListarEvents(Usuarios user, FormDTO form, int hostID);
    }
}
