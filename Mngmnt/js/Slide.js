﻿var slideId = -1;

$(document).ready(function () {

    LoadLanguageDropDown();

    if (ModulePermission.Insert == false || ModulePermission.Update == false) {

        $("#container").empty();
        $("#container").load("404.aspx");
    }

    if ($("#EditMode").val() == "false") {
        $("#DivSave").addClass("col-sm-offset-2");
    }

    $("#btnCancel").click(function () {
        $("#container").load("SlideList.aspx");
    });

    $("#btnSaveSlide").click(function () {

        if (ValidateData() == true) {

            $("#btnSaveSlide").css({ "background-image": "url('pics/loading1.gif')", "background-repeat": "no-repeat", "background-size": "25px", "background-position": "2px" });

            if ($("#EditMode").val() == "false") {
                UploadImage();
            } else {
                if (checkUrl(slideId) != $("#txtUrl").val()) {
                    UploadImage();
                }
            }
        }

    });

    $("#btnAddImage, #txtUrl").click(function () {
        $("#FileUpload").click();
    });

    $("#FileUpload").change(function () {

        var files = $('#FileUpload')[0].files;
        for (var i = 0; i < files.length; i++) {
            $("#txtUrl").val(files[i].name);
        }
    });

});

function LoadLanguageDropDown() {

    $.ajax({
        type: "POST",
        url: "WebServices/LanguageWs.asmx/GetData",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: "true",
        success: function (response) {
            var msg = eval('(' + response.d + ')');

            var drpLanguage = "";

            for (var i = 0; i < msg.length; i++) {
                drpLanguage += '  <option value="' + msg[i].Id + '">' + msg[i].Name + '</option>';
            }

            $("#DrpLanguage").append(drpLanguage);

        },
        error: function (xhr) {
            MessageBox(5);
        },
        complete: function () {

        }
    });
}

function UploadImage() {

    ShowLoading();
  
    var uploadfiles = $("#FileUpload").get(0);
    var uploadedfiles = uploadfiles.files;
    var fromdata = new FormData();

    for (var i = 0; i < uploadedfiles.length; i++) {
        fromdata.append(uploadedfiles[i].name, uploadedfiles[i]);
    }

    
    var choice = {};
    choice.url = "Handler/ImageHandler.ashx";
    choice.type = "POST";
    choice.data = fromdata;
    choice.contentType = false;
    choice.processData = false;
    choice.success = function() {

        HideLoading();


        if ($("#EditMode").val() == "false") {

            insertSlide($("#txtUrl").val(), $("#txtAlternative").val(),
                $("#txtLink").val(), $("#DrpOpenLink").val(),
                $("#txtShowTime").val(), $("#DrpLanguage").val(),
                $("#txtTitle1").val(), $("#txtTitle2").val(), $("#txtTitle3").val());
        } else {

            updateSlide(slideId, $("#txtUrl").val(), $("#txtAlternative").val(),
                $("#txtLink").val(), $("#DrpOpenLink").val(),
                $("#txtShowTime").val(), $("#DrpLanguage").val(),
                $("#txtTitle1").val(), $("#txtTitle2").val(), $("#txtTitle3").val());
        };
    }

    $.ajax(choice);
    event.preventDefault();
}

function checkUrl(id) {

    $.ajax({
        type: "POST",
        url: "WebServices/SlideWs.asmx/CheckUrl",
        data: "{id:'" + id + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: "true",
        success: function (response) {
            var msg = eval('(' + response.d + ')');

            return msg;
        },
        error: function (xhr) {
            MessageBox(5);
        },
        complete: function () {
            HideLoading();
        }
    });
}

function insertSlide(image, alternativeText, link, openLink, showTime, languageId, title1, title2, title3) {
   
    var obj = new Object();

    obj.Image = image;
    obj.AlternativeText = alternativeText;
    obj.Link = link;
    obj.OpenLink = openLink;
    obj.ShowTime = showTime;
    obj.LanguageId = languageId;
    obj.Title1 = title1;
    obj.Title2 = title2;
    obj.Title3 = title3;
    obj.Visibility = true;

    $.ajax({
        type: "POST",
        url: "WebServices/SlideWs.asmx/Insert",
        data: "{ slideEntity:" + JSON.stringify(obj) + "}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: "true",
        success: function (data) {
            var msg = eval('(' + data.d + ')');

            MessageBox(1);

            $("#txtTitle1").val("");
            $("#txtTitle2").val("");
            $("#txtTitle3").val("");
            $("#txtUrl").val("");
            $("#txtAlternative").val("");
            $("#txtLink").val("");        
            $("#txtShowTime").val("");
           
        },
        error: function (xhr) {
            MessageBox(5);
        },
        complete: function () {
            $('#btnSaveSlide').css({ "background": "#364F6A" });
        }
    });
}

function updateSlide(id, image, alternativeText, link, openLink, showTime, languageId, title1, title2, title3) {

    var obj = new Object();

    obj.Id = id;
    obj.Image = image;
    obj.AlternativeText = alternativeText;
    obj.Link = link;
    obj.OpenLink = openLink;
    obj.ShowTime = showTime;
    obj.LanguageId = languageId;
    obj.Title1 = title1;
    obj.Title2 = title2;
    obj.Title3 = title3;

    $.ajax({
        type: "POST",
        url: "WebServices/SLideWs.asmx/Update",
        data: "{slideEntity:" + JSON.stringify(obj) + "}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: "true",
        success: function (data) {
            var msg = eval('(' + data.d + ')');

            MessageBox(2);

            $("#EditMode").val(false);

            if (msg == true) {
                $("#container").load("SlideList.aspx");
            }

        },
        error: function (xhr) {
            MessageBox(5);
        },
        complete: function () {
            $('#btnSaveSlide').css({ "background": "#364F6A" });
        }
    });
}

function ValidateData() {

    var check = true;

    $(".InputRequire").each(function () {

        if ($(this).val() == "") {
            check = false;
            $(this).css({ "border-color": "#fe0303" });
        } else {
            $(this).css({ "border-color": "#e4e8eb" });
        }
    });

    return check;
}