using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Test.Common;
using Test.Models;

namespace Test.API
{
    public class ItemController : ApiController
    {
        #region Save Item
        [AcceptVerbs("GET", "POST")]
        public ActionResultData AddItem()
        {
            var rtn = new ActionResultData();
            try
            {
                var itemJson = HttpContext.Current.Request.Form["VM"];
                var vm = JsonConvert.DeserializeObject<Item>(itemJson);
                if (vm != null)
                {
                    var item = new Item();
                    item.Name = vm.Name;
                    item.Description = vm.Description;
                    item.Category = vm.Category;
                    item.Price = vm.Price;
                    if (HttpContext.Current.Request.Files.AllKeys.Any())
                    {
                        var httpPostedFile = HttpContext.Current.Request.Files[0];
                        var fileData = new byte[httpPostedFile.ContentLength];
                        if (fileData != null)
                        {
                            httpPostedFile.InputStream.Read(fileData, 0, httpPostedFile.ContentLength);
                            httpPostedFile.InputStream.Dispose();
                            item.FileData = fileData;
                            item.FileName = httpPostedFile.FileName;
                            item.FileType = httpPostedFile.ContentType;
                        }
                    }
                    var uow = new UnitOfWork<Item>();
                    uow.Add(item);
                    uow.Commit();
                    rtn.Status = ReturnStatus.Success;
                    rtn.MessageTitle = "Success";
                    rtn.Message = "Item added successfully";
                    rtn.MessageBoxIcon = MessageBoxIcon.SUCCESS;
                }
            }
            catch (Exception ex)
            {
                rtn.Data = null;
                rtn.Status = ReturnStatus.Failed;
                rtn.MessageTitle = "Error";
                rtn.Message = ex.Message;
                rtn.MessageBoxIcon = MessageBoxIcon.ERROR;
            }
            return rtn;
        }
        #endregion

        #region Get All Items
        [AcceptVerbs("GET", "POST")]
        public ActionResultData GetAllItem()
        {
            var rtn = new ActionResultData();
            try
            {
                var repItem = new ItemRepository();
                var lstOfItems = repItem.GetAll();
                var data = new List<Item>();
                foreach (var item in lstOfItems)
                {
                    var _item = new Item();
                    _item.Id = item.Id;
                    _item.Name = item.Name;
                    _item.Description = item.Description;
                    _item.Category = item.Category;
                    _item.Price = item.Price;
                    var filePath = string.Empty;
                    if (item.FileData != null && !string.IsNullOrWhiteSpace(item.FileName) && !string.IsNullOrWhiteSpace(item.FileType))
                    {
                        string fileName = item.FileName;
                        var extension = item.FileType;
                        var virtualFilePath = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath;
                        filePath = string.Format("{0}Images\\{1}", virtualFilePath, Guid.NewGuid().ToString());
                        switch (extension)
                        {
                            case "image/jpeg":
                                filePath = filePath + ".jpg";
                                break;
                            case "image/png":
                                filePath = filePath + ".png";
                                break;
                        }
                        File.WriteAllBytes(filePath, item.FileData);
                        filePath = filePath.Substring(filePath.IndexOf("Images"), 47).Replace('\\', '/');
                    }
                    _item.FileName = filePath;
                    data.Add(_item);
                }
                rtn.Data = data;
                rtn.Status = ReturnStatus.Success;
            }
            catch (Exception ex)
            {
                rtn.Data = null;
                rtn.Status = ReturnStatus.Failed;
                rtn.MessageTitle = "Error";
                rtn.Message = ex.Message;
                rtn.MessageBoxIcon = MessageBoxIcon.ERROR;
            }
            return rtn;
        }
        #endregion

        #region Get Item By Id
        [AcceptVerbs("GET", "POST")]
        public ActionResultData GetItemById(Guid id)
        {
            var rtn = new ActionResultData();
            try
            {
                var repItem = new ItemRepository();
                rtn.Data = repItem.GetById(id);
                rtn.Status = ReturnStatus.Success;
            }
            catch (Exception ex)
            {
                rtn.Data = null;
                rtn.Status = ReturnStatus.Failed;
                rtn.MessageTitle = "Error";
                rtn.Message = ex.Message;
                rtn.MessageBoxIcon = MessageBoxIcon.ERROR;
            }
            return rtn;
        }
        #endregion

        #region Update Item
        [AcceptVerbs("GET", "POST")]
        public ActionResultData UpdateItem()
        {
            var rtn = new ActionResultData();
            try
            {
                var uow = new UnitOfWork<Item>();
                var itemJson = HttpContext.Current.Request.Form["VM"];
                var item = JsonConvert.DeserializeObject<Item>(itemJson);
                if (HttpContext.Current.Request.Files.AllKeys.Any())
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];
                    var fileData = new byte[httpPostedFile.ContentLength];
                    if (fileData != null)
                    {
                        httpPostedFile.InputStream.Read(fileData, 0, httpPostedFile.ContentLength);
                        httpPostedFile.InputStream.Dispose();
                        item.FileData = fileData;
                        item.FileName = httpPostedFile.FileName;
                        item.FileType = httpPostedFile.ContentType;
                    }
                }
                rtn.Data = uow.Update(item);
                rtn.Status = ReturnStatus.Success;
                rtn.MessageTitle = "success";
                rtn.Message = "Item Updated successfully";
                rtn.MessageBoxIcon = MessageBoxIcon.SUCCESS;
            }
            catch (Exception ex)
            {
                rtn.Data = null;
                rtn.Status = ReturnStatus.Failed;
                rtn.MessageTitle = "Error";
                rtn.Message = ex.Message;
                rtn.MessageBoxIcon = MessageBoxIcon.ERROR;
            }
            return rtn;
        }
        #endregion

        #region Delete Item
        [AcceptVerbs("GET", "POST")]
        public ActionResultData DeleteItem(Guid id)
        {
            var rtn = new ActionResultData();
            try
            {
                var uow = new UnitOfWork<Item>();
                var repItem = new ItemRepository();
                var item = repItem.GetById(id);
                rtn.Data = uow.Delete(item);
                rtn.Status = ReturnStatus.Success;
                rtn.MessageTitle = "success";
                rtn.Message = "Item Deleted successfully";
                rtn.MessageBoxIcon = MessageBoxIcon.SUCCESS;
            }
            catch (Exception ex)
            {
                rtn.Data = null;
                rtn.Status = ReturnStatus.Failed;
                rtn.MessageTitle = "Error";
                rtn.Message = ex.Message;
                rtn.MessageBoxIcon = MessageBoxIcon.ERROR;
            }
            return rtn;
        }
        #endregion
    }
}