using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domains.Models
{
    public class HistoricoFormulario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("HostGroupID", TypeName = "int(11)")]
        [Required]
        public int HostGroupID { get; set; }

        [Column("HostGroupName", TypeName = "varchar(255)")]
        [Required]
        public string HostGroupName { get; set; }

        [Column("Data", TypeName = "datetime")]
        [Required]
        public DateTime Data { get; set; }

        [Column("DataInicio", TypeName = "datetime")]
        [Required]
        public DateTime DataInicio { get; set; }

        [Column("DataFinal", TypeName = "datetime")]
        [Required]
        public DateTime DataFinal { get; set; }
    }
}
