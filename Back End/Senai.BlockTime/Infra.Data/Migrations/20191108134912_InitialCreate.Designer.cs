﻿// <auto-generated />
using System;
using Infra.Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infra.Data.Migrations
{
    [DbContext(typeof(ContextBlockTime))]
    [Migration("20191108134912_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.2-rtm-30932");

            modelBuilder.Entity("Domains.Models.HistoricoFormulario", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Data")
                        .HasColumnName("Data")
                        .HasColumnType("datetime");

                    b.Property<DateTime>("DataFinal")
                        .HasColumnName("DataFinal")
                        .HasColumnType("datetime");

                    b.Property<DateTime>("DataInicio")
                        .HasColumnName("DataInicio")
                        .HasColumnType("datetime");

                    b.Property<int>("HostGroupID")
                        .HasColumnName("HostGroupID")
                        .HasColumnType("int(11)");

                    b.Property<string>("HostGroupName")
                        .IsRequired()
                        .HasColumnName("HostGroupName")
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.ToTable("HistoricoFormulario");
                });

            modelBuilder.Entity("Domains.Models.Usuarios", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnName("Login")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Senha")
                        .IsRequired()
                        .HasColumnName("Senha")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnName("Url")
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.ToTable("Usuarios");
                });
#pragma warning restore 612, 618
        }
    }
}
