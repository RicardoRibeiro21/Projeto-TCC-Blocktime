using Domains.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infra.Data.Context
{
    public class ContextBlockTime : DbContext
    {
        public DbSet<Usuarios> Usuarios { get; set; }
        public DbSet<HistoricoFormulario> HistoricoFormulario { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer("Data Source=44851410808;Initial Catalog=SENAI_ECOMMERCE_MANHA;user id=sa; pwd=S#nai@132");
            optionsBuilder.UseMySQL("Server=MYSQL5022.site4now.net;Database=db_a4e35f_blockdb;Uid=a4e35f_blockdb;Pwd=senha123;");
            base.OnConfiguring(optionsBuilder);
        }

    }
}
