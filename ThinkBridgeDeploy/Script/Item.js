//--------  Document Ready Event ---------
$(document).ready(function () {
    GetItems();
    $('#btnAddItem').click(function () {
        resetPopupData();
    });
});

//-------- Get Employee ---------
function GetItems() {
    $.ajax({
        type: "GET",
        url: '/API/Item/GetAllItem',
        data: {},
        async: true,
        success: function (result) {
            if (result.Status == "Success") {
                RanderData(result.Data);
            }
            else {
                alert(result.Message);
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        },
        complete: function () {

        }
    });
}

//-------- Employee Save ---------
function SaveItem() {
    if (!validate()) return;
    var formData = new FormData();
    var files = $('#txtItemImage')[0].files;
    // Check file selected or not
    if (files.length > 0) {
        if (files[0].size > 8000) {
            alert("File size is to large. It should be less than 7 KB.");
            $('#ItemModal').modal('hide');
            return;
        }
        formData.append('file', files[0]);
    }
    var vm = {};
    var apiURL = '/API/Item/AddItem';
    var id = $('#hdnItemId').val();
    vm["Id"] = '00000000-0000-0000-0000-000000000000';
    if(id != null && id != '00000000-0000-0000-0000-000000000000' && id != '') {
        apiURL = '/API/Item/UpdateItem';
        vm["Id"] = $('#hdnItemId').val();
    }
    vm["Name"] = $('#txtName').val();
    vm["Description"] = $('#txtDescription').val();
    vm["Price"] = $('#txtPrice').val();
    vm["Category"] = $('#txtCategory').val();

    formData.append("VM", JSON.stringify(vm));
    $.ajax({
        type: "POST",
        url: apiURL,
        data: formData,
        contentType: false,
        async : true,
        processData: false,
        dataType: 'json',
        success: function (result) {
            if (result.Status == "Success") {
                GetItems();
                alert(result.Message);
            }
            else {
                alert(result.Message);
            }
        },
        error: function (error) {
            alert(error);
        }
    });
    $('#ItemModal').modal('hide');
}

//-------- Employee Edit ---------
function EditItem(id) {
        $.ajax({
            type: "GET",
            url: '/API/Item/GetItemById',
            data: { "ID": id },
            async: true,
            success: function (result) {
                if (result.Status == "Success") {
                    resetPopupData();
                    var data = result.Data;
                    $('#hdnItemId').val(data.Id);
                    $('#txtName').val(data.Name);
                    $('#txtDescription').val(data.Description);
                    $('#txtCategory').val(data.Category);
                    $('#txtPrice').val(data.Price);
                    if (!IsNullOrWhiteSpaceOrUndefined(data.FileName)) $('#lblExistingFileName').text(data.FileName);
                    $('#ItemModal').modal('show');
                }
                else {
                    alert(result.Message);
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
            },
            complete: function () {
        
            }
        });
}

//------ Employee Delete ---------
function DeleteItem(id) {
    $.ajax({
        type: "GET",
        url: '/API/Item/DeleteItem',
        async: true,
        data: { "ID": id },
        success: function (result) {
            if (result.Status == "Success") {
                GetItems();
                alert(result.Message);
            }
            else {
                alert(result.Message);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        },
        complete: function () {

        }
    });
}

//------ Rander Employee Data ---------
function RanderData(data) {
    var row = "<tr><td>{{SrNo}}</td><td><img src='{{ProfilePhoto}}' style='border-radius: 50px;border: 1px solid #ccc;' width='40' height='40'></td><td>{{Name}}</td><td>{{Description}}</td><td>{{Category}}</td><td>{{Price}}</td><td>{{Action_Link}}</td></tr>";
    var editButton = "<a onclick=EditItem('{{ID}}') style='cursor: pointer;'>Edit</a>";
    var deleteButton = "<a onclick=DeleteItem('{{ID}}') style='cursor: pointer;'>Delete</a>";
    var bodyhtml = "";
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var r = row;
        r = r.replace("{{SrNo}}", i+1);
        r = r.replace("{{Name}}", item.Name);
        r = r.replace("{{Description}}", item.Description);
        r = r.replace("{{Category}}", item.Category);
        r = r.replace("{{Price}}", item.Price);
        r = r.replace("{{ProfilePhoto}}", IsNullOrWhiteSpaceOrUndefined(item.FileName) ? "Images/Employee.png" : item.FileName);
        var btnedit = editButton;
        var btndelete = deleteButton;
        btnedit = btnedit.replace("{{ID}}", item.Id);
        btndelete = btndelete.replace("{{ID}}", item.Id);
        var actionButtons = btnedit + " | " + btndelete;
        r = r.replace("{{Action_Link}}", actionButtons);
        bodyhtml += r;
    }
    if (data.length <= 0) {
        $('#OrgData').hide();
        $('#NoDataFound').show();
    }
    else {
        $('#NoDataFound').hide();
        $('#OrgData').show();
    }
    $('#tblItem').html(bodyhtml);
}

//------ Reset Popup Data -----------
function resetPopupData() {
    $('#txtName').val("");
    $('#txtDescription').val("");
    $('#txtCategory').val("");
    $('#txtPrice').val("");
    $('#txtItemImage').val("");
    $('#hdnItemId').val("");
    $('#lblExistingFileName').text("");
}

//----- Validation -----------
function validate() {
    var validateProperty = [];
    var Name = $('#txtName').val();
    var Description = $('#txtDescription').val();
    var Category = $('#txtCategory').val();
    var Price = $('#txtPrice').val();
    if (IsNullOrWhiteSpaceOrUndefined(Name)) {
        var obj = {};
        obj.Key = 'Name'
        obj.Value = "Name is required."
        validateProperty.push(obj);
    }
    if (IsNullOrWhiteSpaceOrUndefined(Description)) {
        var obj = {};
        obj.Key = 'Description'
        obj.Value = "Description is required."
        validateProperty.push(obj);
    }
    if (IsNullOrWhiteSpaceOrUndefined(Category)) {
        var obj = {};
        obj.Key = 'Category'
        obj.Value = "Category is required."
        validateProperty.push(obj);
    }
    if (IsNullOrWhiteSpaceOrUndefined(Price)) {
        var obj = {};
        obj.Key = 'Price'
        obj.Value = "Price is required."
        validateProperty.push(obj);
    }
    else if (Price <= 0) {
        var obj = {};
        obj.Key = 'Price'
        obj.Value = "Price should be grater than zero."
        validateProperty.push(obj);
    }
    if (validateProperty != null && validateProperty.length > 0) {
        var row = "<label><b style='color: #ce4242;'>{{key}} : </b>{{value}}</label></br>";
        var bodyhtml = "";
        for (var i = 0; i < validateProperty.length; i++) {
            var p = validateProperty[i];
            var r = row;
            r = r.replace("{{key}}", p.Key);
            r = r.replace("{{value}}", p.Value);
            bodyhtml += r;
        }
        $('#validateMBody').html(bodyhtml);
        $('#validateionMOdal').modal('show');
        return false;
    }
    return true;
}

var IsNullOrWhiteSpaceOrUndefined = function (value) {
    switch (value) {
        case '':
        case undefined:
        case 'undefined':
        case ' ':
        case NaN:
        case null: return true;
        default:
            if (typeof value == 'string' && value.trim().length <= 0) {
                return true;
            }
            return false;
    }
}