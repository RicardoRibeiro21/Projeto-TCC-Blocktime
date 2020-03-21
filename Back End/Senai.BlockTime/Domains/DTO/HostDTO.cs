using System;
using System.Collections.Generic;
using System.Text;

namespace Domains.DTO
{
    public class HostDTO
    {

        public int Id { get; set; }
        public string Nome { get; set; }

        public List<EventDTO> listaEvent { get; set; }
    }
}
