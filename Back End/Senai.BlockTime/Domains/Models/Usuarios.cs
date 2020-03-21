using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domains.Models
{
    public class Usuarios
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("Login", TypeName = "varchar(255)")]
        [Required]
        public string  Login { get; set; }

        [Column("Auth", TypeName = "varchar(255)")]
        [Required]
        public string Auth { get; set; }

        [Column("Senha", TypeName = "varchar(255)")]
        [Required]
        public string Senha { get; set; }

        [Column("Url", TypeName = "varchar(255)")]
        [Required]
        public string Url { get; set; }
    }
}
