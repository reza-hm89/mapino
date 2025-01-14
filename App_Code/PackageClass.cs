﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for PackageClass
/// </summary>
public class PackageClass
{
	public PackageClass()
	{
	
	}

    public bool SetVisibility(long id, bool visibility)
    {
        if (GlobalFunction.CheckModulePermission("update") == false)
        {
            return false;
        }

        try
        {
            var db = new DataClassesDataContext();

            var package = (from t in db.PackageTables
                         where t.Id == id
                         select t).Single();

            package.Visibility = visibility;

            db.SubmitChanges();

            return true;
        }
        catch (Exception ex)
        {
           ErrorClass.Insert(ex.Message, ex.StackTrace, HttpContext.Current.Session["Username"].ToString());
            return false;
        }
    }

    public bool Insert(PackageEntity packageEntity)
    {
        try
        {
            var db = new DataClassesDataContext();
            var package = new PackageTable();

            package.Name = packageEntity.Name;
            package.Price = packageEntity.Price;
            package.Discount = packageEntity.Discount;
            package.Percent = packageEntity.Percent;
            package.Expire = packageEntity.Expire;
            package.Description = packageEntity.Description;
            package.Visibility = packageEntity.Visibility;
            package.StartDate = packageEntity.StartDate;
            package.EndDate = packageEntity.EndDate;
            package.Status = packageEntity.Status;
            package.MinResponse = packageEntity.MinResponse;
            package.MaxResponse = packageEntity.MaxResponse;
            package.IsExpert = packageEntity.IsExpert;

            db.PackageTables.InsertOnSubmit(package);
            db.SubmitChanges();

            return true;
        }
        catch (Exception ex)
        {
           ErrorClass.Insert(ex.Message, ex.StackTrace, HttpContext.Current.Session["Username"].ToString());
            return false;
        }
    }

    public void Update(PackageEntity packageEntity)
    {
        try
        {
            var db = new DataClassesDataContext();
            var package = (from t in db.PackageTables
                        where t.Id == packageEntity.Id
                        select t).Single();

            if (package != null)
            {
                package.Name = packageEntity.Name;
                package.Price = packageEntity.Price;
                package.Discount = packageEntity.Discount;
                package.Percent = packageEntity.Percent;
                package.Expire = packageEntity.Expire;
                package.Description = packageEntity.Description;
                package.StartDate = packageEntity.StartDate;
                package.EndDate = packageEntity.EndDate;
                package.Status = packageEntity.Status;
                package.MinResponse = packageEntity.MinResponse;
                package.MaxResponse = packageEntity.MaxResponse;
                package.IsExpert = packageEntity.IsExpert;

                db.SubmitChanges();
            }
        }
        catch (Exception ex)
        {
           ErrorClass.Insert(ex.Message, ex.StackTrace, HttpContext.Current.Session["Username"].ToString());
        }
    }

    public void DeleteOne(Int64 id)
    {
        try
        {
            var db = new DataClassesDataContext();

            var query = (from t in db.PackageTables
                         where t.Id == id
                         select t).FirstOrDefault();

            if (query != null)
            {
                db.PackageTables.DeleteOnSubmit(query);
                db.SubmitChanges();
            }

        }
        catch (Exception ex)
        {
           ErrorClass.Insert(ex.Message, ex.StackTrace, HttpContext.Current.Session["Username"].ToString());
        }
    }


    public IEnumerable<object> SelectOne(Int64 id)
    {
        try
        {
            var db = new DataClassesDataContext();

            var query = from t in db.PackageTables
                        where t.Id == id
                        select t;

            return query;
        }
        catch (Exception ex)
        {
           ErrorClass.Insert(ex.Message, ex.StackTrace, HttpContext.Current.Session["Username"].ToString());
            return null;
        }
    }

  
    public IEnumerable<object> SelectAll()
    {
        try
        {
            var db = new DataClassesDataContext();

            var query = from t in db.PackageTables
                select t;

            return query;
        }
        catch (Exception ex)
        {
           ErrorClass.Insert(ex.Message, ex.StackTrace, HttpContext.Current.Session["Username"].ToString());
            return null;
        }
    }
}