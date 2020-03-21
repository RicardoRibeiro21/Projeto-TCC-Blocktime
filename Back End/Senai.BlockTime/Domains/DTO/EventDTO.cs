using System;
using System.Collections.Generic;
using System.Text;

namespace Domains.DTO
{
    public class EventDTO
    {
        public int Id { get; set; }

        public int IdTrigger { get; set; }

        public long data { get; set; }

        public string Mensagem { get; set; }
    }
}
