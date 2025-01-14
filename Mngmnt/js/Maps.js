﻿var mapCenter = [
37.4702060,
57.3143350
];

var mapCenter2 = [
37.4702570,
57.3143350
];

var mapCenter3 = [
37.4702160,
57.3143990
];

var neighborhoods = [
  new google.maps.LatLng(37.4702160, 57.3144990),
  new google.maps.LatLng(37.4703160, 57.3145990),
  new google.maps.LatLng(37.4704160, 57.3146990),
  new google.maps.LatLng(37.4705160, 57.3147990)
];

var markers = [];

var maxMarker = 0;

var zommLevel;

var currentLocation;

var IsPin = false;

$(function () {

    LoadPlace();

    LoadGroupDropDown1();
    LoadRegionDropDown();

    //LoadMap();

    $("#btnSavePlace").click(function () {

        if (ValidateData() == true) {
            if (IsPin == false) {
                alert("لطفا مکان مورد نظر را بر روی نقشه مشخص نمایید");
            } else {
                insertPlace($("#drpCity").val(), $("#drpGroup1").val(),
                    $("#drpGroup2").val(), $("#txtName").val(), $("#txtTel").val(), $("#txtAddress").val(), currentLocation);

            }
        }
    });

    $("#drpGroup1").change(function () {
        LoadGroupDropDown2($(this).val());
    });

    $("#drpRegion").change(function () {
        LoadCitiesDropDown($(this).val());
    });
});

function LoadMap() {

    var $dialog = $("#dialog");

    $dialog.detach();

    $('#map_canvas').gmap3({
        panel: {
            options: {
                content: $dialog, // a jQuery element or a string 
                top: 0,
                right: 0,
                middle: true
            }
        },
        map: {
            options: {
                center: mapCenter,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                mapTypeControlOptions: {
                    // style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                navigationControl: true,
                scrollwheel: true,
                streetViewControl: false
            },
            events: {
                click: function (map, event) {

                    var map = $(this).gmap3({
                        get: {
                            name: 'map',
                            callback: function (map) {
                                zoomLevel = map.getZoom();

                            }
                        }
                    });



                    var lat = event.latLng.lat(),
                        lng = event.latLng.lng();

                    if (maxMarker == 0) {

                        if (zoomLevel > 15) {
                            IsPin = true;
                            currentLocation = lat + ',' + lng;

                            $(this).gmap3(
                                {
                                    marker: {
                                        latLng: [lat, lng],
                                        animation: google.maps.Animation.DROP,
                                        options: {
                                            draggable: true,
                                            icon: "pics/marker1.png"
                                        },
                                        events: {
                                            dragend: function (marker) {

                                                //alert();//
                                                var position = marker.getPosition();
                                                currentLocation = position.lat() + ',' + position.lng();

                                            }
                                        }
                                    }
                                }
                            );

                            maxMarker++;
                        }
                        else {
                            alert("لطفا برای انتخاب مکان مورد نظر نقشه را بزرگتر کنید");
                            IsPin = false;
                        }

                    }
                }
            }
        },

        marker: {
            animation: google.maps.Animation.DROP,

            values: markers,

            options: {
                draggable: false
            },
            events: {
                mouseover: function (marker, event, context) {
                    var map = $(this).gmap3("get"),
                      infowindow = $(this).gmap3({ get: { name: "infowindow" } });
                    if (infowindow) {
                        infowindow.open(map, marker);
                        infowindow.setContent(context.data);
                    } else {
                        $(this).gmap3({
                            infowindow: {
                                anchor: marker,
                                options: { content: context.data }
                            }
                        });
                    }
                },
                mouseout: function () {
                    var infowindow = $(this).gmap3({ get: { name: "infowindow" } });
                    if (infowindow) {
                        infowindow.close();
                    }
                }
            }
        }
    });
}

function LoadPlace() {


    $.ajax({
        type: "POST",
        url: "WebServices/PlaceWs.asmx/GetData",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: "true",
        success: function (response) {
            var msg = eval('(' + response.d + ')');



            //msg = jQuery.parseJSON(msg),
            // markers = [];

            //for (var i = 0; i < obj.length; i++) {
            //    markers.push({
            //        address: obj[i]['street'] + ', ' + obj[i]['zip'] + ' ' + obj[i]['city'] + ', France'
            //    });
            //};

            for (var i = 0; i < msg.length; i++) {
                var location = msg[i].Position.split(',');

                //markers += '{ latLng: [' + location[0] + ',' + location[1] + '] , data:"' + msg[i].Name + '" , options: { icon: "pics/marker2.png" } }, ';
                // markers += '{ lat:' + location[0] + ', Lng: ' + location[1] + '},';
                //markers += '{ lat:' + location[0] + ', lng: ' + location[1] + ', data: { drive: false, zip: 93290, city: "TREMBLAY-EN-FRANCE" } },';

                markers.push({
                    lat: location[0], lng: location[1], data:"<p style='font-family:\"BYekan\"'>" + "عنوان: " + msg[i].Name + "<br> تلفن: " + msg[i].Tel + "<br> آدرس: " + msg[i].Address + "</p>"
                });
            }


            LoadMap();
        },
        error: function (xhr) {

        },
        complete: function () {

        }
    });
}

function LoadRegionDropDown() {

    $.ajax({
        type: "POST",
        url: "WebServices/RegionWs.asmx/GetRegions",
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

            $("#drpRegion").empty();

            $("#drpRegion").append(drpLanguage);

            LoadCitiesDropDown(msg[0].Id);
        },
        error: function (xhr) {
            MessageBox(5);
        },
        complete: function () {

        }
    });
}

function LoadCitiesDropDown(id) {

    $.ajax({
        type: "POST",
        url: "WebServices/RegionWs.asmx/GetCities",
        data: "{id:'" + id + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: "true",
        success: function (response) {
            var msg = eval('(' + response.d + ')');

            var drpLanguage = "<option value='-1'>ندارد</option>";

            for (var i = 0; i < msg.length; i++) {
                drpLanguage += '  <option value="' + msg[i].Id + '">' + msg[i].Name + '</option>';
            }

            $("#drpCity").empty();

            $("#drpCity").append(drpLanguage);

        },
        error: function (xhr) {
            MessageBox(5);
        },
        complete: function () {

        }
    });
}

function LoadGroupDropDown1() {

    $.ajax({
        type: "POST",
        url: "WebServices/ProductGroupWs1.asmx/GetData",
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

            $("#drpGroup1").empty();

            $("#drpGroup1").append(drpLanguage);


            LoadGroupDropDown2(msg[0].Id);

        },
        error: function (xhr) {
            MessageBox(5);
        },
        complete: function () {

        }
    });
}

function LoadGroupDropDown2(id) {

    $.ajax({
        type: "POST",
        url: "WebServices/ProductGroupWs2.asmx/SelectAllFromOneGroup",
        data: "{id:'" + id + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: "true",
        success: function (response) {
            var msg = eval('(' + response.d + ')');

            var drpLanguage = "<option value='-1'>ندارد</option>";

            for (var i = 0; i < msg.length; i++) {
                drpLanguage += '  <option value="' + msg[i].Id + '">' + msg[i].Name + '</option>';
            }

            $("#drpGroup2").empty();

            $("#drpGroup2").append(drpLanguage);

        },
        error: function (xhr) {
            MessageBox(5);
        },
        complete: function () {
            if ($("#EditMode").val() == "true") {
                $("#DrpGroup2").val(groupId2);
            }
        }
    });
}

function insertPlace(city, group1, group2, name, tel, address, position) {

    var obj = new Object();

    obj.CityID = city;
    obj.GroupID1 = group1;
    obj.GroupID2 = group2;
    obj.Name = name;
    obj.Tel = tel;
    obj.Address = address;
    obj.Position = position;
    obj.Verify = false;
    obj.Visibility = false;

    $.ajax({
        type: "POST",
        url: "WebServices/PlaceWs.asmx/Insert",
        data: "{ placeEntity:" + JSON.stringify(obj) + "}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: "true",
        success: function (data) {
            var msg = eval('(' + data.d + ')');

            alert("اطلاعات با موفقیت ثبت شد");

            $("#txtName").val("");
            $("#txtTel").val("");
            $("#txtAddress").val("");
        },
        error: function (xhr) {

        },
        complete: function () {

        }
    });
}

function drop() {
    clearMarkers();
    for (var i = 0; i < neighborhoods.length; i++) {
        addMarkerWithTimeout(neighborhoods[i], i * 200);
    }
}

function addMarkerWithTimeout(position, timeout) {
    window.setTimeout(function () {
        markers.push(new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
        }));
    }, timeout);
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
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

var macDoList = [
  { lat: 49.00408, lng: 2.56228, data: { drive: false, zip: 93290, city: "TREMBLAY-EN-FRANCE" } },
  { lat: 49.00308, lng: 2.56219, data: { drive: false, zip: 93290, city: "TREMBLAY-EN-FRANCE" } },
  { lat: 48.93675, lng: 2.35237, data: { drive: false, zip: 93200, city: "SAINT-DENIS" } },
  { lat: 48.93168, lng: 2.39858, data: { drive: true, zip: 93120, city: "LA COURNEUVE" } },
  { lat: 48.91304, lng: 2.38027, data: { drive: true, zip: 93300, city: "AUBERVILLIERS" } },
  { lat: 48.90821, lng: 2.51795, data: { drive: false, zip: 93190, city: "LIVRY-GARGAN" } },
  { lat: 48.90672, lng: 2.33205, data: { drive: false, zip: 93400, city: "SAINT-OUEN" } },
  { lat: 48.89191, lng: 2.44477, data: { drive: true, zip: 93130, city: "NOISY-LE-SEC" } },
  { lat: 48.87986, lng: 2.4164, data: { drive: false, zip: 93260, city: "LES LILAS" } },
  { lat: 48.8556, lng: 2.41621, data: { drive: false, zip: 93100, city: "MONTREUIL" } },
  { lat: 48.83445, lng: 2.56199, data: { drive: true, zip: 93160, city: "NOISY-LE-GRAND" } },
  { lat: 48.83907, lng: 2.48585, data: { drive: false, zip: 94130, city: "NOGENT-SUR-MARNE" } },
  { lat: 48.82102, lng: 2.41444, data: { drive: false, zip: 94220, city: "CHARENTON-LE-PONT" } },
  { lat: 48.82011, lng: 2.47548, data: { drive: true, zip: 94340, city: "JOINVILLE-LE-PONT" } },
  { lat: 48.81429, lng: 2.50873, data: { drive: false, zip: 94500, city: "CHAMPIGNY-SUR-MARNE" } },
  { lat: 48.79584, lng: 2.41266, data: { drive: true, zip: 94400, city: "VITRY-SUR-SEINE" } },
  { lat: 48.79193, lng: 2.36959, data: { drive: true, zip: 94800, city: "VILLEJUIF" } },
  { lat: 48.76182, lng: 2.44355, data: { drive: true, zip: 94190, city: "VILLENEUVE-SAINT-GEORGES" } },
  { lat: 48.75845, lng: 2.37052, data: { drive: false, zip: 94320, city: "THIAIS" } },
  { lat: 48.75619, lng: 2.34647, data: { drive: true, zip: 94150, city: "RUNGIS" } },
  { lat: 48.74476, lng: 2.40973, data: { drive: true, zip: 94310, city: "ORLY" } },
  { lat: 48.939, lng: 2.52663, data: { drive: true, zip: 93270, city: "SEVRAN" } },
  { lat: 48.93847, lng: 2.3565, data: { drive: false, zip: 93200, city: "SAINT-DENIS" } },
  { lat: 48.95829, lng: 2.47644, data: { drive: false, zip: 93600, city: "AULNAY-SOUS-BOIS" } },
  { lat: 48.85286, lng: 2.48593, data: { drive: false, zip: 94120, city: "FONTENAY-SOUS-BOIS" } },
  { lat: 48.7944, lng: 2.55241, data: { drive: true, zip: 94490, city: "ORMESSON-SUR-MARNE" } },
  { lat: 48.8775, lng: 2.4751, data: { drive: true, zip: 93110, city: "ROSNY-SOUS-BOIS" } },
  { lat: 48.78475, lng: 2.46003, data: { drive: true, zip: 94000, city: "CRÉTEIL" } },
  { lat: 48.82535, lng: 2.3942, data: { drive: false, zip: 94220, city: "CHARENTON-LE-PONT" } },
  { lat: 48.77372, lng: 2.39927, data: { drive: true, zip: 94600, city: "CHOISY-LE-ROI" } },
  { lat: 48.89732, lng: 2.34485, data: { drive: false, zip: 75018, city: "PARIS" } },
  { lat: 48.8986, lng: 2.34416, data: { drive: false, zip: 75018, city: "PARIS" } },
  { lat: 48.89588, lng: 2.34647, data: { drive: false, zip: 75018, city: "PARIS" } },
  { lat: 48.89052, lng: 2.3599, data: { drive: false, zip: 75018, city: "PARIS" } },
  { lat: 48.88865, lng: 2.39267, data: { drive: false, zip: 75019, city: "PARIS" } },
  { lat: 48.88755, lng: 2.32541, data: { drive: false, zip: 75017, city: "PARIS" } },
  { lat: 48.88555, lng: 2.29205, data: { drive: false, zip: 75017, city: "PARIS" } },
  { lat: 48.88388, lng: 2.3468, data: { drive: false, zip: 75018, city: "PARIS" } },
  { lat: 48.88235, lng: 2.37054, data: { drive: false, zip: 75019, city: "PARIS" } },
  { lat: 48.87994, lng: 2.35419, data: { drive: false, zip: 75010, city: "PARIS" } },
  { lat: 48.87709, lng: 2.40637, data: { drive: false, zip: 75019, city: "PARIS" } },
  { lat: 48.87594, lng: 2.34406, data: { drive: false, zip: 75009, city: "PARIS" } },
  { lat: 48.87536, lng: 2.32551, data: { drive: false, zip: 75008, city: "PARIS" } },
  { lat: 48.87541, lng: 2.29615, data: { drive: false, zip: 75017, city: "PARIS" } },
  { lat: 48.87421, lng: 2.32953, data: { drive: false, zip: 75009, city: "PARIS" } },
  { lat: 48.87248, lng: 2.29907, data: { drive: false, zip: 75008, city: "PARIS" } },
  { lat: 48.87196, lng: 2.3403, data: { drive: false, zip: 75009, city: "PARIS" } },
  { lat: 48.8712, lng: 2.33522, data: { drive: false, zip: 75009, city: "PARIS" } },
  { lat: 48.87119, lng: 2.30334, data: { drive: false, zip: 75008, city: "PARIS" } },
  { lat: 48.8707, lng: 2.34771, data: { drive: false, zip: 75009, city: "PARIS" } },
  { lat: 48.86912, lng: 2.35408, data: { drive: false, zip: 75002, city: "PARIS" } },
  { lat: 48.86889, lng: 2.36774, data: { drive: false, zip: 75010, city: "PARIS" } },
  { lat: 48.86493, lng: 2.3748, data: { drive: false, zip: 75011, city: "PARIS" } },
  { lat: 48.86328, lng: 2.33356, data: { drive: false, zip: 75001, city: "PARIS" } },
  { lat: 48.86085, lng: 2.34816, data: { drive: false, zip: 75001, city: "PARIS" } },
  { lat: 48.8592, lng: 2.346, data: { drive: false, zip: 75001, city: "PARIS" } },
  { lat: 48.88347, lng: 2.32782, data: { drive: false, zip: 75009, city: "PARIS" } },
  { lat: 48.88244, lng: 2.33784, data: { drive: false, zip: 75018, city: "PARIS" } },
  { lat: 48.85756, lng: 2.38052, data: { drive: false, zip: 75011, city: "PARIS" } },
  { lat: 48.85783, lng: 2.35159, data: { drive: false, zip: 75004, city: "PARIS" } },
  { lat: 48.8533, lng: 2.41056, data: { drive: false, zip: 75020, city: "PARIS" } },
  { lat: 48.85128, lng: 2.34368, data: { drive: false, zip: 75005, city: "PARIS" } },
  { lat: 48.84883, lng: 2.29764, data: { drive: false, zip: 75015, city: "PARIS" } },
  { lat: 48.84741, lng: 2.41095, data: { drive: false, zip: 75020, city: "PARIS" } },
  { lat: 48.84456, lng: 2.32456, data: { drive: false, zip: 75006, city: "PARIS" } },
  { lat: 48.83804, lng: 2.2577, data: { drive: false, zip: 75016, city: "PARIS" } },
  { lat: 48.83751, lng: 2.29565, data: { drive: false, zip: 75015, city: "PARIS" } },
  { lat: 48.83658, lng: 2.35109, data: { drive: false, zip: 75013, city: "PARIS" } },
  { lat: 48.83572, lng: 2.40603, data: { drive: false, zip: 75012, city: "PARIS" } },
  { lat: 48.83334, lng: 2.3316, data: { drive: false, zip: 75014, city: "PARIS" } },
  { lat: 48.82689, lng: 2.36655, data: { drive: false, zip: 75013, city: "PARIS" } },
  { lat: 48.82605, lng: 2.35726, data: { drive: false, zip: 75013, city: "PARIS" } },
  { lat: 48.93437, lng: 2.33282, data: { drive: false, zip: 92390, city: "VILLENEUVE-LA-GARENNE" } },
  { lat: 48.92315, lng: 2.25454, data: { drive: false, zip: 92700, city: "COLOMBES" } },
  { lat: 48.91072, lng: 2.23447, data: { drive: true, zip: 92700, city: "COLOMBES" } },
  { lat: 48.90288, lng: 2.30386, data: { drive: false, zip: 92110, city: "CLICHY" } },
  { lat: 48.90125, lng: 2.22537, data: { drive: true, zip: 92000, city: "NANTERRE" } },
  { lat: 48.89606, lng: 2.24884, data: { drive: false, zip: 92400, city: "COURBEVOIE" } },
  { lat: 48.89148, lng: 2.29092, data: { drive: false, zip: 92300, city: "LEVALLOIS-PERRET" } },
  { lat: 48.89108, lng: 2.23207, data: { drive: false, zip: 92800, city: "PUTEAUX" } },
  { lat: 48.88512, lng: 2.1951, data: { drive: true, zip: 92000, city: "NANTERRE" } },
  { lat: 48.88182, lng: 2.23904, data: { drive: false, zip: 92800, city: "PUTEAUX" } },
  { lat: 48.88134, lng: 2.27211, data: { drive: false, zip: 92200, city: "NEUILLY-SUR-SEINE" } },
  { lat: 48.8705, lng: 2.22708, data: { drive: false, zip: 92150, city: "SURESNES" } },
  { lat: 48.83383, lng: 2.24339, data: { drive: false, zip: 92100, city: "BOULOGNE-BILLANCOURT" } },
  { lat: 48.82697, lng: 2.2787, data: { drive: false, zip: 92130, city: "ISSY-LES-MOULINEAUX" } },
  { lat: 48.8243, lng: 2.29862, data: { drive: false, zip: 92170, city: "VANVES" } },
  { lat: 48.82224, lng: 2.20664, data: { drive: false, zip: 92310, city: "SÈVRES" } },
  { lat: 48.82085, lng: 2.25049, data: { drive: false, zip: 92130, city: "ISSY-LES-MOULINEAUX" } },
  { lat: 48.80793, lng: 2.29534, data: { drive: true, zip: 92320, city: "CHÂTILLON" } },
  { lat: 48.78709, lng: 2.25559, data: { drive: true, zip: 92140, city: "CLAMART" } },
  { lat: 48.91406, lng: 2.22959, data: { drive: false, zip: 92700, city: "COLOMBES" } },
  { lat: 48.93868, lng: 2.30433, data: { drive: false, zip: 92230, city: "GENNEVILLIERS" } },
  { lat: 48.86126, lng: 2.34792, data: { drive: false, zip: 75001, city: "PARIS" } },
  { lat: 48.75413, lng: 2.30133, data: { drive: false, zip: 92160, city: "ANTONY" } },
  { lat: 48.9317, lng: 2.28164, data: { drive: true, zip: 92600, city: "ASNIÈRES-SUR-SEINE" } },
  { lat: 48.87545, lng: 2.32846, data: { drive: false, zip: 75009, city: "PARIS" } },
  { lat: 48.85746, lng: 2.27758, data: { drive: false, zip: 75016, city: "PARIS" } },
  { lat: 48.82844, lng: 2.32741, data: { drive: false, zip: 75014, city: "PARIS" } },
  { lat: 48.86797, lng: 2.28143, data: { drive: false, zip: 75116, city: "PARIS" } },
  { lat: 48.847, lng: 2.28514, data: { drive: false, zip: 75015, city: "PARIS" } },
  { lat: 48.88388, lng: 2.47452, data: { drive: true, zip: 93110, city: "ROSNY-SOUS-BOIS" } },
  { lat: 48.86543, lng: 2.41724, data: { drive: false, zip: 93170, city: "BAGNOLET" } },
  { lat: 48.8513, lng: 2.3761, data: { drive: false, zip: 75012, city: "PARIS" } },
  { lat: 48.84877, lng: 2.57829, data: { drive: true, zip: 77420, city: "CHAMPS-SUR-MARNE" } },
  { lat: 48.82909, lng: 2.74287, data: { drive: false, zip: 77600, city: "BUSSY-SAINT-GEORGES" } },
  { lat: 48.77783, lng: 2.60701, data: { drive: false, zip: 77340, city: "PONTAULT-COMBAULT" } },
  { lat: 48.70231, lng: 2.59736, data: { drive: true, zip: 77170, city: "BRIE-COMTE-ROBERT" } },
  { lat: 48.87035, lng: 2.68225, data: { drive: true, zip: 77400, city: "LAGNY-SUR-MARNE" } },
  { lat: 48.99743, lng: 1.90877, data: { drive: true, zip: 78130, city: "LES MUREAUX" } },
  { lat: 48.98845, lng: 1.71233, data: { drive: false, zip: 78200, city: "MANTES-LA-JOLIE" } },
  { lat: 48.9801, lng: 1.69566, data: { drive: true, zip: 78711, city: "MANTES-LA-VILLE" } },
  { lat: 48.93822, lng: 2.17054, data: { drive: true, zip: 78500, city: "SARTROUVILLE" } },
  { lat: 48.92896, lng: 2.04337, data: { drive: false, zip: 78300, city: "POISSY" } },
  { lat: 48.90527, lng: 2.11544, data: { drive: true, zip: 78360, city: "MONTESSON" } },
  { lat: 48.89813, lng: 2.09442, data: { drive: false, zip: 78100, city: "SAINT-GERMAIN-EN-LAYE" } },
  { lat: 48.89754, lng: 2.08901, data: { drive: false, zip: 78100, city: "SAINT-GERMAIN-EN-LAYE" } },
  { lat: 48.85926, lng: 2.14864, data: { drive: false, zip: 78170, city: "LA CELLE-SAINT-CLOUD" } },
  { lat: 48.82707, lng: 2.11734, data: { drive: false, zip: 78150, city: "LE CHESNAY" } },
  { lat: 48.80057, lng: 2.12864, data: { drive: false, zip: 78000, city: "VERSAILLES" } },
  { lat: 48.79309, lng: 2.14364, data: { drive: false, zip: 78000, city: "VERSAILLES" } },
  { lat: 48.78257, lng: 2.04252, data: { drive: false, zip: 78180, city: "MONTIGNY-LE-BRETONNEUX" } },
  { lat: 48.77885, lng: 2.2082, data: { drive: true, zip: 78140, city: "VÉLIZY-VILLACOUBLAY" } },
  { lat: 48.76018, lng: 1.91805, data: { drive: true, zip: 78310, city: "MAUREPAS" } },
  { lat: 48.90958, lng: 2.03291, data: { drive: false, zip: 78240, city: "CHAMBOURCY" } },
  { lat: 49.02052, lng: 2.46554, data: { drive: true, zip: 95190, city: "GOUSSAINVILLE" } },
  { lat: 49.01884, lng: 2.09517, data: { drive: true, zip: 95610, city: "ÉRAGNY" } },
  { lat: 49.00025, lng: 2.39233, data: { drive: true, zip: 95400, city: "VILLIERS-LE-BEL" } },
  { lat: 48.99557, lng: 2.19194, data: { drive: true, zip: 95370, city: "MONTIGNY-LÈS-CORMEILLES" } },
  { lat: 48.99092, lng: 2.28967, data: { drive: false, zip: 95230, city: "SOISY-SOUS-MONTMORENCY" } },
  { lat: 48.97821, lng: 2.3768, data: { drive: false, zip: 95200, city: "SARCELLES" } },
  { lat: 48.9777, lng: 2.49891, data: { drive: true, zip: 95500, city: "GONESSE" } },
  { lat: 48.97047, lng: 2.30676, data: { drive: false, zip: 95880, city: "ENGHIEN-LES-BAINS" } },
  { lat: 48.9644, lng: 2.257, data: { drive: false, zip: 95110, city: "SANNOIS" } },
  { lat: 48.96159, lng: 2.40038, data: { drive: true, zip: 95140, city: "GARGES-LÈS-GONESSE" } },
  { lat: 48.94479, lng: 2.25198, data: { drive: false, zip: 95100, city: "ARGENTEUIL" } },
  { lat: 48.92288, lng: 2.21958, data: { drive: true, zip: 95870, city: "BEZONS" } },
  { lat: 49.02283, lng: 2.1413, data: { drive: true, zip: 95480, city: "PIERRELAYE" } },
  { lat: 48.97588, lng: 2.36529, data: { drive: true, zip: 95200, city: "SARCELLES" } },
  { lat: 48.72993, lng: 2.24129, data: { drive: true, zip: 91300, city: "MASSY" } },
  { lat: 48.71443, lng: 2.43924, data: { drive: false, zip: 91230, city: "MONTGERON" } },
  { lat: 48.69976, lng: 2.41693, data: { drive: true, zip: 91270, city: "VIGNEUX-SUR-SEINE" } },
  { lat: 48.67737, lng: 2.16734, data: { drive: false, zip: 91940, city: "LES ULIS" } },
  { lat: 48.67141, lng: 2.27707, data: { drive: true, zip: 91160, city: "SAULX-LES-CHARTREUX" } },
  { lat: 48.66971, lng: 2.39299, data: { drive: true, zip: 91350, city: "GRIGNY" } },
  { lat: 48.65127, lng: 2.27371, data: { drive: true, zip: 91310, city: "MONTLHÉRY" } },
  { lat: 48.63024, lng: 2.42802, data: { drive: true, zip: 91000, city: "ÉVRY" } },
  { lat: 48.63037, lng: 2.492, data: { drive: true, zip: 91250, city: "SAINT-GERMAIN-LÈS-CORBEIL" } },
  { lat: 48.61404, lng: 2.45613, data: { drive: true, zip: 91100, city: "CORBEIL-ESSONNES" } },
  { lat: 48.59452, lng: 2.44349, data: { drive: true, zip: 91100, city: "VILLABÉ" } },
  { lat: 48.66869, lng: 2.33784, data: { drive: true, zip: 91360, city: "ÉPINAY-SUR-ORGE" } },
  { lat: 48.82629, lng: 1.96407, data: { drive: true, zip: 78370, city: "PLAISIR" } },
  { lat: 48.84318, lng: 2.36413, data: { drive: false, zip: 75005, city: "PARIS" } },
  { lat: 48.84714, lng: 2.34075, data: { drive: false, zip: 75005, city: "PARIS" } },
  { lat: 48.87644, lng: 2.35586, data: { drive: false, zip: 75010, city: "PARIS" } },
  { lat: 49.41181, lng: 0.25174, data: { drive: true, zip: 14600, city: "LA RIVIÈRE-SAINT-SAUVEUR" } },
  { lat: 49.4737, lng: 1.11263, data: { drive: false, zip: 76230, city: "BOIS-GUILLAUME" } },
  { lat: 49.44202, lng: 1.09018, data: { drive: false, zip: 76000, city: "ROUEN" } },
  { lat: 49.4311, lng: 1.08635, data: { drive: false, zip: 76100, city: "ROUEN" } },
  { lat: 49.41436, lng: 1.04467, data: { drive: true, zip: 76120, city: "LE GRAND-QUEVILLY" } },
  { lat: 49.40847, lng: 1.14557, data: { drive: false, zip: 76240, city: "LE MESNIL-ESNARD" } },
  { lat: 47.87932, lng: 1.90859, data: { drive: true, zip: 45100, city: "ORLÉANS" } },
  { lat: 47.90645, lng: 1.90394, data: { drive: false, zip: 45000, city: "ORLÉANS" } },
  { lat: 47.28396, lng: -1.55241, data: { drive: true, zip: 44240, city: "LA CHAPELLE-SUR-ERDRE" } },
  { lat: 47.26103, lng: -1.58239, data: { drive: true, zip: 44300, city: "NANTES" } },
  { lat: 47.25693, lng: -1.51066, data: { drive: true, zip: 44300, city: "NANTES" } },
  { lat: 47.21379, lng: -1.55804, data: { drive: false, zip: 44000, city: "NANTES" } },
  { lat: 47.19756, lng: -1.61669, data: { drive: true, zip: 44100, city: "NANTES" } },
  { lat: 47.39644, lng: -0.52917, data: { drive: true, zip: 49610, city: "MÛRS-ERIGNÉ" } },
  { lat: 47.46989, lng: -0.54842, data: { drive: false, zip: 49100, city: "ANGERS" } },
  { lat: 47.45027, lng: -0.55598, data: { drive: true, zip: 49000, city: "ANGERS" } },
  { lat: 47.42584, lng: 0.70218, data: { drive: true, zip: 37100, city: "TOURS" } },
  { lat: 47.38962, lng: 0.6928, data: { drive: false, zip: 37000, city: "TOURS" } },
  { lat: 48.40519, lng: 0.08762, data: { drive: true, zip: 72610, city: "ARÇONNAY" } },
  { lat: 49.1466, lng: -0.33931, data: { drive: true, zip: 14123, city: "IFS" } },
  { lat: 49.16351, lng: -0.29704, data: { drive: true, zip: 14120, city: "MONDEVILLE" } },
  { lat: 49.20971, lng: -0.36198, data: { drive: true, zip: 14000, city: "CAEN" } },
  { lat: 49.18311, lng: -0.36157, data: { drive: false, zip: 14000, city: "CAEN" } },
  { lat: 49.20657, lng: -0.32572, data: { drive: false, zip: 14200, city: "HÉROUVILLE-SAINT-CLAIR" } },
  { lat: 48.39935, lng: -4.40702, data: { drive: true, zip: 29480, city: "LE RELECQ-KERHUON" } },
  { lat: 48.42647, lng: -4.57174, data: { drive: true, zip: 29820, city: "GUILERS" } },
  { lat: 48.41544, lng: -4.46825, data: { drive: true, zip: 29200, city: "BREST" } },
  { lat: 48.38801, lng: -4.52839, data: { drive: true, zip: 29200, city: "BREST" } },
  { lat: 48.39267, lng: -4.48221, data: { drive: false, zip: 29200, city: "BREST" } },
  { lat: 48.03644, lng: 0.1757, data: { drive: true, zip: 72650, city: "LA CHAPELLE-SAINT-AUBIN" } },
  { lat: 48.00412, lng: 0.19587, data: { drive: false, zip: 72000, city: "LE MANS" } },
  { lat: 44.77157, lng: -1.11411, data: { drive: true, zip: 33740, city: "ARÈS" } },
  { lat: 43.68956, lng: 4.2069, data: { drive: true, zip: 30470, city: "AIMARGUES" } },
  { lat: 44.91112, lng: -0.6245, data: { drive: true, zip: 33290, city: "BLANQUEFORT" } },
  { lat: 44.89244, lng: -0.66529, data: { drive: true, zip: 33320, city: "EYSINES" } },
  { lat: 44.86625, lng: -0.51428, data: { drive: true, zip: 33310, city: "LORMONT" } },
  { lat: 44.85368, lng: -0.59361, data: { drive: false, zip: 33110, city: "LE BOUSCAT" } },
  { lat: 44.842, lng: -0.55719, data: { drive: false, zip: 33100, city: "BORDEAUX" } },
  { lat: 44.82949, lng: -0.59558, data: { drive: true, zip: 33000, city: "BORDEAUX" } },
  { lat: 44.81414, lng: -0.57285, data: { drive: true, zip: 33800, city: "BORDEAUX" } },
  { lat: 45.77804, lng: 3.08178, data: { drive: false, zip: 63000, city: "CLERMONT-FERRAND" } },
  { lat: 45.74048, lng: 3.17328, data: { drive: true, zip: 63800, city: "COURNON-D'AUVERGNE" } },
  { lat: 45.77614, lng: 3.18608, data: { drive: true, zip: 63370, city: "LEMPDES" } },
  { lat: 43.64129, lng: 3.94293, data: { drive: true, zip: 34920, city: "LE CRÈS" } },
  { lat: 43.62186, lng: 3.81443, data: { drive: false, zip: 34080, city: "MONTPELLIER" } },
  { lat: 43.60865, lng: 3.87935, data: { drive: false, zip: 34000, city: "MONTPELLIER" } },
  { lat: 43.58907, lng: 3.85653, data: { drive: true, zip: 34070, city: "MONTPELLIER" } },
  { lat: 43.52062, lng: 1.49658, data: { drive: true, zip: 31320, city: "CASTANET-TOLOSAN" } },
  { lat: 43.56444, lng: 1.51494, data: { drive: true, zip: 31650, city: "SAINT-ORENS-DE-GAMEVILLE" } },
  { lat: 43.64576, lng: 1.47168, data: { drive: true, zip: 31240, city: "L'UNION" } },
  { lat: 43.60795, lng: 1.39494, data: { drive: true, zip: 31300, city: "TOULOUSE" } },
  { lat: 43.60487, lng: 1.44326, data: { drive: false, zip: 31000, city: "TOULOUSE" } },
  { lat: 43.58936, lng: 1.35926, data: { drive: true, zip: 31170, city: "TOURNEFEUILLE" } },
  { lat: 43.61313, lng: 1.33044, data: { drive: true, zip: 31770, city: "COLOMIERS" } },
  { lat: 43.6109, lng: 1.43643, data: { drive: false, zip: 31000, city: "TOULOUSE" } },
  { lat: 43.85682, lng: 4.40565, data: { drive: true, zip: 30900, city: "NÎMES" } },
  { lat: 42.71726, lng: 2.8876, data: { drive: true, zip: 66000, city: "PERPIGNAN" } },
  { lat: 43.318, lng: -0.42416, data: { drive: true, zip: 64140, city: "LONS" } },
  { lat: 45.87995, lng: 1.29063, data: { drive: true, zip: 87280, city: "LIMOGES" } },
  { lat: 45.84888, lng: 1.24516, data: { drive: false, zip: 87100, city: "LIMOGES" } },
  { lat: 45.81015, lng: 1.26002, data: { drive: false, zip: 87000, city: "LIMOGES" } },
  { lat: 43.51822, lng: 5.43421, data: { drive: true, zip: 13090, city: "AIX-EN-PROVENCE" } },
  { lat: 43.50479, lng: 5.39378, data: { drive: false, zip: 13290, city: "AIX-EN-PROVENCE" } },
  { lat: 43.44053, lng: 5.24325, data: { drive: false, zip: 13127, city: "VITROLLES" } },
  { lat: 43.43115, lng: 5.264, data: { drive: true, zip: 13127, city: "VITROLLES" } },
  { lat: 43.33113, lng: 5.38912, data: { drive: true, zip: 13014, city: "MARSEILLE" } },
  { lat: 43.30165, lng: 5.37477, data: { drive: false, zip: 13003, city: "MARSEILLE" } },
  { lat: 43.29421, lng: 5.37434, data: { drive: false, zip: 13001, city: "MARSEILLE" } },
  { lat: 43.29323, lng: 5.37849, data: { drive: false, zip: 13001, city: "MARSEILLE" } },
  { lat: 43.28696, lng: 5.38321, data: { drive: false, zip: 13006, city: "MARSEILLE" } },
  { lat: 43.24887, lng: 5.39094, data: { drive: false, zip: 13008, city: "MARSEILLE" } },
  { lat: 43.3038, lng: 5.38659, data: { drive: false, zip: 13001, city: "MARSEILLE" } },
  { lat: 43.48742, lng: 5.37842, data: { drive: false, zip: 13290, city: "AIX-EN-PROVENCE" } },
  { lat: 43.30302, lng: 5.40138, data: { drive: true, zip: 13004, city: "MARSEILLE" } },
  { lat: 45.77238, lng: 4.97641, data: { drive: true, zip: 69150, city: "DÉCINES-CHARPIEU" } },
  { lat: 45.76433, lng: 4.83426, data: { drive: false, zip: 69002, city: "LYON" } },
  { lat: 45.75281, lng: 4.82899, data: { drive: false, zip: 69002, city: "LYON" } },
  { lat: 45.74315, lng: 4.87811, data: { drive: false, zip: 69008, city: "LYON" } },
  { lat: 45.68471, lng: 4.94752, data: { drive: true, zip: 69800, city: "SAINT-PRIEST" } },
  { lat: 45.7582, lng: 4.83433, data: { drive: false, zip: 69002, city: "LYON" } },
  { lat: 45.74819, lng: 4.93192, data: { drive: true, zip: 69120, city: "VAULX-EN-VELIN" } },
  { lat: 45.75523, lng: 4.84282, data: { drive: false, zip: 69007, city: "LYON" } },
  { lat: 43.41939, lng: 5.22989, data: { drive: true, zip: 13730, city: "SAINT-VICTORET" } },
  { lat: 43.77513, lng: 7.50518, data: { drive: false, zip: 6500, city: "MENTON" } },
  { lat: 43.70545, lng: 7.2846, data: { drive: false, zip: 6300, city: "NICE" } },
  { lat: 43.7003, lng: 7.26831, data: { drive: false, zip: 6000, city: "NICE" } },
  { lat: 43.65347, lng: 7.15638, data: { drive: false, zip: 6800, city: "CAGNES-SUR-MER" } },
  { lat: 43.64529, lng: 6.94107, data: { drive: true, zip: 6130, city: "GRASSE" } },
  { lat: 43.57644, lng: 7.05642, data: { drive: true, zip: 6220, city: "VALLAURIS" } },
  { lat: 43.57408, lng: 7.09028, data: { drive: true, zip: 6160, city: "ANTIBES" } },
  { lat: 43.55089, lng: 6.95699, data: { drive: false, zip: 6150, city: "CANNES" } },
  { lat: 43.66216, lng: 7.13065, data: { drive: true, zip: 6800, city: "CAGNES-SUR-MER" } },
  { lat: 45.19641, lng: 5.67465, data: { drive: true, zip: 38600, city: "FONTAINE" } },
  { lat: 45.1903, lng: 5.72659, data: { drive: false, zip: 38000, city: "GRENOBLE" } },
  { lat: 45.14931, lng: 5.69424, data: { drive: true, zip: 38130, city: "ÉCHIROLLES" } },
  { lat: 45.15736, lng: 5.73375, data: { drive: false, zip: 38100, city: "GRENOBLE" } },
  { lat: 45.18462, lng: 5.7676, data: { drive: true, zip: 38400, city: "SAINT-MARTIN-D'HÈRES" } },
  { lat: 45.15025, lng: 5.71702, data: { drive: true, zip: 38130, city: "ÉCHIROLLES" } },
  { lat: 45.43618, lng: 4.38803, data: { drive: false, zip: 42000, city: "SAINT-ÉTIENNE" } },
  { lat: 45.42353, lng: 4.39379, data: { drive: false, zip: 42100, city: "SAINT-ÉTIENNE" } },
  { lat: 45.48132, lng: 4.44218, data: { drive: true, zip: 42290, city: "SORBIERS" } },
  { lat: 43.1227, lng: 5.88117, data: { drive: true, zip: 83190, city: "OLLIOULES" } },
  { lat: 43.10498, lng: 5.81715, data: { drive: true, zip: 83140, city: "SIX-FOURS-LES-PLAGES" } },
  { lat: 43.13913, lng: 6.0352, data: { drive: false, zip: 83130, city: "LA GARDE" } },
  { lat: 43.13774, lng: 6.02171, data: { drive: true, zip: 83130, city: "LA GARDE" } },
  { lat: 43.12102, lng: 5.94259, data: { drive: false, zip: 83000, city: "TOULON" } },
  { lat: 43.1194, lng: 6.12861, data: { drive: true, zip: 83400, city: "HYÈRES" } },
  { lat: 43.12503, lng: 5.93188, data: { drive: false, zip: 83000, city: "TOULON" } },
  { lat: 43.10874, lng: 5.85783, data: { drive: true, zip: 83500, city: "LA SEYNE-SUR-MER" } },
  { lat: 43.10896, lng: 6.03628, data: { drive: true, zip: 83220, city: "LE PRADET" } },
  { lat: 43.27084, lng: 5.40045, data: { drive: true, zip: 13009, city: "MARSEILLE" } },
  { lat: 45.76004, lng: 5.02856, data: { drive: true, zip: 69330, city: "MEYZIEU" } },
  { lat: 45.74909, lng: 4.86088, data: { drive: false, zip: 69008, city: "LYON" } },
  { lat: 45.75176, lng: 4.77025, data: { drive: true, zip: 69160, city: "TASSIN-LA-DEMI-LUNE" } },
  { lat: 45.72414, lng: 4.93567, data: { drive: true, zip: 69800, city: "SAINT-PRIEST" } },
  { lat: 46.91009, lng: 6.33372, data: { drive: true, zip: 25300, city: "PONTARLIER" } },
  { lat: 50.73893, lng: 3.14759, data: { drive: true, zip: 59200, city: "TOURCOING" } },
  { lat: 50.72609, lng: 3.13375, data: { drive: true, zip: 59200, city: "TOURCOING" } },
  { lat: 50.68214, lng: 3.21482, data: { drive: true, zip: 59390, city: "LYS-LEZ-LANNOY" } },
  { lat: 50.66946, lng: 3.1546, data: { drive: true, zip: 59170, city: "CROIX" } },
  { lat: 50.66523, lng: 3.07593, data: { drive: false, zip: 59700, city: "MARCQ-EN-BAROEUL" } },
  { lat: 50.63701, lng: 3.06287, data: { drive: false, zip: 59000, city: "LILLE" } },
  { lat: 50.63575, lng: 3.0703, data: { drive: false, zip: 59000, city: "LILLE" } },
  { lat: 50.63265, lng: 3.06234, data: { drive: false, zip: 59000, city: "LILLE" } },
  { lat: 50.61884, lng: 3.03446, data: { drive: true, zip: 59000, city: "LILLE" } },
  { lat: 50.61702, lng: 3.12719, data: { drive: true, zip: 59650, city: "VILLENEUVE-D'ASCQ" } },
  { lat: 50.59705, lng: 3.05114, data: { drive: true, zip: 59139, city: "WATTIGNIES" } },
  { lat: 50.54859, lng: 3.04976, data: { drive: true, zip: 59113, city: "SECLIN" } },
  { lat: 50.72305, lng: 3.15847, data: { drive: false, zip: 59200, city: "TOURCOING" } },
  { lat: 50.65121, lng: 2.98407, data: { drive: true, zip: 59160, city: "LILLE" } },
  { lat: 48.6311, lng: 7.76446, data: { drive: false, zip: 67800, city: "HOENHEIM" } },
  { lat: 48.59165, lng: 7.67184, data: { drive: true, zip: 67202, city: "WOLFISHEIM" } },
  { lat: 48.58771, lng: 7.74123, data: { drive: false, zip: 67000, city: "STRASBOURG" } },
  { lat: 48.58443, lng: 7.73639, data: { drive: false, zip: 67000, city: "STRASBOURG" } },
  { lat: 48.5831, lng: 7.74694, data: { drive: false, zip: 67000, city: "STRASBOURG" } },
  { lat: 48.56168, lng: 7.75217, data: { drive: false, zip: 67100, city: "STRASBOURG" } },
  { lat: 48.52916, lng: 7.73188, data: { drive: true, zip: 67400, city: "ILLKIRCH-GRAFFENSTADEN" } },
  { lat: 50.38203, lng: 3.47714, data: { drive: true, zip: 59494, city: "PETITE-FORÊT" } },
  { lat: 50.36454, lng: 3.52201, data: { drive: true, zip: 59300, city: "VALENCIENNES" } },
  { lat: 50.32622, lng: 3.3878, data: { drive: true, zip: 59220, city: "DENAIN" } },
  { lat: 47.7753, lng: 7.39056, data: { drive: true, zip: 68390, city: "SAUSHEIM" } },
  { lat: 47.75106, lng: 7.33824, data: { drive: false, zip: 68200, city: "MULHOUSE" } },
  { lat: 47.74827, lng: 7.33908, data: { drive: false, zip: 68100, city: "MULHOUSE" } },
  { lat: 47.73373, lng: 7.31693, data: { drive: true, zip: 68200, city: "MULHOUSE" } },
  { lat: 47.78963, lng: 7.31713, data: { drive: true, zip: 68260, city: "KINGERSHEIM" } },
  { lat: 48.70113, lng: 6.22409, data: { drive: true, zip: 54270, city: "ESSEY-LÈS-NANCY" } },
  { lat: 48.68996, lng: 6.18311, data: { drive: false, zip: 54000, city: "NANCY" } },
  { lat: 48.67955, lng: 6.19864, data: { drive: true, zip: 54000, city: "NANCY" } },
  { lat: 48.66614, lng: 6.16584, data: { drive: true, zip: 54500, city: "VANDOEUVRE-LÈS-NANCY" } },
  { lat: 47.28046, lng: 5.01658, data: { drive: true, zip: 21160, city: "MARSANNAY-LA-CÔTE" } },
  { lat: 47.31325, lng: 5.09206, data: { drive: true, zip: 21800, city: "QUETIGNY" } },
  { lat: 47.32242, lng: 5.03715, data: { drive: false, zip: 21000, city: "DIJON" } },
  { lat: 47.31505, lng: 5.0642, data: { drive: false, zip: 21000, city: "DIJON" } },
  { lat: 49.2167, lng: 4.0508, data: { drive: true, zip: 51350, city: "CORMONTREUIL" } },
  { lat: 49.27775, lng: 4.0042, data: { drive: true, zip: 51100, city: "REIMS" } },
  { lat: 49.25368, lng: 3.97969, data: { drive: true, zip: 51430, city: "TINQUEUX" } },
  { lat: 49.26532, lng: 4.06005, data: { drive: true, zip: 51100, city: "REIMS" } },
  { lat: 49.25418, lng: 4.03032, data: { drive: false, zip: 51100, city: "REIMS" } },
  { lat: 49.23996, lng: 4.01363, data: { drive: true, zip: 51100, city: "REIMS" } },
  { lat: 49.11859, lng: 6.17494, data: { drive: false, zip: 57000, city: "METZ" } },
  { lat: 49.11473, lng: 6.17326, data: { drive: false, zip: 57000, city: "METZ" } },
  { lat: 49.10777, lng: 6.22552, data: { drive: true, zip: 57070, city: "METZ" } },
  { lat: 51.0324, lng: 2.39443, data: { drive: true, zip: 59240, city: "DUNKERQUE" } },
  { lat: 51.02282, lng: 2.31159, data: { drive: true, zip: 59760, city: "GRANDE-SYNTHE" } },
  { lat: 49.90688, lng: 2.31848, data: { drive: true, zip: 80080, city: "AMIENS" } },
  { lat: 49.35822, lng: 6.13877, data: { drive: true, zip: 57100, city: "THIONVILLE" } },
  { lat: 49.35506, lng: 6.13948, data: { drive: false, zip: 57100, city: "THIONVILLE" } },
  { lat: 50.3803, lng: 3.08867, data: { drive: false, zip: 59500, city: "DOUAI" } },
  { lat: 50.52133, lng: 2.79394, data: { drive: true, zip: 62138, city: "AUCHY-LES-MINES" } },
  { lat: 50.46319, lng: 2.82753, data: { drive: true, zip: 62880, city: "VENDIN-LE-VIEIL" } },
  { lat: 50.41626, lng: 2.97705, data: { drive: true, zip: 62950, city: "NOYELLES-GODAULT" } },
  { lat: 50.42277, lng: 2.77774, data: { drive: true, zip: 62800, city: "LIÉVIN" } },
  { lat: 48.87672, lng: 2.60237, data: { drive: true, zip: 77500, city: "CHELLES" } },
  { lat: 48.86453, lng: 2.40831, data: { drive: false, zip: 75020, city: "PARIS" } },
  { lat: 48.90676, lng: 2.28535, data: { drive: false, zip: 92600, city: "ASNIÈRES-SUR-SEINE" } },
  { lat: 49.01522, lng: 2.54222, data: { drive: false, zip: 77990, city: "MAUREGARD" } },
  { lat: 49.49603, lng: 0.11066, data: { drive: false, zip: 76600, city: "LE HAVRE" } },
  { lat: 47.25907, lng: -2.2639, data: { drive: true, zip: 44600, city: "SAINT-NAZAIRE" } },
  { lat: 47.90554, lng: 1.86524, data: { drive: true, zip: 45140, city: "SAINT-JEAN-DE-LA-RUELLE" } },
  { lat: 47.85124, lng: 1.91295, data: { drive: false, zip: 45160, city: "OLIVET" } },
  { lat: 47.52014, lng: -0.6121, data: { drive: true, zip: 49240, city: "AVRILLÉ" } },
  { lat: 47.86821, lng: -3.58399, data: { drive: true, zip: 29300, city: "QUIMPERLÉ" } },
  { lat: 47.29273, lng: -2.20865, data: { drive: true, zip: 44570, city: "TRIGNAC" } },
  { lat: 49.45882, lng: 1.04474, data: { drive: false, zip: 76380, city: "CANTELEU" } },
  { lat: 43.56793, lng: 1.39254, data: { drive: true, zip: 31100, city: "TOULOUSE" } },
  { lat: 44.90711, lng: -0.48894, data: { drive: false, zip: 33560, city: "SAINTE-EULALIE" } },
  { lat: 47.77714, lng: -3.34227, data: { drive: true, zip: 56600, city: "LANESTER" } },
  { lat: 47.74812, lng: -3.36441, data: { drive: false, zip: 56100, city: "LORIENT" } },
  { lat: 49.26289, lng: 6.17279, data: { drive: true, zip: 57300, city: "MONDELANGE" } },
  { lat: 49.24619, lng: 6.13644, data: { drive: false, zip: 57360, city: "AMNÉVILLE" } },
  { lat: 49.86683, lng: 2.37797, data: { drive: false, zip: 80440, city: "GLISY" } },
  { lat: 49.30455, lng: 6.12184, data: { drive: false, zip: 57290, city: "FAMECK" } },
  { lat: 47.81814, lng: 6.39622, data: { drive: true, zip: 70300, city: "FROIDECONCHE" } },
  { lat: 46.8602, lng: 3.16237, data: { drive: false, zip: 58470, city: "MAGNY-COURS" } },
  { lat: 49.08122, lng: 6.1098, data: { drive: true, zip: 57685, city: "AUGNY" } },
  { lat: 47.79406, lng: 7.17179, data: { drive: true, zip: 68700, city: "CERNAY" } },
  { lat: 49.09736, lng: 2.73929, data: { drive: true, zip: 60330, city: "LAGNY-LE-SEC" } },
  { lat: 45.87687, lng: 6.08905, data: { drive: true, zip: 74600, city: "SEYNOD" } },
  { lat: 45.72635, lng: 4.83767, data: { drive: true, zip: 69007, city: "LYON" } },
  { lat: 45.79809, lng: 4.85099, data: { drive: true, zip: 69300, city: "CALUIRE-ET-CUIRE" } },
  { lat: 45.77038, lng: 4.86273, data: { drive: false, zip: 69100, city: "VILLEURBANNE" } },
  { lat: 45.76288, lng: 4.913, data: { drive: true, zip: 69100, city: "VILLEURBANNE" } },
  { lat: 45.76203, lng: 4.85305, data: { drive: false, zip: 69003, city: "LYON" } },
  { lat: 45.18323, lng: 5.71765, data: { drive: false, zip: 38000, city: "GRENOBLE" } },
  { lat: 43.94666, lng: 4.80573, data: { drive: false, zip: 84000, city: "AVIGNON" } },
  { lat: 43.92263, lng: 4.85849, data: { drive: true, zip: 84140, city: "AVIGNON" } },
  { lat: 43.88799, lng: 4.85216, data: { drive: true, zip: 13160, city: "CHÂTEAURENARD" } },
  { lat: 43.97915, lng: 4.87833, data: { drive: true, zip: 84130, city: "LE PONTET" } },
  { lat: 45.26952, lng: 6.36592, data: { drive: true, zip: 73300, city: "SAINT-JEAN-DE-MAURIENNE" } },
  { lat: 45.76402, lng: 4.76885, data: { drive: true, zip: 69160, city: "TASSIN-LA-DEMI-LUNE" } },
  { lat: 45.80191, lng: 4.78513, data: { drive: true, zip: 69410, city: "CHAMPAGNE-AU-MONT-D'OR" } },
  { lat: 46.64647, lng: 0.36287, data: { drive: true, zip: 86360, city: "CHASSENEUIL-DU-POITOU" } },
  { lat: 46.57244, lng: 0.37128, data: { drive: true, zip: 86000, city: "POITIERS" } },
  { lat: 47.48709, lng: 6.84365, data: { drive: true, zip: 25400, city: "AUDINCOURT" } },
  { lat: 47.5035, lng: 6.81362, data: { drive: true, zip: 25200, city: "MONTBÉLIARD" } },
  { lat: 44.95954, lng: 4.884, data: { drive: true, zip: 26500, city: "BOURG-LÈS-VALENCE" } },
  { lat: 44.92958, lng: 4.89094, data: { drive: false, zip: 26000, city: "VALENCE" } },
  { lat: 44.93919, lng: 4.86454, data: { drive: true, zip: 7500, city: "GUILHERAND-GRANGES" } },
  { lat: 43.29334, lng: 5.56373, data: { drive: true, zip: 13400, city: "AUBAGNE" } },
  { lat: 45.72236, lng: 4.92014, data: { drive: true, zip: 69500, city: "BRON" } },
  { lat: 45.44064, lng: 4.33875, data: { drive: true, zip: 42530, city: "SAINT-GENEST-LERPT" } },
  { lat: 45.73016, lng: 4.98583, data: { drive: false, zip: 69740, city: "GENAS" } },
  { lat: 45.95227, lng: 6.62943, data: { drive: true, zip: 74700, city: "SALLANCHES" } },
  { lat: 43.82033, lng: 5.79471, data: { drive: true, zip: 4100, city: "MANOSQUE" } },
  { lat: 44.07715, lng: 6.18663, data: { drive: true, zip: 4000, city: "DIGNE-LES-BAINS" } },
  { lat: 45.78931, lng: 4.77706, data: { drive: false, zip: 69130, city: "ÉCULLY" } },
  { lat: 45.89514, lng: 4.82127, data: { drive: true, zip: 69730, city: "GENAY" } },
  { lat: 43.68185, lng: 5.50136, data: { drive: true, zip: 84120, city: "PERTUIS" } },
  { lat: 50.94238, lng: 1.8074, data: { drive: true, zip: 62231, city: "COQUELLES" } },
  { lat: 47.2763, lng: 5.99205, data: { drive: true, zip: 25480, city: "ÉCOLE-VALENTIN" } },
  { lat: 48.29733, lng: 4.13428, data: { drive: true, zip: 10410, city: "SAINT-PARRES-AUX-TERTRES" } },
  { lat: 48.9169, lng: 2.41718, data: { drive: true, zip: 93000, city: "BOBIGNY" } },
  { lat: 48.77964, lng: 2.45692, data: { drive: false, zip: 94000, city: "CRÉTEIL" } },
  { lat: 48.86478, lng: 2.39798, data: { drive: false, zip: 75020, city: "PARIS" } },
  { lat: 48.9288, lng: 2.55562, data: { drive: true, zip: 93190, city: "LIVRY-GARGAN" } },
  { lat: 48.92591, lng: 2.29182, data: { drive: false, zip: 92230, city: "GENNEVILLIERS" } },
  { lat: 48.76736, lng: 2.48538, data: { drive: true, zip: 94380, city: "BONNEUIL-SUR-MARNE" } },
  { lat: 48.85402, lng: 2.36989, data: { drive: false, zip: 75011, city: "PARIS" } },
  { lat: 48.8672, lng: 2.38268, data: { drive: false, zip: 75011, city: "PARIS" } },
  { lat: 48.88932, lng: 2.3749, data: { drive: false, zip: 75019, city: "PARIS" } },
  { lat: 48.76281, lng: 2.36822, data: { drive: true, zip: 94550, city: "CHEVILLY-LARUE" } },
  { lat: 48.95419, lng: 2.56219, data: { drive: true, zip: 93420, city: "VILLEPINTE" } },
  { lat: 48.70937, lng: 2.37138, data: { drive: true, zip: 91200, city: "ATHIS-MONS" } },
  { lat: 48.52304, lng: 2.65319, data: { drive: true, zip: 77190, city: "DAMMARIE-LES-LYS" } },
  { lat: 48.27736, lng: 2.68479, data: { drive: true, zip: 77140, city: "SAINT-PIERRE-LÈS-NEMOURS" } },
  { lat: 49.04233, lng: 2.33891, data: { drive: true, zip: 95570, city: "MOISSELLES" } },
  { lat: 48.58795, lng: 2.30319, data: { drive: true, zip: 91220, city: "BRÉTIGNY-SUR-ORGE" } },
  { lat: 49.0424, lng: 2.07204, data: { drive: true, zip: 95000, city: "CERGY" } },
  { lat: 49.0084, lng: 2.35116, data: { drive: true, zip: 95350, city: "SAINT-BRICE-SOUS-FORÊT" } },
  { lat: 49.05496, lng: 2.02457, data: { drive: true, zip: 95650, city: "PUISEUX-PONTOISE" } },
  { lat: 48.92126, lng: 2.36359, data: { drive: true, zip: 93210, city: "SAINT-DENIS" } },
  { lat: 48.78543, lng: 2.43605, data: { drive: true, zip: 94000, city: "CRÉTEIL" } },
  { lat: 48.69284, lng: 2.33834, data: { drive: true, zip: 91420, city: "MORANGIS" } },
  { lat: 43.60605, lng: 3.14947, data: { drive: true, zip: 34600, city: "BÉDARIEUX" } },
  { lat: 48.27327, lng: 4.08753, data: { drive: true, zip: 10800, city: "SAINT-JULIEN-LES-VILLAS" } },
  { lat: 46.07347, lng: 6.40865, data: { drive: true, zip: 74130, city: "BONNEVILLE" } },
  { lat: 46.06689, lng: 6.55505, data: { drive: true, zip: 74950, city: "SCIONZIER" } },
  { lat: 45.92332, lng: 6.87133, data: { drive: false, zip: 74400, city: "CHAMONIX-MONT-BLANC" } },
  { lat: 45.59364, lng: 4.08286, data: { drive: true, zip: 42600, city: "MONTBRISON" } },
  { lat: 44.90373, lng: 6.62808, data: { drive: true, zip: 5100, city: "BRIANÇON" } },
  { lat: 45.96881, lng: 5.35371, data: { drive: true, zip: 1500, city: "AMBÉRIEU-EN-BUGEY" } },
  { lat: 45.56817, lng: 5.42898, data: { drive: true, zip: 38110, city: "SAINT-JEAN-DE-SOUDAIN" } },
  { lat: 43.88721, lng: 5.3673, data: { drive: false, zip: 84400, city: "GARGAS" } },
  { lat: 50.27437, lng: 3.96818, data: { drive: false, zip: 59600, city: "MAUBEUGE" } },
  { lat: 51.0326, lng: 2.37063, data: { drive: false, zip: 59140, city: "DUNKERQUE" } },
  { lat: 50.34192, lng: 3.09846, data: { drive: true, zip: 59450, city: "SIN-LE-NOBLE" } },
  { lat: 50.50912, lng: 1.6311, data: { drive: true, zip: 62780, city: "CUCQ" } },
  { lat: 50.39751, lng: 3.04595, data: { drive: false, zip: 59128, city: "FLERS-EN-ESCREBIEUX" } },
  { lat: 49.45191, lng: 2.09792, data: { drive: true, zip: 60000, city: "BEAUVAIS" } },
  { lat: 48.12855, lng: 7.36371, data: { drive: true, zip: 68125, city: "HOUSSEN" } },
  { lat: 45.29542, lng: 5.62915, data: { drive: true, zip: 38340, city: "VOREPPE" } },
  { lat: 45.05307, lng: 4.83659, data: { drive: true, zip: 7300, city: "TOURNON-SUR-RHÔNE" } },
  { lat: 45.25498, lng: 4.6888, data: { drive: true, zip: 7430, city: "DAVÉZIEUX" } },
  { lat: 45.34073, lng: 4.80551, data: { drive: true, zip: 38150, city: "SALAISE-SUR-SANNE" } },
  { lat: 43.2941, lng: 5.48277, data: { drive: false, zip: 13011, city: "MARSEILLE" } },
  { lat: 45.89024, lng: 4.44463, data: { drive: true, zip: 69170, city: "TARARE" } },
  { lat: 44.61649, lng: 4.40454, data: { drive: true, zip: 7200, city: "AUBENAS" } },
  { lat: 45.85796, lng: 5.94438, data: { drive: true, zip: 74150, city: "RUMILLY" } },
  { lat: 45.68023, lng: 4.79356, data: { drive: false, zip: 69230, city: "SAINT-GENIS-LAVAL" } },
  { lat: 45.66483, lng: 6.39016, data: { drive: true, zip: 73200, city: "ALBERTVILLE" } },
  { lat: 45.7125, lng: 4.87961, data: { drive: true, zip: 69200, city: "VÉNISSIEUX" } },
  { lat: 45.93325, lng: 6.08233, data: { drive: true, zip: 74330, city: "ÉPAGNY" } },
  { lat: 48.85474, lng: 2.78266, data: { drive: false, zip: 77700, city: "SERRIS" } },
  { lat: 48.85474, lng: 2.78266, data: { drive: true, zip: 77700, city: "SERRIS" } },
  { lat: 49.08927, lng: 2.556, data: { drive: true, zip: 95470, city: "SAINT-WITZ" } },
  { lat: 48.79919, lng: 2.03486, data: { drive: true, zip: 78390, city: "BOIS-D'ARCY" } },
  { lat: 48.50074, lng: 2.5831, data: { drive: false, zip: 77190, city: "VILLIERS-EN-BIÈRE" } },
  { lat: 48.80545, lng: 2.53463, data: { drive: true, zip: 94430, city: "CHENNEVIÈRES-SUR-MARNE" } },
  { lat: 48.71569, lng: 2.29953, data: { drive: true, zip: 91380, city: "CHILLY-MAZARIN" } },
  { lat: 48.7039, lng: 2.25326, data: { drive: true, zip: 91140, city: "VILLEBON-SUR-YVETTE" } },
  { lat: 48.81966, lng: 2.39613, data: { drive: false, zip: 94200, city: "IVRY-SUR-SEINE" } },
  { lat: 48.79222, lng: 2.32033, data: { drive: true, zip: 94230, city: "CACHAN" } },
  { lat: 48.93052, lng: 2.48295, data: { drive: false, zip: 93600, city: "AULNAY-SOUS-BOIS" } },
  { lat: 48.8308, lng: 2.35655, data: { drive: false, zip: 75013, city: "PARIS" } },
  { lat: 48.92513, lng: 1.99394, data: { drive: true, zip: 78630, city: "ORGEVAL" } },
  { lat: 48.72346, lng: 2.27654, data: { drive: false, zip: 91300, city: "MASSY" } },
  { lat: 48.84189, lng: 2.54323, data: { drive: false, zip: 93160, city: "NOISY-LE-GRAND" } },
  { lat: 48.84189, lng: 2.54323, data: { drive: false, zip: 93160, city: "NOISY-LE-GRAND" } },
  { lat: 48.62366, lng: 2.37018, data: { drive: true, zip: 91700, city: "FLEURY-MÉROGIS" } },
  { lat: 48.94805, lng: 2.20626, data: { drive: true, zip: 95100, city: "ARGENTEUIL" } },
  { lat: 48.83424, lng: 2.64132, data: { drive: true, zip: 77185, city: "LOGNES" } },
  { lat: 48.94637, lng: 2.62477, data: { drive: true, zip: 77270, city: "VILLEPARISIS" } },
  { lat: 48.78358, lng: 2.04027, data: { drive: false, zip: 78180, city: "MONTIGNY-LE-BRETONNEUX" } },
  { lat: 48.98972, lng: 1.74858, data: { drive: true, zip: 78520, city: "LIMAY" } },
  { lat: 48.89073, lng: 2.23641, data: { drive: false, zip: 92800, city: "PUTEAUX" } },
  { lat: 48.94712, lng: 2.3754, data: { drive: true, zip: 93240, city: "STAINS" } },
  { lat: 48.84213, lng: 2.65642, data: { drive: false, zip: 77200, city: "TORCY" } },
  { lat: 48.92845, lng: 2.14389, data: { drive: false, zip: 78360, city: "MONTESSON" } },
  { lat: 48.70206, lng: 2.10638, data: { drive: true, zip: 91190, city: "GIF-SUR-YVETTE" } },
  { lat: 48.66154, lng: 2.375, data: { drive: true, zip: 91170, city: "VIRY-CHÂTILLON" } },
  { lat: 48.90593, lng: 2.44569, data: { drive: false, zip: 93000, city: "BOBIGNY" } },
  { lat: 48.90463, lng: 2.54935, data: { drive: true, zip: 93390, city: "CLICHY-SOUS-BOIS" } },
  { lat: 48.99053, lng: 2.43252, data: { drive: true, zip: 95500, city: "GONESSE" } },
  { lat: 49.01511, lng: 2.21916, data: { drive: false, zip: 95150, city: "TAVERNY" } },
  { lat: 49.0372, lng: 2.07961, data: { drive: false, zip: 95000, city: "CERGY" } },
  { lat: 49.0372, lng: 2.07961, data: { drive: false, zip: 95000, city: "CERGY" } },
  { lat: 48.56828, lng: 2.2316, data: { drive: true, zip: 91630, city: "AVRAINVILLE" } },
  { lat: 49.03583, lng: 2.12116, data: { drive: true, zip: 95310, city: "SAINT-OUEN-L'AUMÔNE" } },
  { lat: 48.55705, lng: 2.63757, data: { drive: true, zip: 77000, city: "MELUN" } },
  { lat: 48.42374, lng: 2.73924, data: { drive: true, zip: 77210, city: "AVON" } },
  { lat: 48.68305, lng: 2.2056, data: { drive: true, zip: 91140, city: "VILLEJUST" } },
  { lat: 48.94292, lng: 2.02919, data: { drive: true, zip: 78955, city: "CARRIÈRES-SOUS-POISSY" } },
  { lat: 48.98858, lng: 2.07337, data: { drive: true, zip: 78700, city: "CONFLANS-SAINTE-HONORINE" } },
  { lat: 48.96757, lng: 1.86702, data: { drive: true, zip: 78410, city: "FLINS-SUR-SEINE" } },
  { lat: 43.46623, lng: 5.46506, data: { drive: false, zip: 13120, city: "GARDANNE" } },
  { lat: 43.42801, lng: 6.73637, data: { drive: true, zip: 83600, city: "FRÉJUS" } },
  { lat: 45.85658, lng: 4.70258, data: { drive: true, zip: 69380, city: "CIVRIEUX-D'AZERGUES" } },
  { lat: 44.75962, lng: 4.83657, data: { drive: true, zip: 26270, city: "LORIOL-SUR-DRÔME" } },
  { lat: 44.28927, lng: 4.75142, data: { drive: true, zip: 84500, city: "BOLLÈNE" } },
  { lat: 44.32202, lng: 4.74402, data: { drive: false, zip: 84500, city: "BOLLÈNE" } },
  { lat: 44.36858, lng: 4.69324, data: { drive: true, zip: 26700, city: "PIERRELATTE" } },
  { lat: 45.7345, lng: 4.77316, data: { drive: false, zip: 69340, city: "FRANCHEVILLE" } },
  { lat: 43.72826, lng: 7.18795, data: { drive: false, zip: 6200, city: "NICE" } },
  { lat: 45.81739, lng: 4.88928, data: { drive: true, zip: 69140, city: "RILLIEUX-LA-PAPE" } },
  { lat: 43.59989, lng: 7.08675, data: { drive: true, zip: 6600, city: "ANTIBES" } },
  { lat: 43.98247, lng: 4.86059, data: { drive: true, zip: 84130, city: "LE PONTET" } },
  { lat: 43.60348, lng: 7.09004, data: { drive: false, zip: 6600, city: "ANTIBES" } },
  { lat: 45.58473, lng: 4.7519, data: { drive: false, zip: 69700, city: "GIVORS" } },
  { lat: 43.9396, lng: 4.83777, data: { drive: true, zip: 84000, city: "AVIGNON" } },
  { lat: 50.45639, lng: 3.59168, data: { drive: true, zip: 59163, city: "CONDÉ-SUR-L'ESCAUT" } },
  { lat: 50.64157, lng: 3.07165, data: { drive: true, zip: 59000, city: "LILLE" } },
  { lat: 49.06726, lng: 6.14455, data: { drive: true, zip: 57155, city: "MARLY" } },
  { lat: 49.23006, lng: 2.89699, data: { drive: true, zip: 60800, city: "CRÉPY-EN-VALOIS" } },
  { lat: 50.47434, lng: 2.67806, data: { drive: true, zip: 62290, city: "NOEUX-LES-MINES" } },
  { lat: 47.62682, lng: 6.17059, data: { drive: true, zip: 70000, city: "VESOUL" } },
  { lat: 47.43535, lng: 5.60162, data: { drive: true, zip: 70100, city: "GRAY" } },
  { lat: 49.38276, lng: 2.40185, data: { drive: true, zip: 60600, city: "CLERMONT" } },
  { lat: 48.77563, lng: 5.16322, data: { drive: true, zip: 55000, city: "BAR-LE-DUC" } },
  { lat: 48.72931, lng: 4.58894, data: { drive: true, zip: 51300, city: "VITRY-LE-FRANÇOIS" } },
  { lat: 49.52009, lng: 4.37387, data: { drive: true, zip: 8300, city: "RETHEL" } },
  { lat: 46.66901, lng: 5.54928, data: { drive: true, zip: 39000, city: "LONS-LE-SAUNIER" } },
  { lat: 48.62275, lng: 2.56305, data: { drive: true, zip: 77550, city: "MOISSY-CRAMAYEL" } },
  { lat: 48.55438, lng: 2.67123, data: { drive: true, zip: 77950, city: "RUBELLES" } },
  { lat: 48.94153, lng: 2.87982, data: { drive: true, zip: 77100, city: "NANTEUIL-LÈS-MEAUX" } },
  { lat: 48.58638, lng: 2.59723, data: { drive: true, zip: 77240, city: "CESSON" } },
  { lat: 48.4336, lng: 2.17059, data: { drive: true, zip: 91150, city: "ÉTAMPES" } },
  { lat: 45.64835, lng: 0.15988, data: { drive: false, zip: 16000, city: "ANGOULÊME" } },
  { lat: 45.63322, lng: 0.21283, data: { drive: true, zip: 16800, city: "SOYAUX" } },
  { lat: 43.55459, lng: 1.46735, data: { drive: true, zip: 31400, city: "TOULOUSE" } },
  { lat: 47.36544, lng: 0.67565, data: { drive: true, zip: 37200, city: "TOURS" } },
  { lat: 47.67021, lng: -2.06799, data: { drive: true, zip: 35600, city: "REDON" } },
  { lat: 45.82105, lng: 4.99077, data: { drive: true, zip: 1700, city: "BEYNOST" } },
  { lat: 43.51045, lng: 6.47858, data: { drive: true, zip: 83720, city: "TRANS-EN-PROVENCE" } },
  { lat: 46.1062, lng: 4.75145, data: { drive: true, zip: 69220, city: "BELLEVILLE" } },
  { lat: 45.03806, lng: 5.05659, data: { drive: false, zip: 26300, city: "BOURG-DE-PÉAGE" } },
  { lat: 49.08896, lng: 0.60361, data: { drive: true, zip: 27300, city: "BERNAY" } },
  { lat: 48.21658, lng: -4.05027, data: { drive: true, zip: 29150, city: "CHÂTEAULIN" } },
  { lat: 48.11382, lng: -1.6201, data: { drive: true, zip: 35510, city: "CESSON-SÉVIGNÉ" } },
  { lat: 48.13208, lng: -1.68996, data: { drive: true, zip: 35000, city: "RENNES" } },
  { lat: 48.08229, lng: -1.67993, data: { drive: false, zip: 35200, city: "RENNES" } },
  { lat: 48.10458, lng: -1.68026, data: { drive: false, zip: 35000, city: "RENNES" } },
  { lat: 45.13021, lng: -0.64566, data: { drive: true, zip: 33390, city: "SAINT-MARTIN-LACAUSSADE" } },
  { lat: 44.99593, lng: -0.44525, data: { drive: true, zip: 33240, city: "SAINT-ANDRÉ-DE-CUBZAC" } },
  { lat: 43.53382, lng: 1.40109, data: { drive: true, zip: 31120, city: "PORTET-SUR-GARONNE" } },
  { lat: 43.55006, lng: 1.41845, data: { drive: true, zip: 31100, city: "TOULOUSE" } },
  { lat: 43.48271, lng: -1.50295, data: { drive: true, zip: 64100, city: "BAYONNE" } },
  { lat: 45.78808, lng: 3.1051, data: { drive: false, zip: 63100, city: "CLERMONT-FERRAND" } },
  { lat: 43.5858, lng: 3.88881, data: { drive: true, zip: 34070, city: "MONTPELLIER" } },
  { lat: 44.87018, lng: -0.56566, data: { drive: true, zip: 33300, city: "BORDEAUX" } },
  { lat: 43.60268, lng: 3.91583, data: { drive: true, zip: 34000, city: "MONTPELLIER" } },
  { lat: 45.83002, lng: -1.11934, data: { drive: true, zip: 17320, city: "MARENNES" } },
  { lat: 45.88935, lng: 3.07427, data: { drive: true, zip: 63200, city: "MOZAC" } },
  { lat: 43.65984, lng: 3.90405, data: { drive: true, zip: 34830, city: "JACOU" } },
  { lat: 45.78122, lng: 1.30518, data: { drive: true, zip: 87110, city: "LE VIGEN" } },
  { lat: 43.42311, lng: 6.76609, data: { drive: false, zip: 83700, city: "SAINT-RAPHAËL" } },
  { lat: 44.13614, lng: 4.79915, data: { drive: true, zip: 84100, city: "ORANGE" } },
  { lat: 49.34703, lng: 0.0968, data: { drive: true, zip: 14800, city: "TOUQUES" } },
  { lat: 49.28528, lng: -0.10253, data: { drive: false, zip: 14160, city: "DIVES-SUR-MER" } },
  { lat: 46.78408, lng: 4.85282, data: { drive: false, zip: 71100, city: "CHALON-SUR-SAÔNE" } },
  { lat: 46.78817, lng: 4.8667, data: { drive: false, zip: 71100, city: "CHALON-SUR-SAÔNE" } },
  { lat: 48.60435, lng: 7.70535, data: { drive: true, zip: 67205, city: "OBERHAUSBERGEN" } },
  { lat: 49.16521, lng: 5.8423, data: { drive: true, zip: 54800, city: "CONFLANS-EN-JARNISY" } },
  { lat: 50.63629, lng: 2.41159, data: { drive: true, zip: 62120, city: "AIRE-SUR-LA-LYS" } },
  { lat: 50.40329, lng: 1.59424, data: { drive: true, zip: 62600, city: "BERCK" } },
  { lat: 48.04325, lng: 7.16075, data: { drive: true, zip: 68140, city: "MUNSTER" } },
  { lat: 47.58617, lng: 7.56219, data: { drive: false, zip: 68300, city: "SAINT-LOUIS" } },
  { lat: 50.9529, lng: 1.89091, data: { drive: false, zip: 62100, city: "CALAIS" } },
  { lat: 48.90128, lng: 6.06408, data: { drive: true, zip: 54700, city: "PONT-À-MOUSSON" } },
  { lat: 48.73863, lng: 7.07884, data: { drive: true, zip: 57400, city: "SARREBOURG" } },
  { lat: 43.09533, lng: -0.04628, data: { drive: false, zip: 65100, city: "LOURDES" } },
  { lat: 43.11384, lng: 0.75978, data: { drive: true, zip: 31800, city: "ESTANCARBON" } },
  { lat: 42.94891, lng: 1.62436, data: { drive: true, zip: 9000, city: "FOIX" } },
  { lat: 45.69265, lng: 0.18124, data: { drive: true, zip: 16430, city: "CHAMPNIERS" } },
  { lat: 43.27876, lng: -0.36056, data: { drive: true, zip: 64110, city: "MAZÈRES-LEZONS" } },
  { lat: 46.11194, lng: -1.10266, data: { drive: true, zip: 17690, city: "ANGOULINS" } },
  { lat: 48.01804, lng: -4.08614, data: { drive: true, zip: 29000, city: "QUIMPER" } },
  { lat: 47.97847, lng: -4.09504, data: { drive: true, zip: 29000, city: "QUIMPER" } },
  { lat: 46.28785, lng: 4.81041, data: { drive: true, zip: 71000, city: "MÂCON" } },
  { lat: 47.902, lng: 7.22278, data: { drive: true, zip: 68500, city: "GUEBWILLER" } },
  { lat: 50.73989, lng: 2.2597, data: { drive: true, zip: 62219, city: "LONGUENESSE" } },
  { lat: 49.03679, lng: 3.38273, data: { drive: true, zip: 2400, city: "CHÂTEAU-THIERRY" } },
  { lat: 47.67292, lng: 6.51029, data: { drive: true, zip: 70200, city: "LURE" } },
  { lat: 49.10886, lng: 6.71819, data: { drive: true, zip: 57500, city: "SAINT-AVOLD" } },
  { lat: 50.00915, lng: 2.66887, data: { drive: true, zip: 80300, city: "ALBERT" } },
  { lat: 49.14569, lng: 5.40792, data: { drive: true, zip: 55100, city: "VERDUN" } },
  { lat: 49.94206, lng: 2.93128, data: { drive: true, zip: 80200, city: "PÉRONNE" } },
  { lat: 50.06056, lng: 1.40664, data: { drive: true, zip: 80350, city: "MERS-LES-BAINS" } },
  { lat: 48.50949, lng: 3.71543, data: { drive: true, zip: 10100, city: "ROMILLY-SUR-SEINE" } },
  { lat: 49.22102, lng: 2.13827, data: { drive: true, zip: 60110, city: "MÉRU" } },
  { lat: 50.72353, lng: 2.74064, data: { drive: false, zip: 59270, city: "BAILLEUL" } },
  { lat: 49.18927, lng: 6.69494, data: { drive: true, zip: 57150, city: "CREUTZWALD" } },
  { lat: 49.51819, lng: 5.75443, data: { drive: true, zip: 54400, city: "LONGWY" } },
  { lat: 48.67032, lng: 5.89, data: { drive: true, zip: 54200, city: "TOUL" } },
  { lat: 50.02788, lng: 4.03121, data: { drive: true, zip: 59610, city: "FOURMIES" } },
  { lat: 49.91076, lng: 4.09158, data: { drive: true, zip: 2500, city: "HIRSON" } },
  { lat: 47.60508, lng: 7.54393, data: { drive: true, zip: 68300, city: "SAINT-LOUIS" } },
  { lat: 49.64377, lng: 3.261, data: { drive: true, zip: 2300, city: "VIRY-NOUREUIL" } },
  { lat: 48.60326, lng: 6.36337, data: { drive: false, zip: 54110, city: "DOMBASLE-SUR-MEURTHE" } },
  { lat: 47.21903, lng: 5.94567, data: { drive: true, zip: 25000, city: "BESANÇON" } },
  { lat: 45.53464, lng: 4.87262, data: { drive: true, zip: 38200, city: "VIENNE" } },
  { lat: 43.22156, lng: 0.06148, data: { drive: true, zip: 65000, city: "TARBES" } },
  { lat: 46.16753, lng: 1.88593, data: { drive: true, zip: 23000, city: "GUÉRET" } },
  { lat: 44.51672, lng: 3.48492, data: { drive: true, zip: 48000, city: "MENDE" } },
  { lat: 45.69062, lng: -0.32145, data: { drive: true, zip: 16100, city: "COGNAC" } },
  { lat: 44.36021, lng: 2.01127, data: { drive: true, zip: 12200, city: "VILLEFRANCHE-DE-ROUERGUE" } },
  { lat: 46.14849, lng: -1.15316, data: { drive: false, zip: 17000, city: "LA ROCHELLE" } },
  { lat: 45.12917, lng: 1.3247, data: { drive: true, zip: 24120, city: "TERRASSON-LAVILLEDIEU" } },
  { lat: 43.48789, lng: -0.77993, data: { drive: true, zip: 64300, city: "ORTHEZ" } },
  { lat: 43.72332, lng: -1.05062, data: { drive: true, zip: 40990, city: "SAINT-PAUL-LÈS-DAX" } },
  { lat: 43.30052, lng: 1.95548, data: { drive: true, zip: 11400, city: "CASTELNAUDARY" } },
  { lat: 43.49863, lng: 2.38637, data: { drive: true, zip: 81200, city: "MAZAMET" } },
  { lat: 45.25378, lng: 1.76103, data: { drive: true, zip: 19000, city: "TULLE" } },
  { lat: 44.84486, lng: 0.17881, data: { drive: true, zip: 33220, city: "PORT-SAINTE-FOY-ET-PONCHAPT" } },
  { lat: 42.6998, lng: 2.93526, data: { drive: true, zip: 66000, city: "PERPIGNAN" } },
  { lat: 45.551, lng: 3.26706, data: { drive: true, zip: 63500, city: "ISSOIRE" } },
  { lat: 42.67271, lng: 2.88987, data: { drive: true, zip: 66100, city: "PERPIGNAN" } },
  { lat: 43.18177, lng: -0.61915, data: { drive: true, zip: 64400, city: "OLORON-SAINTE-MARIE" } },
  { lat: 43.66591, lng: 4.63669, data: { drive: true, zip: 13200, city: "ARLES" } },
  { lat: 43.67528, lng: 4.62777, data: { drive: false, zip: 13200, city: "ARLES" } },
  { lat: 45.72011, lng: 4.22684, data: { drive: true, zip: 42110, city: "FEURS" } },
  { lat: 43.65284, lng: 6.94545, data: { drive: true, zip: 6130, city: "GRASSE" } },
  { lat: 47.60577, lng: 1.32785, data: { drive: true, zip: 41000, city: "BLOIS" } },
  { lat: 48.05388, lng: -0.74011, data: { drive: true, zip: 53000, city: "LAVAL" } },
  { lat: 48.07771, lng: -0.79915, data: { drive: true, zip: 53000, city: "LAVAL" } },
  { lat: 43.34304, lng: 3.21635, data: { drive: false, zip: 34500, city: "BÉZIERS" } },
  { lat: 43.34875, lng: 3.25045, data: { drive: true, zip: 34500, city: "BÉZIERS" } },
  { lat: 44.79292, lng: -0.53001, data: { drive: true, zip: 33130, city: "BÈGLES" } },
  { lat: 46.33804, lng: 2.56608, data: { drive: true, zip: 3410, city: "DOMÉRAT" } },
  { lat: 49.43161, lng: 2.08403, data: { drive: false, zip: 60000, city: "BEAUVAIS" } },
  { lat: 49.40826, lng: 2.11265, data: { drive: true, zip: 60000, city: "BEAUVAIS" } },
  { lat: 47.8072, lng: 7.31359, data: { drive: true, zip: 68270, city: "WITTENHEIM" } },
  { lat: 49.34882, lng: 6.17826, data: { drive: true, zip: 57970, city: "YUTZ" } },
  { lat: 48.57857, lng: 6.51688, data: { drive: true, zip: 54300, city: "LUNÉVILLE" } },
  { lat: 46.0358, lng: 4.07118, data: { drive: false, zip: 42300, city: "ROANNE" } },
  { lat: 47.0625, lng: 2.36843, data: { drive: false, zip: 18000, city: "BOURGES" } },
  { lat: 47.79931, lng: -3.25809, data: { drive: true, zip: 56700, city: "HENNEBONT" } },
  { lat: 48.10432, lng: -1.71225, data: { drive: true, zip: 35000, city: "RENNES" } },
  { lat: 46.45296, lng: -0.80598, data: { drive: true, zip: 85200, city: "FONTENAY-LE-COMTE" } },
  { lat: 47.33167, lng: 0.7059, data: { drive: true, zip: 37170, city: "CHAMBRAY-LÈS-TOURS" } },
  { lat: 43.52714, lng: -1.46321, data: { drive: true, zip: 40220, city: "TARNOS" } },
  { lat: 48.4289, lng: 7.65895, data: { drive: true, zip: 67150, city: "ERSTEIN" } },
  { lat: 48.70225, lng: 7.37477, data: { drive: true, zip: 67440, city: "MARMOUTIER" } },
  { lat: 49.59017, lng: 3.64668, data: { drive: true, zip: 2000, city: "CHAMBRY" } },
  { lat: 47.62867, lng: 7.22401, data: { drive: true, zip: 68130, city: "CARSPACH" } },
  { lat: 50.33414, lng: 2.92737, data: { drive: true, zip: 62490, city: "FRESNES-LÈS-MONTAUBAN" } },
  { lat: 46.7003, lng: -1.43078, data: { drive: true, zip: 85000, city: "LA ROCHE-SUR-YON" } },
  { lat: 47.70811, lng: 2.6395, data: { drive: false, zip: 45500, city: "GIEN" } },
  { lat: 47.90406, lng: 2.03137, data: { drive: false, zip: 45430, city: "CHÉCY" } },
  { lat: 47.21099, lng: -1.61698, data: { drive: true, zip: 44800, city: "SAINT-HERBLAIN" } },
  { lat: 47.22455, lng: -1.63032, data: { drive: true, zip: 44800, city: "SAINT-HERBLAIN" } },
  { lat: 47.55916, lng: -2.50631, data: { drive: true, zip: 56190, city: "AMBON" } },
  { lat: 47.16063, lng: -1.54322, data: { drive: true, zip: 44400, city: "REZÉ" } },
  { lat: 49.53625, lng: 0.96334, data: { drive: true, zip: 76360, city: "BARENTIN" } },
  { lat: 49.26747, lng: -0.25976, data: { drive: true, zip: 14150, city: "OUISTREHAM" } },
  { lat: 48.4477, lng: -2.07346, data: { drive: true, zip: 22100, city: "QUÉVERT" } },
  { lat: 49.55026, lng: 0.4915, data: { drive: true, zip: 76210, city: "GRUCHET-LE-VALASSE" } },
  { lat: 48.72733, lng: -0.58193, data: { drive: true, zip: 61100, city: "FLERS" } },
  { lat: 49.39374, lng: 1.05964, data: { drive: true, zip: 76800, city: "SAINT-ÉTIENNE-DU-ROUVRAY" } },
  { lat: 49.02828, lng: 1.1469, data: { drive: false, zip: 27000, city: "ÉVREUX" } },
  { lat: 49.0121, lng: 1.1697, data: { drive: true, zip: 27000, city: "ÉVREUX" } },
  { lat: 47.82351, lng: -0.70198, data: { drive: true, zip: 53200, city: "CHÂTEAU-GONTIER" } },
  { lat: 48.74884, lng: -0.02874, data: { drive: true, zip: 61200, city: "ARGENTAN" } },
  { lat: 49.44542, lng: 1.07237, data: { drive: true, zip: 76000, city: "ROUEN" } },
  { lat: 47.80748, lng: 1.07242, data: { drive: true, zip: 41100, city: "SAINT-OUEN" } },
  { lat: 49.49306, lng: 0.12974, data: { drive: true, zip: 76600, city: "LE HAVRE" } },
  { lat: 48.18707, lng: 2.24893, data: { drive: true, zip: 45300, city: "PITHIVIERS" } },
  { lat: 47.9778, lng: 2.7349, data: { drive: true, zip: 45200, city: "AMILLY" } },
  { lat: 48.45025, lng: -4.26449, data: { drive: true, zip: 29800, city: "LANDERNEAU" } },
  { lat: 49.24956, lng: 1.18247, data: { drive: true, zip: 27100, city: "VAL-DE-REUIL" } },
  { lat: 48.847, lng: -0.88338, data: { drive: true, zip: 14500, city: "VIRE" } },
  { lat: 49.52869, lng: 0.18786, data: { drive: true, zip: 76290, city: "MONTIVILLIERS" } },
  { lat: 46.95257, lng: 2.00576, data: { drive: true, zip: 36100, city: "ISSOUDUN" } },
  { lat: 47.70382, lng: -0.05327, data: { drive: true, zip: 72200, city: "LA FLÈCHE" } },
  { lat: 47.8014, lng: 3.56724, data: { drive: true, zip: 89000, city: "AUXERRE" } },
  { lat: 49.02895, lng: 7.96147, data: { drive: false, zip: 67160, city: "WISSEMBOURG" } },
  { lat: 48.52198, lng: 7.69363, data: { drive: true, zip: 67118, city: "GEISPOLSHEIM" } },
  { lat: 48.74606, lng: 7.69354, data: { drive: true, zip: 67170, city: "BRUMATH" } },
  { lat: 46.20722, lng: 5.23579, data: { drive: true, zip: 1000, city: "BOURG-EN-BRESSE" } },
  { lat: 46.19529, lng: 5.22838, data: { drive: false, zip: 1000, city: "BOURG-EN-BRESSE" } },
  { lat: 46.29394, lng: 6.07699, data: { drive: true, zip: 1170, city: "SÉGNY" } },
  { lat: 46.22679, lng: 5.9921, data: { drive: true, zip: 1710, city: "THOIRY" } },
  { lat: 45.69762, lng: 5.01367, data: { drive: true, zip: 69720, city: "SAINT-BONNET-DE-MURE" } },
  { lat: 43.76626, lng: 7.19933, data: { drive: true, zip: 6510, city: "GATTIÈRES" } },
  { lat: 43.42164, lng: 5.05497, data: { drive: true, zip: 13500, city: "MARTIGUES" } },
  { lat: 43.53268, lng: 6.93265, data: { drive: false, zip: 6210, city: "MANDELIEU-LA-NAPOULE" } },
  { lat: 43.61536, lng: 6.97177, data: { drive: true, zip: 6250, city: "MOUGINS" } },
  { lat: 45.37814, lng: 4.27377, data: { drive: true, zip: 42700, city: "FIRMINY" } },
  { lat: 43.38815, lng: 5.59941, data: { drive: false, zip: 13112, city: "LA DESTROUSSE" } },
  { lat: 43.41947, lng: 5.36533, data: { drive: true, zip: 13480, city: "CABRIÈS" } },
  { lat: 45.69263, lng: 5.89488, data: { drive: true, zip: 73100, city: "AIX-LES-BAINS" } },
  { lat: 43.48487, lng: 5.22238, data: { drive: true, zip: 13340, city: "ROGNAC" } },
  { lat: 45.52242, lng: 4.29318, data: { drive: true, zip: 42480, city: "LA FOUILLOUSE" } },
  { lat: 45.57274, lng: 5.95168, data: { drive: false, zip: 73230, city: "SAINT-ALBAN-LEYSSE" } },
  { lat: 45.62342, lng: 6.77761, data: { drive: true, zip: 73700, city: "BOURG-SAINT-MAURICE" } },
  { lat: 45.59279, lng: 5.89805, data: { drive: true, zip: 73000, city: "CHAMBÉRY" } },
  { lat: 45.75765, lng: 5.7067, data: { drive: true, zip: 1300, city: "BELLEY" } },
  { lat: 44.53212, lng: 4.74583, data: { drive: true, zip: 26200, city: "MONTÉLIMAR" } },
  { lat: 45.46243, lng: 4.49481, data: { drive: true, zip: 42400, city: "SAINT-CHAMOND" } },
  { lat: 43.36345, lng: 5.34997, data: { drive: false, zip: 13015, city: "MARSEILLE" } },
  { lat: 43.5876, lng: 4.99985, data: { drive: true, zip: 13140, city: "MIRAMAS" } },
  { lat: 43.29521, lng: 5.3996, data: { drive: true, zip: 13005, city: "MARSEILLE" } },
  { lat: 43.29769, lng: 5.38102, data: { drive: false, zip: 13001, city: "MARSEILLE" } },
  { lat: 45.01618, lng: 4.87517, data: { drive: true, zip: 26600, city: "PONT-DE-L'ISÈRE" } },
  { lat: 45.57398, lng: 4.81087, data: { drive: true, zip: 38670, city: "CHASSE-SUR-RHÔNE" } },
  { lat: 43.14053, lng: 6.01929, data: { drive: false, zip: 83130, city: "LA GARDE" } },
  { lat: 48.4444, lng: 1.48412, data: { drive: false, zip: 28000, city: "CHARTRES" } },
  { lat: 48.45121, lng: 1.51668, data: { drive: false, zip: 28000, city: "CHARTRES" } },
  { lat: 49.32941, lng: 1.09975, data: { drive: true, zip: 76410, city: "TOURVILLE-LA-RIVIÈRE" } },
  { lat: 49.2896, lng: 1.03598, data: { drive: true, zip: 76320, city: "CAUDEBEC-LÈS-ELBEUF" } },
  { lat: 48.32782, lng: 0.80044, data: { drive: true, zip: 28400, city: "NOGENT-LE-ROTROU" } },
  { lat: 48.76171, lng: 0.63422, data: { drive: false, zip: 61300, city: "L'AIGLE" } },
  { lat: 49.28479, lng: 1.79043, data: { drive: true, zip: 27140, city: "GISORS" } },
  { lat: 46.87485, lng: -1.0254, data: { drive: true, zip: 85500, city: "LES HERBIERS" } },
  { lat: 48.69061, lng: -1.36736, data: { drive: true, zip: 50300, city: "AVRANCHES" } },
  { lat: 48.18117, lng: 0.65282, data: { drive: true, zip: 72400, city: "LA FERTÉ-BERNARD" } },
  { lat: 46.99028, lng: -0.19517, data: { drive: true, zip: 79100, city: "THOUARS" } },
  { lat: 48.1205, lng: -1.20926, data: { drive: true, zip: 35500, city: "VITRÉ" } },
  { lat: 49.34739, lng: 0.52276, data: { drive: true, zip: 27500, city: "PONT-AUDEMER" } },
  { lat: 48.56253, lng: -3.16595, data: { drive: true, zip: 22200, city: "GUINGAMP" } },
  { lat: 46.85411, lng: -1.89561, data: { drive: true, zip: 85300, city: "CHALLANS" } },
  { lat: 46.64912, lng: -0.22374, data: { drive: true, zip: 79200, city: "PARTHENAY" } },
  { lat: 48.74614, lng: -3.46154, data: { drive: true, zip: 22300, city: "LANNION" } },
  { lat: 47.40362, lng: 1.01745, data: { drive: true, zip: 37400, city: "AMBOISE" } },
  { lat: 47.37771, lng: 1.73665, data: { drive: true, zip: 41200, city: "ROMORANTIN-LANTHENAY" } },
  { lat: 48.58795, lng: -3.81588, data: { drive: true, zip: 29600, city: "MORLAIX" } },
  { lat: 47.70114, lng: -1.40419, data: { drive: true, zip: 44110, city: "CHÂTEAUBRIANT" } },
  { lat: 48.05324, lng: -2.96002, data: { drive: true, zip: 56300, city: "PONTIVY" } },
  { lat: 47.09679, lng: -1.28171, data: { drive: true, zip: 44190, city: "CLISSON" } },
  { lat: 48.6347, lng: -1.98982, data: { drive: true, zip: 35400, city: "SAINT-MALO" } },
  { lat: 47.9377, lng: 1.89409, data: { drive: true, zip: 45400, city: "FLEURY-LES-AUBRAIS" } },
  { lat: 47.3779, lng: 0.65709, data: { drive: false, zip: 37520, city: "LA RICHE" } },
  { lat: 48.27737, lng: -3.55243, data: { drive: true, zip: 29270, city: "CARHAIX-PLOUGUER" } },
  { lat: 47.09176, lng: 2.4212, data: { drive: true, zip: 18000, city: "BOURGES" } },
  { lat: 48.17589, lng: 6.44752, data: { drive: false, zip: 88000, city: "ÉPINAL" } },
  { lat: 48.94794, lng: 2.66734, data: { drive: false, zip: 77410, city: "CLAYE-SOUILLY" } },
  { lat: 48.61631, lng: 2.629, data: { drive: false, zip: 77550, city: "RÉAU" } },
  { lat: 43.18316, lng: 3.0047, data: { drive: false, zip: 11100, city: "NARBONNE" } },
  { lat: 43.52664, lng: -1.52085, data: { drive: false, zip: 64600, city: "ANGLET" } },
  { lat: 43.39914, lng: -1.64043, data: { drive: true, zip: 64500, city: "SAINT-JEAN-DE-LUZ" } },
  { lat: 43.49236, lng: -1.45251, data: { drive: true, zip: 64100, city: "BAYONNE" } },
  { lat: 43.94049, lng: 4.5747, data: { drive: true, zip: 30210, city: "REMOULINS" } },
  { lat: 45.18965, lng: 0.76522, data: { drive: true, zip: 24750, city: "TRÉLISSAC" } },
  { lat: 45.14758, lng: 1.48169, data: { drive: true, zip: 19100, city: "BRIVE-LA-GAILLARDE" } },
  { lat: 44.54311, lng: -0.25242, data: { drive: true, zip: 33210, city: "LANGON" } },
  { lat: 47.07371, lng: -0.84275, data: { drive: true, zip: 49300, city: "CHOLET" } },
  { lat: 47.04603, lng: -0.89599, data: { drive: true, zip: 49300, city: "CHOLET" } },
  { lat: 44.0375, lng: 1.38022, data: { drive: true, zip: 82000, city: "MONTAUBAN" } },
  { lat: 44.14998, lng: 1.52504, data: { drive: true, zip: 82300, city: "CAUSSADE" } },
  { lat: 45.30648, lng: 3.37712, data: { drive: true, zip: 43100, city: "BRIOUDE" } },
  { lat: 47.66047, lng: -2.79238, data: { drive: true, zip: 56000, city: "VANNES" } },
  { lat: 48.73216, lng: 0.91992, data: { drive: false, zip: 27130, city: "VERNEUIL-SUR-AVRE" } },
  { lat: 47.43223, lng: -2.08352, data: { drive: true, zip: 44160, city: "PONTCHÂTEAU" } },
  { lat: 44.12719, lng: 4.07953, data: { drive: false, zip: 30100, city: "ALÈS" } },
  { lat: 44.10886, lng: 4.09774, data: { drive: true, zip: 30100, city: "ALÈS" } },
  { lat: 43.45355, lng: 3.42053, data: { drive: true, zip: 34120, city: "PÉZENAS" } },
  { lat: 48.94601, lng: 4.37613, data: { drive: true, zip: 51000, city: "CHÂLONS-EN-CHAMPAGNE" } },
  { lat: 48.74493, lng: 6.14804, data: { drive: false, zip: 54390, city: "FROUARD" } },
  { lat: 49.64726, lng: 2.58702, data: { drive: false, zip: 80500, city: "MONTDIDIER" } },
  { lat: 49.70763, lng: 2.77451, data: { drive: false, zip: 80700, city: "ROYE" } },
  { lat: 46.31269, lng: -0.47926, data: { drive: true, zip: 79000, city: "NIORT" } },
  { lat: 47.37263, lng: -1.19489, data: { drive: true, zip: 44150, city: "SAINT-GÉRÉON" } },
  { lat: 47.76512, lng: 1.61189, data: { drive: true, zip: 45190, city: "TAVERS" } },
  { lat: 46.34568, lng: 2.60137, data: { drive: false, zip: 3100, city: "MONTLUÇON" } },
  { lat: 43.62327, lng: 3.43729, data: { drive: true, zip: 34800, city: "CLERMONT-L'HÉRAULT" } },
  { lat: 44.77819, lng: -0.57143, data: { drive: true, zip: 33140, city: "VILLENAVE-D'ORNON" } },
  { lat: 49.74025, lng: 4.70811, data: { drive: false, zip: 8000, city: "CHARLEVILLE-MÉZIÈRES" } },
  { lat: 44.91353, lng: 2.4413, data: { drive: true, zip: 15000, city: "AURILLAC" } },
  { lat: 43.63204, lng: 5.10025, data: { drive: true, zip: 13300, city: "SALON-DE-PROVENCE" } },
  { lat: 43.63809, lng: 5.09909, data: { drive: false, zip: 13300, city: "SALON-DE-PROVENCE" } },
  { lat: 43.62881, lng: 5.11294, data: { drive: true, zip: 13300, city: "SALON-DE-PROVENCE" } },
  { lat: 43.13678, lng: 6.00456, data: { drive: true, zip: 83160, city: "LA VALETTE-DU-VAR" } },
  { lat: 43.12026, lng: 5.93585, data: { drive: false, zip: 83000, city: "TOULON" } },
  { lat: 43.69549, lng: 7.27532, data: { drive: false, zip: 6300, city: "NICE" } },
  { lat: 43.69503, lng: 7.26598, data: { drive: false, zip: 6000, city: "NICE" } },
  { lat: 45.74965, lng: 5.18672, data: { drive: true, zip: 38230, city: "TIGNIEU-JAMEYZIEU" } },
  { lat: 45.35929, lng: 5.59161, data: { drive: true, zip: 38500, city: "VOIRON" } },
  { lat: 44.94182, lng: 4.91753, data: { drive: true, zip: 26000, city: "VALENCE" } },
  { lat: 43.95763, lng: 4.85822, data: { drive: false, zip: 84130, city: "LE PONTET" } },
  { lat: 45.85872, lng: 6.14174, data: { drive: true, zip: 74320, city: "SÉVRIER" } },
  { lat: 45.65625, lng: 6.36344, data: { drive: true, zip: 73200, city: "GILLY-SUR-ISÈRE" } },
  { lat: 46.80516, lng: 1.69815, data: { drive: true, zip: 36000, city: "CHÂTEAUROUX" } },
  { lat: 48.64877, lng: 4.95863, data: { drive: true, zip: 52100, city: "SAINT-DIZIER" } },
  { lat: 48.62586, lng: 4.96505, data: { drive: true, zip: 52100, city: "SAINT-DIZIER" } },
  { lat: 48.74646, lng: 1.34621, data: { drive: false, zip: 28100, city: "DREUX" } },
  { lat: 44.56858, lng: 6.10331, data: { drive: true, zip: 5000, city: "GAP" } },
  { lat: 47.26543, lng: -0.09157, data: { drive: true, zip: 49400, city: "SAUMUR" } },
  { lat: 46.83966, lng: 0.54644, data: { drive: true, zip: 86100, city: "CHÂTELLERAULT" } },
  { lat: 47.88127, lng: -4.21796, data: { drive: false, zip: 29120, city: "PONT-L'ABBÉ" } },
  { lat: 50.16915, lng: 3.23248, data: { drive: true, zip: 59400, city: "CAMBRAI" } },
  { lat: 49.91121, lng: 1.07823, data: { drive: true, zip: 76200, city: "DIEPPE" } },
  { lat: 47.23997, lng: 2.09244, data: { drive: true, zip: 18100, city: "VIERZON" } },
  { lat: 48.04575, lng: -1.60315, data: { drive: false, zip: 35770, city: "VERN-SUR-SEICHE" } },
  { lat: 49.3091, lng: -1.10435, data: { drive: true, zip: 14230, city: "ISIGNY-SUR-MER" } },
  { lat: 47.11203, lng: -2.07228, data: { drive: true, zip: 44210, city: "PORNIC" } },
  { lat: 48.20149, lng: -1.7295, data: { drive: true, zip: 35520, city: "LA MÉZIÈRE" } },
  { lat: 49.09657, lng: 1.4642, data: { drive: true, zip: 27200, city: "VERNON" } },
  { lat: 48.17689, lng: -1.9195, data: { drive: true, zip: 35137, city: "PLEUMELEUC" } },
  { lat: 46.14226, lng: 3.41565, data: { drive: true, zip: 3200, city: "VICHY" } },
  { lat: 46.54005, lng: 3.34363, data: { drive: false, zip: 3000, city: "MOULINS" } },
  { lat: 48.20564, lng: 3.27694, data: { drive: true, zip: 89100, city: "SENS" } },
  { lat: 48.19324, lng: 3.30414, data: { drive: true, zip: 89100, city: "SENS" } },
  { lat: 48.82776, lng: 7.75762, data: { drive: true, zip: 67500, city: "HAGUENAU" } },
  { lat: 48.27541, lng: 7.46269, data: { drive: true, zip: 67600, city: "SÉLESTAT" } },
  { lat: 46.06609, lng: 4.05525, data: { drive: true, zip: 42300, city: "MABLY" } },
  { lat: 48.0593, lng: -1.88073, data: { drive: true, zip: 35310, city: "BRÉAL-SOUS-MONTFORT" } },
  { lat: 44.61628, lng: -1.13558, data: { drive: true, zip: 33260, city: "LA TESTE-DE-BUCH" } },
  { lat: 46.48827, lng: -1.74664, data: { drive: true, zip: 85180, city: "CHÂTEAU-D'OLONNE" } },
  { lat: 49.16435, lng: -0.42315, data: { drive: false, zip: 14760, city: "BRETTEVILLE-SUR-ODON" } },
  { lat: 49.16435, lng: -0.42315, data: { drive: true, zip: 14760, city: "BRETTEVILLE-SUR-ODON" } },
  { lat: 49.11662, lng: 7.09562, data: { drive: true, zip: 57200, city: "SARREGUEMINES" } },
  { lat: 44.05047, lng: 5.04046, data: { drive: true, zip: 84200, city: "CARPENTRAS" } },
  { lat: 45.58952, lng: 5.2573, data: { drive: true, zip: 38300, city: "BOURGOIN-JALLIEU" } },
  { lat: 45.64363, lng: 5.13336, data: { drive: true, zip: 38290, city: "LA VERPILLIÈRE" } },
  { lat: 43.65012, lng: 0.59442, data: { drive: true, zip: 32000, city: "AUCH" } },
  { lat: 44.17593, lng: 0.63449, data: { drive: true, zip: 47550, city: "BOÉ" } },
  { lat: 44.20555, lng: 0.62636, data: { drive: false, zip: 47000, city: "AGEN" } },
  { lat: 44.18983, lng: 0.61384, data: { drive: true, zip: 47000, city: "AGEN" } },
  { lat: 49.17549, lng: 6.88154, data: { drive: true, zip: 57600, city: "FORBACH" } },
  { lat: 45.99922, lng: 4.73415, data: { drive: true, zip: 69400, city: "VILLEFRANCHE-SUR-SAÔNE" } },
  { lat: 43.44477, lng: 6.70256, data: { drive: true, zip: 83480, city: "PUGET-SUR-ARGENS" } },
  { lat: 43.31744, lng: 6.63152, data: { drive: true, zip: 83120, city: "SAINTE-MAXIME" } },
  { lat: 43.82719, lng: 5.03515, data: { drive: true, zip: 84300, city: "CAVAILLON" } },
  { lat: 47.11209, lng: 2.3779, data: { drive: true, zip: 18230, city: "SAINT-DOULCHARD" } },
  { lat: 48.90891, lng: -0.20495, data: { drive: false, zip: 14700, city: "FALAISE" } },
  { lat: 46.4614, lng: -1.13504, data: { drive: true, zip: 85400, city: "LUÇON" } },
  { lat: 46.6822, lng: 4.36231, data: { drive: true, zip: 71300, city: "MONTCEAU-LES-MINES" } },
  { lat: 44.46648, lng: 1.42802, data: { drive: true, zip: 46000, city: "CAHORS" } },
  { lat: 44.40372, lng: 0.68295, data: { drive: true, zip: 47300, city: "BIAS" } },
  { lat: 43.8773, lng: -0.46615, data: { drive: true, zip: 40000, city: "MONT-DE-MARSAN" } },
  { lat: 43.90271, lng: -0.48042, data: { drive: true, zip: 40000, city: "MONT-DE-MARSAN" } },
  { lat: 45.19472, lng: 0.66071, data: { drive: true, zip: 24430, city: "MARSAC-SUR-L'ISLE" } },
  { lat: 50.28273, lng: 2.73737, data: { drive: true, zip: 62000, city: "DAINVILLE" } },
  { lat: 50.69981, lng: 1.6083, data: { drive: true, zip: 62230, city: "OUTREAU" } },
  { lat: 50.72687, lng: 1.64407, data: { drive: true, zip: 62280, city: "SAINT-MARTIN-BOULOGNE" } },
  { lat: 48.45878, lng: 7.49315, data: { drive: true, zip: 67210, city: "OBERNAI" } },
  { lat: 48.1088, lng: 5.14058, data: { drive: true, zip: 52000, city: "CHAUMONT" } },
  { lat: 49.02502, lng: 3.94507, data: { drive: true, zip: 51530, city: "PIERRY" } },
  { lat: 49.69861, lng: 4.92847, data: { drive: true, zip: 8200, city: "SEDAN" } },
  { lat: 48.27759, lng: 6.96018, data: { drive: true, zip: 88100, city: "SAINT-DIÉ-DES-VOSGES" } },
  { lat: 49.23409, lng: 2.46697, data: { drive: true, zip: 60740, city: "SAINT-MAXIMIN" } },
  { lat: 49.37046, lng: 3.31379, data: { drive: true, zip: 2200, city: "SOISSONS" } },
  { lat: 49.25977, lng: 2.45245, data: { drive: true, zip: 60160, city: "MONTATAIRE" } },
  { lat: 46.34896, lng: 6.4319, data: { drive: true, zip: 74200, city: "ANTHY-SUR-LÉMAN" } },
  { lat: 46.18136, lng: 6.23066, data: { drive: true, zip: 74100, city: "ÉTREMBIÈRES" } },
  { lat: 49.63388, lng: -1.61717, data: { drive: true, zip: 50100, city: "CHERBOURG-OCTEVILLE" } },
  { lat: 48.42813, lng: 1.51306, data: { drive: true, zip: 28630, city: "LE COUDRAY" } },
  { lat: 48.44685, lng: 1.44533, data: { drive: false, zip: 28300, city: "MAINVILLIERS" } },
  { lat: 49.66141, lng: -1.68572, data: { drive: true, zip: 50120, city: "ÉQUEURDREVILLE-HAINNEVILLE" } },
  { lat: 48.43334, lng: 0.0619, data: { drive: true, zip: 61250, city: "CONDÉ-SUR-SARTHE" } },
  { lat: 49.1436, lng: 0.264, data: { drive: true, zip: 14100, city: "LISIEUX" } },
  { lat: 49.14455, lng: 0.26151, data: { drive: false, zip: 14100, city: "LISIEUX" } },
  { lat: 49.06889, lng: -1.43112, data: { drive: true, zip: 50200, city: "COUTANCES" } },
  { lat: 48.34627, lng: -1.18102, data: { drive: true, zip: 35300, city: "FOUGÈRES" } },
  { lat: 48.49412, lng: -2.72529, data: { drive: true, zip: 22360, city: "LANGUEUX" } },
  { lat: 48.53367, lng: -2.75628, data: { drive: true, zip: 22190, city: "PLÉRIN" } },
  { lat: 48.55891, lng: -1.49087, data: { drive: false, zip: 50170, city: "PONTORSON" } },
  { lat: 45.95467, lng: -0.52921, data: { drive: true, zip: 17400, city: "SAINT-JEAN-D'ANGÉLY" } },
  { lat: 43.2693, lng: 3.28289, data: { drive: true, zip: 34410, city: "SÉRIGNAN" } },
  { lat: 43.68239, lng: 4.15191, data: { drive: true, zip: 34400, city: "LUNEL" } },
  { lat: 43.56924, lng: 3.83902, data: { drive: true, zip: 34430, city: "SAINT-JEAN-DE-VÉDAS" } },
  { lat: 43.46112, lng: 3.69264, data: { drive: true, zip: 34540, city: "BALARUC-LE-VIEUX" } },
  { lat: 43.65659, lng: 3.99834, data: { drive: true, zip: 34670, city: "BAILLARGUES" } },
  { lat: 43.30392, lng: 3.48483, data: { drive: true, zip: 34300, city: "AGDE" } },
  { lat: 43.58353, lng: 3.92977, data: { drive: false, zip: 34970, city: "LATTES" } },
  { lat: 43.58335, lng: 3.9267, data: { drive: true, zip: 34970, city: "LATTES" } },
  { lat: 45.95871, lng: -0.97737, data: { drive: true, zip: 17300, city: "ROCHEFORT" } },
  { lat: 45.74002, lng: -0.66216, data: { drive: true, zip: 17100, city: "SAINTES" } },
  { lat: 46.25419, lng: 5.64303, data: { drive: true, zip: 1100, city: "OYONNAX" } },
  { lat: 50.69232, lng: 2.8704, data: { drive: true, zip: 59280, city: "ARMENTIÈRES" } },
  { lat: 47.08231, lng: 5.47542, data: { drive: true, zip: 39100, city: "DOLE" } },
  { lat: 44.83553, lng: 0.44856, data: { drive: true, zip: 24100, city: "BERGERAC" } },
  { lat: 43.66845, lng: -1.28273, data: { drive: true, zip: 40230, city: "SAINT-VINCENT-DE-TYROSSE" } },
  { lat: 44.41121, lng: -1.16901, data: { drive: true, zip: 40600, city: "BISCARROSSE" } },
  { lat: 49.10036, lng: -1.08275, data: { drive: true, zip: 50000, city: "SAINT-LÔ" } },
  { lat: 48.7711, lng: -3.03922, data: { drive: true, zip: 22500, city: "PAIMPOL" } },
  { lat: 47.93985, lng: 0.23237, data: { drive: true, zip: 72230, city: "MULSANNE" } },
  { lat: 48.1025, lng: -1.46488, data: { drive: true, zip: 35530, city: "SERVON-SUR-VILAINE" } },
  { lat: 47.6635, lng: -3.00718, data: { drive: true, zip: 56400, city: "AURAY" } },
  { lat: 44.37213, lng: 2.59181, data: { drive: true, zip: 12850, city: "ONET-LE-CHÂTEAU" } },
  { lat: 45.62354, lng: -1.00287, data: { drive: true, zip: 17200, city: "ROYAN" } },
  { lat: 48.95996, lng: 4.31652, data: { drive: true, zip: 51510, city: "FAGNIÈRES" } },
  { lat: 47.83772, lng: -0.29898, data: { drive: true, zip: 72300, city: "SOLESMES" } },
  { lat: 48.05079, lng: 0.17075, data: { drive: true, zip: 72650, city: "SAINT-SATURNIN" } },
  { lat: 45.16874, lng: 1.56076, data: { drive: true, zip: 19360, city: "MALEMORT-SUR-CORRÈZE" } },
  { lat: 43.95464, lng: 2.15499, data: { drive: true, zip: 81380, city: "LESCURE-D'ALBIGEOIS" } },
  { lat: 46.33162, lng: 4.84198, data: { drive: true, zip: 71000, city: "SANCÉ" } },
  { lat: 46.21523, lng: 5.21492, data: { drive: false, zip: 1440, city: "VIRIAT" } },
  { lat: 47.57137, lng: 1.37103, data: { drive: true, zip: 41350, city: "VINEUIL" } },
  { lat: 46.40772, lng: -0.22409, data: { drive: true, zip: 79400, city: "AZAY-LE-BRÛLÉ" } },
  { lat: 46.53688, lng: 0.28762, data: { drive: false, zip: 86240, city: "CROUTELLE" } },
  { lat: 47.2927, lng: -1.74291, data: { drive: true, zip: 44360, city: "VIGNEUX-DE-BRETAGNE" } },
  { lat: 47.18821, lng: -1.58899, data: { drive: true, zip: 44340, city: "BOUGUENAIS" } },
  { lat: 47.16363, lng: -1.68076, data: { drive: false, zip: 44830, city: "BOUAYE" } },
  { lat: 44.3863, lng: 5.00689, data: { drive: true, zip: 84600, city: "VALRÉAS" } },
  { lat: 47.59991, lng: 6.85826, data: { drive: true, zip: 90400, city: "ANDELNANS" } },
  { lat: 47.97876, lng: 3.37711, data: { drive: true, zip: 89300, city: "JOIGNY" } },
  { lat: 47.2938, lng: -2.39774, data: { drive: true, zip: 44350, city: "GUÉRANDE" } },
  { lat: 48.13013, lng: -1.64109, data: { drive: true, zip: 35700, city: "RENNES" } },
  { lat: 47.65131, lng: -2.72394, data: { drive: true, zip: 56860, city: "SÉNÉ" } },
  { lat: 46.17324, lng: -1.16896, data: { drive: true, zip: 17140, city: "LAGORD" } },
  { lat: 47.1874, lng: -1.47013, data: { drive: true, zip: 44115, city: "BASSE-GOULAINE" } },
  { lat: 45.62189, lng: 0.10952, data: { drive: false, zip: 16400, city: "LA COURONNE" } },
  { lat: 48.22374, lng: -1.50125, data: { drive: true, zip: 35340, city: "LIFFRÉ" } },
  { lat: 46.3379, lng: -0.41275, data: { drive: true, zip: 79000, city: "NIORT" } },
  { lat: 46.84991, lng: -0.47008, data: { drive: true, zip: 79300, city: "BRESSUIRE" } },
  { lat: 46.69384, lng: -1.91407, data: { drive: true, zip: 85800, city: "SAINT-GILLES-CROIX-DE-VIE" } },
  { lat: 46.64778, lng: -1.4366, data: { drive: true, zip: 85000, city: "LA ROCHE-SUR-YON" } },
  { lat: 49.2, lng: -0.36061, data: { drive: false, zip: 14000, city: "CAEN" } },
  { lat: 49.20966, lng: -0.36321, data: { drive: false, zip: 14000, city: "CAEN" } },
  { lat: 48.28511, lng: -0.62396, data: { drive: true, zip: 53100, city: "MAYENNE" } },
  { lat: 49.23939, lng: 3.09899, data: { drive: true, zip: 2600, city: "VILLERS-COTTERÊTS" } },
  { lat: 50.51654, lng: 2.62337, data: { drive: true, zip: 62232, city: "FOUQUIÈRES-LÈS-BÉTHUNE" } },
  { lat: 48.3702, lng: 5.70637, data: { drive: true, zip: 88300, city: "NEUFCHÂTEAU" } },
  { lat: 49.14623, lng: 2.44108, data: { drive: true, zip: 60260, city: "LAMORLAYE" } },
  { lat: 44.60835, lng: 2.01569, data: { drive: true, zip: 46100, city: "FIGEAC" } },
  { lat: 44.83058, lng: -0.57324, data: { drive: false, zip: 33000, city: "BORDEAUX" } },
  { lat: 43.63707, lng: 1.37573, data: { drive: true, zip: 31700, city: "BLAGNAC" } },
  { lat: 44.8207, lng: -0.52006, data: { drive: true, zip: 33270, city: "FLOIRAC" } },
  { lat: 42.625, lng: 2.4282, data: { drive: true, zip: 66500, city: "PRADES" } },
  { lat: 48.19735, lng: 6.47662, data: { drive: true, zip: 88000, city: "JEUXEY" } },
  { lat: 43.89271, lng: 1.88001, data: { drive: true, zip: 81600, city: "GAILLAC" } },
  { lat: 43.24172, lng: 0.02018, data: { drive: true, zip: 65420, city: "IBOS" } },
  { lat: 46.25365, lng: 4.79167, data: { drive: true, zip: 71680, city: "CRÊCHES-SUR-SAÔNE" } },
  { lat: 49.14146, lng: 6.80971, data: { drive: true, zip: 57800, city: "FREYMING-MERLEBACH" } },
  { lat: 48.71099, lng: 3.73161, data: { drive: true, zip: 51120, city: "SÉZANNE" } },
  { lat: 44.88429, lng: -0.69261, data: { drive: true, zip: 33160, city: "SAINT-MÉDARD-EN-JALLES" } },
  { lat: 44.78576, lng: -0.63614, data: { drive: true, zip: 33600, city: "PESSAC" } },
  { lat: 46.99851, lng: 3.10702, data: { drive: false, zip: 58180, city: "MARZY" } },
  { lat: 45.038, lng: 3.06353, data: { drive: true, zip: 15100, city: "ANDELAT" } },
  { lat: 47.3578, lng: 5.04794, data: { drive: false, zip: 21000, city: "DIJON" } },
  { lat: 45.76411, lng: 3.12768, data: { drive: false, zip: 63000, city: "CLERMONT-FERRAND" } },
  { lat: 46.46214, lng: 4.08357, data: { drive: true, zip: 71600, city: "VITRY-EN-CHAROLLAIS" } },
  { lat: 46.77443, lng: 4.8591, data: { drive: true, zip: 71100, city: "CHALON-SUR-SAÔNE" } },
  { lat: 47.49962, lng: 3.90856, data: { drive: true, zip: 89200, city: "AVALLON" } },
  { lat: 47.33954, lng: 5.06704, data: { drive: true, zip: 21000, city: "DIJON" } },
  { lat: 46.73024, lng: 2.49593, data: { drive: true, zip: 18200, city: "SAINT-AMAND-MONTROND" } },
  { lat: 43.812, lng: 4.36212, data: { drive: true, zip: 30900, city: "NÎMES" } },
  { lat: 43.52947, lng: 1.35077, data: { drive: true, zip: 31270, city: "CUGNAUX" } },
  { lat: 43.68697, lng: 1.40451, data: { drive: true, zip: 31150, city: "FENOUILLET" } },
  { lat: 43.51086, lng: 1.37046, data: { drive: true, zip: 31120, city: "ROQUES" } },
  { lat: 43.66181, lng: 1.43256, data: { drive: true, zip: 31200, city: "TOULOUSE" } },
  { lat: 43.66809, lng: 1.51238, data: { drive: true, zip: 31180, city: "ROUFFIAC-TOLOSAN" } },
  { lat: 43.98803, lng: 1.33467, data: { drive: true, zip: 82000, city: "MONTAUBAN" } },
  { lat: 43.91865, lng: 2.11764, data: { drive: true, zip: 81000, city: "ALBI" } },
  { lat: 43.60536, lng: 1.44842, data: { drive: false, zip: 31000, city: "TOULOUSE" } },
  { lat: 43.61367, lng: 3.81035, data: { drive: true, zip: 34990, city: "JUVIGNAC" } },
  { lat: 44.84101, lng: -0.57437, data: { drive: false, zip: 33000, city: "BORDEAUX" } },
  { lat: 50.77126, lng: 3.1253, data: { drive: true, zip: 59250, city: "HALLUIN" } },
  { lat: 49.5439, lng: 5.8002, data: { drive: false, zip: 54350, city: "MONT-SAINT-MARTIN" } },
  { lat: 49.13385, lng: 6.1993, data: { drive: true, zip: 57070, city: "SAINT-JULIEN-LÈS-METZ" } },
  { lat: 50.4323, lng: 2.81926, data: { drive: true, zip: 62300, city: "LENS" } },
  { lat: 48.27995, lng: 4.04371, data: { drive: true, zip: 10120, city: "SAINT-ANDRÉ-LES-VERGERS" } },
  { lat: 48.61902, lng: 6.17515, data: { drive: true, zip: 54710, city: "LUDRES" } },
  { lat: 50.44351, lng: 2.94425, data: { drive: true, zip: 62710, city: "COURRIÈRES" } },
  { lat: 49.84914, lng: 3.26991, data: { drive: true, zip: 2100, city: "SAINT-QUENTIN" } },
  { lat: 50.30049, lng: 2.73885, data: { drive: true, zip: 62000, city: "ARRAS" } },
  { lat: 50.129, lng: 3.42547, data: { drive: false, zip: 59540, city: "CAUDRY" } },
  { lat: 48.80025, lng: 7.8341, data: { drive: true, zip: 67500, city: "HAGUENAU" } },
  { lat: 49.47593, lng: 5.95543, data: { drive: true, zip: 57390, city: "AUDUN-LE-TICHE" } },
  { lat: 49.28624, lng: 2.49552, data: { drive: false, zip: 60870, city: "VILLERS-SAINT-PAUL" } },
  { lat: 49.14912, lng: 6.15995, data: { drive: true, zip: 57140, city: "WOIPPY" } },
  { lat: 48.52521, lng: 7.49806, data: { drive: true, zip: 67120, city: "DORLISHEIM" } },
  { lat: 50.47945, lng: 2.96617, data: { drive: false, zip: 62220, city: "CARVIN" } },
  { lat: 50.10121, lng: 1.85714, data: { drive: true, zip: 80100, city: "ABBEVILLE" } },
  { lat: 48.07079, lng: 7.36641, data: { drive: true, zip: 68000, city: "COLMAR" } },
  { lat: 43.02988, lng: 2.96535, data: { drive: true, zip: 11130, city: "SIGEAN" } },
  { lat: 43.57373, lng: 1.49414, data: { drive: true, zip: 31500, city: "TOULOUSE" } },
  { lat: 44.6366, lng: -0.95766, data: { drive: true, zip: 33380, city: "BIGANOS" } },
  { lat: 43.5915, lng: 2.21683, data: { drive: true, zip: 81100, city: "CASTRES" } },
  { lat: 44.80004, lng: -0.59541, data: { drive: true, zip: 33400, city: "TALENCE" } },
  { lat: 43.59462, lng: 1.41901, data: { drive: true, zip: 31300, city: "TOULOUSE" } },
  { lat: 43.55012, lng: 1.50215, data: { drive: true, zip: 31670, city: "LABÈGE" } },
  { lat: 43.3721, lng: -0.62537, data: { drive: true, zip: 64150, city: "MOURENX" } },
  { lat: 43.40985, lng: 3.70663, data: { drive: true, zip: 34200, city: "SÈTE" } },
  { lat: 43.2978, lng: 3.47606, data: { drive: true, zip: 34300, city: "AGDE" } },
  { lat: 43.71027, lng: -1.04371, data: { drive: true, zip: 40100, city: "DAX" } },
  { lat: 44.09113, lng: 3.08218, data: { drive: true, zip: 12100, city: "MILLAU" } },
  { lat: 43.78358, lng: 4.29962, data: { drive: true, zip: 30540, city: "MILHAUD" } },
  { lat: 42.69907, lng: 3.02246, data: { drive: true, zip: 66140, city: "CANET-EN-ROUSSILLON" } },
  { lat: 42.69355, lng: 2.84787, data: { drive: true, zip: 66000, city: "PERPIGNAN" } },
  { lat: 43.8157, lng: 4.34779, data: { drive: true, zip: 30900, city: "NÎMES" } },
  { lat: 43.82215, lng: 4.36383, data: { drive: true, zip: 30900, city: "NÎMES" } },
  { lat: 43.84039, lng: 4.35795, data: { drive: false, zip: 30900, city: "NÎMES" } },
  { lat: 44.6457, lng: -1.15791, data: { drive: true, zip: 33260, city: "LA TESTE-DE-BUCH" } },
  { lat: 42.68683, lng: 2.9069, data: { drive: true, zip: 66100, city: "PERPIGNAN" } },
  { lat: 43.62578, lng: 3.8388, data: { drive: true, zip: 34080, city: "MONTPELLIER" } },
  { lat: 42.77677, lng: 2.91531, data: { drive: true, zip: 66530, city: "CLAIRA" } },
  { lat: 43.20709, lng: 2.31086, data: { drive: true, zip: 11000, city: "CARCASSONNE" } },
  { lat: 43.20738, lng: 2.38474, data: { drive: true, zip: 11000, city: "CARCASSONNE" } },
  { lat: 43.60528, lng: 3.88051, data: { drive: false, zip: 34000, city: "MONTPELLIER" } },
  { lat: 43.21638, lng: 2.35223, data: { drive: false, zip: 11000, city: "CARCASSONNE" } },
  { lat: 45.8406, lng: 3.50801, data: { drive: true, zip: 63300, city: "THIERS" } },
  { lat: 46.85164, lng: 1.70296, data: { drive: true, zip: 36130, city: "DÉOLS" } },
  { lat: 45.75052, lng: 3.13313, data: { drive: true, zip: 63170, city: "AUBIÈRE" } },
  { lat: 46.12527, lng: 3.40138, data: { drive: true, zip: 3700, city: "BELLERIVE-SUR-ALLIER" } },
  { lat: 46.80857, lng: 4.42863, data: { drive: true, zip: 71200, city: "LE CREUSOT" } },
  { lat: 46.95621, lng: 4.31589, data: { drive: true, zip: 71400, city: "AUTUN" } },
  { lat: 47.34747, lng: 0.65567, data: { drive: false, zip: 37300, city: "JOUÉ-LÈS-TOURS" } },
  { lat: 47.38969, lng: 2.92328, data: { drive: false, zip: 58200, city: "COSNE-SUR-LOIRE" } },
  { lat: 48.19094, lng: 6.41851, data: { drive: true, zip: 88190, city: "GOLBEY" } },
  { lat: 49.22098, lng: 4.02081, data: { drive: true, zip: 51100, city: "REIMS" } },
  { lat: 48.29201, lng: 6.93812, data: { drive: true, zip: 88100, city: "SAINT-DIÉ-DES-VOSGES" } },
  { lat: 48.32859, lng: 4.10227, data: { drive: false, zip: 10150, city: "PONT-SAINTE-MARIE" } },
  { lat: 48.29987, lng: 4.07339, data: { drive: false, zip: 10000, city: "TROYES" } },
  { lat: 47.64207, lng: 6.91232, data: { drive: false, zip: 90160, city: "BESSONCOURT" } },
  { lat: 50.49519, lng: 2.57567, data: { drive: true, zip: 62700, city: "BRUAY-LA-BUISSIÈRE" } },
  { lat: 47.84352, lng: 5.33092, data: { drive: true, zip: 52200, city: "LANGRES" } },
  { lat: 49.05453, lng: 3.95601, data: { drive: true, zip: 51200, city: "ÉPERNAY" } },
  { lat: 47.63153, lng: 6.13998, data: { drive: true, zip: 70000, city: "VESOUL" } },
  { lat: 43.10343, lng: 0.38671, data: { drive: true, zip: 65300, city: "LANNEMEZAN" } },
  { lat: 44.17682, lng: 4.61917, data: { drive: true, zip: 30200, city: "BAGNOLS-SUR-CÈZE" } },
  { lat: 48.82061, lng: 2.3642, data: { drive: false, zip: 75013, city: "PARIS" } },
  { lat: 48.83315, lng: 2.27745, data: { drive: false, zip: 75015, city: "PARIS" } },
  { lat: 45.14384, lng: 5.30524, data: { drive: false, zip: 38160, city: "CHATTE" } },
  { lat: 48.56597, lng: 2.44506, data: { drive: true, zip: 91540, city: "MENNECY" } },
  { lat: 49.15382, lng: 2.25346, data: { drive: true, zip: 60230, city: "CHAMBLY" } },
  { lat: 49.4784, lng: 1.74044, data: { drive: false, zip: 76220, city: "FERRIÈRES-EN-BRAY" } },
  { lat: 49.12537, lng: 2.24885, data: { drive: true, zip: 95290, city: "L'ISLE-ADAM" } },
  { lat: 48.83774, lng: -1.55171, data: { drive: true, zip: 50400, city: "YQUELON" } },
  { lat: 50.93452, lng: 1.80784, data: { drive: false, zip: 62231, city: "COQUELLES" } },
  { lat: 43.60638, lng: 1.48269, data: { drive: true, zip: 31500, city: "TOULOUSE" } },
  { lat: 43.41383, lng: 5.35497, data: { drive: true, zip: 13170, city: "LES PENNES-MIRABEAU" } },
  { lat: 50.93712, lng: 1.86186, data: { drive: true, zip: 62100, city: "CALAIS" } },
  { lat: 48.45399, lng: -2.49809, data: { drive: false, zip: 22400, city: "LAMBALLE" } },
  { lat: 45.02697, lng: 3.88085, data: { drive: true, zip: 43750, city: "VALS-PRÈS-LE-PUY" } },
  { lat: 45.89693, lng: 0.92074, data: { drive: true, zip: 87200, city: "SAINT-JUNIEN" } },
  { lat: 43.1893, lng: 5.60407, data: { drive: true, zip: 13600, city: "LA CIOTAT" } },
  { lat: 48.60279, lng: 7.75749, data: { drive: true, zip: 67300, city: "SCHILTIGHEIM" } },
  { lat: 49.89176, lng: 2.30147, data: { drive: false, zip: 80000, city: "AMIENS" } },
  { lat: 48.14025, lng: -1.76788, data: { drive: true, zip: 35740, city: "PACÉ" } },
  { lat: 50.3411, lng: 3.51568, data: { drive: true, zip: 59300, city: "VALENCIENNES" } },
  { lat: 45.05044, lng: 5.07591, data: { drive: true, zip: 26100, city: "ROMANS-SUR-ISÈRE" } },
  { lat: 43.30388, lng: 5.41783, data: { drive: false, zip: 13012, city: "MARSEILLE" } },
  { lat: 47.76301, lng: -3.39515, data: { drive: true, zip: 56100, city: "LORIENT" } },
  { lat: 43.18081, lng: 5.69577, data: { drive: true, zip: 83270, city: "SAINT-CYR-SUR-MER" } },
  { lat: 43.20332, lng: 6.05078, data: { drive: true, zip: 83210, city: "SOLLIÈS-PONT" } },
  { lat: 44.54519, lng: 6.0636, data: { drive: true, zip: 5000, city: "GAP" } },
  { lat: 49.61259, lng: 0.77528, data: { drive: true, zip: 76190, city: "YVETOT" } },
  { lat: 50.35834, lng: 3.52377, data: { drive: false, zip: 59300, city: "VALENCIENNES" } },
  { lat: 49.75904, lng: 0.37586, data: { drive: false, zip: 76400, city: "FÉCAMP" } },
  { lat: 49.37964, lng: 6.1705, data: { drive: true, zip: 57100, city: "MANOM" } },
  { lat: 43.39371, lng: 5.13163, data: { drive: true, zip: 13220, city: "CHÂTEAUNEUF-LES-MARTIGUES" } },
  { lat: 48.63598, lng: 2.31977, data: { drive: false, zip: 91240, city: "SAINT-MICHEL-SUR-ORGE" } },
  { lat: 43.41284, lng: 5.00081, data: { drive: true, zip: 13110, city: "PORT-DE-BOUC" } },
  { lat: 43.70487, lng: 7.26519, data: { drive: false, zip: 6000, city: "NICE" } },
  { lat: 43.60686, lng: 1.30559, data: { drive: true, zip: 31770, city: "COLOMIERS" } },
  { lat: 48.83655, lng: 2.66448, data: { drive: false, zip: 77090, city: "COLLÉGIEN" } },
  { lat: 47.25079, lng: -1.61928, data: { drive: true, zip: 44800, city: "SAINT-HERBLAIN" } },
  { lat: 48.86924, lng: 2.78517, data: { drive: false, zip: 77700, city: "CHESSY" } },
  { lat: 49.19121, lng: 6.14659, data: { drive: true, zip: 57280, city: "SEMÉCOURT" } },
  { lat: 42.5346, lng: 2.84056, data: { drive: true, zip: 66160, city: "LE BOULOU" } },
  { lat: 43.26346, lng: 6.57826, data: { drive: true, zip: 83580, city: "GASSIN" } },
  { lat: 50.3467, lng: 3.28313, data: { drive: true, zip: 59490, city: "SOMAIN" } },
  { lat: 48.61677, lng: 2.54938, data: { drive: false, zip: 77127, city: "LIEUSAINT" } },
  { lat: 43.51744, lng: 4.15006, data: { drive: true, zip: 30240, city: "LE GRAU-DU-ROI" } },
  { lat: 43.43126, lng: 6.80437, data: { drive: true, zip: 83700, city: "SAINT-RAPHAËL" } },
  { lat: 44.92761, lng: -0.23948, data: { drive: false, zip: 33500, city: "LIBOURNE" } },
  { lat: 50.7383, lng: 2.54634, data: { drive: true, zip: 59190, city: "HAZEBROUCK" } },
  { lat: 50.25749, lng: 3.93521, data: { drive: false, zip: 59720, city: "LOUVROIL" } },
  { lat: 48.8302, lng: 2.35596, data: { drive: false, zip: 75013, city: "PARIS" } },
  { lat: 47.89024, lng: -3.91489, data: { drive: true, zip: 29900, city: "CONCARNEAU" } },
  { lat: 46.37976, lng: 5.83763, data: { drive: true, zip: 39200, city: "SAINT-CLAUDE" } },
  { lat: 50.73301, lng: 1.67089, data: { drive: true, zip: 62280, city: "SAINT-MARTIN-BOULOGNE" } },
  { lat: 48.01678, lng: 6.61486, data: { drive: true, zip: 88200, city: "SAINT-ÉTIENNE-LÈS-REMIREMONT" } },
  { lat: 45.92441, lng: 6.12388, data: { drive: false, zip: 74000, city: "ANNECY" } },
  { lat: 44.36068, lng: 2.57027, data: { drive: true, zip: 12000, city: "RODEZ" } },
  { lat: 42.5588, lng: 3.00721, data: { drive: true, zip: 66700, city: "ARGELÈS-SUR-MER" } },
  { lat: 47.9756, lng: 0.15911, data: { drive: true, zip: 72700, city: "ALLONNES" } },
  { lat: 44.83033, lng: -0.65312, data: { drive: true, zip: 33700, city: "MÉRIGNAC" } },
  { lat: 47.92024, lng: -2.38758, data: { drive: true, zip: 56800, city: "PLOËRMEL" } },
  { lat: 45.31051, lng: -0.93967, data: { drive: true, zip: 33340, city: "LESPARRE-MÉDOC" } },
  { lat: 43.30251, lng: 5.38128, data: { drive: false, zip: 13001, city: "MARSEILLE" } },
  { lat: 48.05528, lng: -1.73987, data: { drive: true, zip: 35170, city: "BRUZ" } },
  { lat: 48.60384, lng: -1.97581, data: { drive: true, zip: 35430, city: "SAINT-JOUAN-DES-GUÉRETS" } },
  { lat: 43.63363, lng: 7.13402, data: { drive: true, zip: 6270, city: "VILLENEUVE-LOUBET" } },
  { lat: 45.20267, lng: 5.76699, data: { drive: false, zip: 38240, city: "MEYLAN" } },
  { lat: 48.18011, lng: -2.73124, data: { drive: false, zip: 22600, city: "LOUDÉAC" } },
  { lat: 48.74828, lng: 1.92426, data: { drive: true, zip: 78310, city: "COIGNIÈRES" } },
  { lat: 48.96362, lng: 2.29001, data: { drive: true, zip: 95210, city: "SAINT-GRATIEN" } },
  { lat: 43.00557, lng: 1.12611, data: { drive: true, zip: 9190, city: "SAINT-LIZIER" } },
  { lat: 48.87308, lng: 2.33243, data: { drive: false, zip: 75009, city: "PARIS" } },
  { lat: 48.86753, lng: 2.36292, data: { drive: false, zip: 75003, city: "PARIS" } },
  { lat: 43.32439, lng: -0.3796, data: { drive: true, zip: 64140, city: "LONS" } },
  { lat: 48.87176, lng: 2.33906, data: { drive: false, zip: 75002, city: "PARIS" } },
  { lat: 47.97502, lng: 0.21526, data: { drive: true, zip: 72100, city: "LE MANS" } },
  { lat: 43.49787, lng: 4.98064, data: { drive: true, zip: 13800, city: "ISTRES" } },
  { lat: 43.5197, lng: 4.9642, data: { drive: true, zip: 13800, city: "ISTRES" } },
  { lat: 43.93186, lng: 5.06423, data: { drive: true, zip: 84800, city: "L'ISLE-SUR-LA-SORGUE" } },
  { lat: 49.86278, lng: 2.27729, data: { drive: true, zip: 80480, city: "DURY" } },
  { lat: 43.60812, lng: 3.88582, data: { drive: false, zip: 34000, city: "MONTPELLIER" } },
  { lat: 48.80373, lng: 3.0886, data: { drive: true, zip: 77120, city: "COULOMMIERS" } },
  { lat: 45.97949, lng: 4.73477, data: { drive: true, zip: 69400, city: "VILLEFRANCHE-SUR-SAÔNE" } },
  { lat: 48.55121, lng: 3.2956, data: { drive: true, zip: 77160, city: "PROVINS" } },
  { lat: 48.3759, lng: 2.95623, data: { drive: true, zip: 77130, city: "MONTEREAU-FAULT-YONNE" } },
  { lat: 49.73305, lng: 4.75233, data: { drive: true, zip: 8000, city: "VILLERS-SEMEUSE" } },
  { lat: 44.50943, lng: 0.14167, data: { drive: true, zip: 47200, city: "MARMANDE" } },
  { lat: 49.27604, lng: -0.10364, data: { drive: true, zip: 14160, city: "DIVES-SUR-MER" } },
  { lat: 48.84724, lng: 2.43692, data: { drive: false, zip: 94300, city: "VINCENNES" } },
  { lat: 48.02243, lng: 0.22789, data: { drive: true, zip: 72000, city: "LE MANS" } },
  { lat: 48.86328, lng: 1.45958, data: { drive: false, zip: 28260, city: "ANET" } },
  { lat: 49.5494, lng: 3.61421, data: { drive: true, zip: 2000, city: "LAON" } },
  { lat: 43.52929, lng: 6.47141, data: { drive: true, zip: 83300, city: "DRAGUIGNAN" } },
  { lat: 43.70025, lng: 7.27869, data: { drive: false, zip: 6300, city: "NICE" } },
  { lat: 48.81032, lng: 2.3285, data: { drive: false, zip: 94110, city: "ARCUEIL" } },
  { lat: 48.72844, lng: 2.43442, data: { drive: true, zip: 94290, city: "VILLENEUVE-LE-ROI" } },
  { lat: 50.68157, lng: 3.12795, data: { drive: true, zip: 59290, city: "WASQUEHAL" } },
  { lat: 44.54815, lng: 6.4821, data: { drive: true, zip: 5200, city: "BARATIER" } },
  { lat: 43.10359, lng: 1.63003, data: { drive: true, zip: 9100, city: "PAMIERS" } },
  { lat: 43.07452, lng: 2.21976, data: { drive: true, zip: 11300, city: "LIMOUX" } },
  { lat: 50.47552, lng: 3.2351, data: { drive: false, zip: 59310, city: "ORCHIES" } },
  { lat: 48.11598, lng: -1.709, data: { drive: false, zip: 35000, city: "RENNES" } },
  { lat: 47.0944, lng: -1.00618, data: { drive: true, zip: 49450, city: "SAINT-ANDRÉ-DE-LA-MARCHE" } },
  { lat: 49.56975, lng: 2.9801, data: { drive: true, zip: 60400, city: "NOYON" } },
  { lat: 49.40969, lng: 2.78425, data: { drive: false, zip: 60280, city: "VENETTE" } },
  { lat: 43.81766, lng: 4.61405, data: { drive: true, zip: 30300, city: "BEAUCAIRE" } },
  { lat: 43.45525, lng: 5.84918, data: { drive: false, zip: 83470, city: "SAINT-MAXIMIN-LA-SAINTE-BAUME" } },
  { lat: 43.40905, lng: 6.04965, data: { drive: true, zip: 83170, city: "BRIGNOLES" } },
  { lat: 43.55214, lng: 7.01534, data: { drive: false, zip: 6400, city: "CANNES" } },
  { lat: 43.46599, lng: 5.60611, data: { drive: true, zip: 13710, city: "FUVEAU" } },
  { lat: 46.98855, lng: 3.16448, data: { drive: true, zip: 58000, city: "NEVERS" } },
  { lat: 48.39687, lng: 2.95274, data: { drive: false, zip: 77130, city: "MONTEREAU-FAULT-YONNE" } },
  { lat: 44.05703, lng: 1.10027, data: { drive: true, zip: 82100, city: "CASTELSARRASIN" } },
  { lat: 49.86364, lng: 3.29186, data: { drive: true, zip: 2100, city: "SAINT-QUENTIN" } },
  { lat: 48.80961, lng: 2.47142, data: { drive: false, zip: 94100, city: "SAINT-MAUR-DES-FOSSÉS" } },
  { lat: 49.1565, lng: 1.34836, data: { drive: true, zip: 27600, city: "GAILLON" } },
  { lat: 45.75395, lng: 4.80552, data: { drive: true, zip: 69005, city: "LYON" } },
  { lat: 50.58694, lng: 3.08732, data: { drive: true, zip: 59810, city: "LESQUIN" } },
  { lat: 48.76961, lng: 2.06097, data: { drive: true, zip: 78280, city: "GUYANCOURT" } },
  { lat: 48.59721, lng: 1.67741, data: { drive: false, zip: 28130, city: "HANCHES" } },
  { lat: 48.70738, lng: 2.49575, data: { drive: true, zip: 91330, city: "YERRES" } },
  { lat: 46.12793, lng: 5.81155, data: { drive: true, zip: 1200, city: "CHÂTILLON-EN-MICHAILLE" } },
  { lat: 48.80561, lng: 2.13137, data: { drive: true, zip: 78000, city: "VERSAILLES" } },
  { lat: 48.84728, lng: 2.3866, data: { drive: false, zip: 75012, city: "PARIS" } },
  { lat: 48.4987, lng: 2.35171, data: { drive: true, zip: 91760, city: "ITTEVILLE" } },
  { lat: 49.2861, lng: -0.70443, data: { drive: true, zip: 14400, city: "BAYEUX" } },
  { lat: 48.58519, lng: 2.44699, data: { drive: false, zip: 91100, city: "VILLABÉ" } },
  { lat: 48.87389, lng: 2.38512, data: { drive: false, zip: 75019, city: "PARIS" } },
  { lat: 43.96112, lng: 4.74895, data: { drive: true, zip: 30133, city: "LES ANGLES" } },
  { lat: 44.90226, lng: 1.21115, data: { drive: true, zip: 24200, city: "SARLAT-LA-CANÉDA" } },
  { lat: 44.95616, lng: -0.62945, data: { drive: false, zip: 33290, city: "LE PIAN-MÉDOC" } },
  { lat: 48.73409, lng: 1.36299, data: { drive: true, zip: 28100, city: "DREUX" } },
  { lat: 48.68341, lng: 2.53421, data: { drive: true, zip: 91800, city: "BOUSSY-SAINT-ANTOINE" } },
  { lat: 49.3904, lng: 2.78926, data: { drive: true, zip: 60200, city: "COMPIÈGNE" } },
  { lat: 45.46378, lng: 4.39978, data: { drive: true, zip: 42000, city: "SAINT-ÉTIENNE" } },
  { lat: 48.89107, lng: 2.23926, data: { drive: false, zip: 92800, city: "PUTEAUX" } },
  { lat: 48.57722, lng: 7.76786, data: { drive: false, zip: 67000, city: "STRASBOURG" } },
  { lat: 47.28372, lng: -1.45321, data: { drive: false, zip: 44470, city: "CARQUEFOU" } },
  { lat: 48.57474, lng: 7.7561, data: { drive: false, zip: 67100, city: "STRASBOURG" } },
  { lat: 48.69417, lng: 6.12801, data: { drive: true, zip: 54520, city: "LAXOU" } },
  { lat: 47.33718, lng: 5.03413, data: { drive: true, zip: 21121, city: "FONTAINE-LÈS-DIJON" } },
  { lat: 43.3069, lng: -0.33246, data: { drive: true, zip: 64000, city: "PAU" } },
  { lat: 48.08946, lng: 1.33393, data: { drive: true, zip: 28200, city: "CHÂTEAUDUN" } },
  { lat: 45.77578, lng: 4.80164, data: { drive: false, zip: 69009, city: "LYON" } },
  { lat: 48.95702, lng: 2.88461, data: { drive: false, zip: 77100, city: "MEAUX" } },
  { lat: 48.90731, lng: 2.48977, data: { drive: false, zip: 93140, city: "BONDY" } },
  { lat: 48.83039, lng: 2.70975, data: { drive: true, zip: 77600, city: "BUSSY-SAINT-GEORGES" } },
  { lat: 49.03751, lng: 1.59336, data: { drive: true, zip: 78840, city: "FRENEUSE" } },
  { lat: 49.20864, lng: 2.60246, data: { drive: true, zip: 60300, city: "SENLIS" } },
  { lat: 50.33293, lng: 3.51211, data: { drive: true, zip: 59300, city: "AULNOY-LEZ-VALENCIENNES" } },
  { lat: 50.40613, lng: 2.9762, data: { drive: true, zip: 62110, city: "HÉNIN-BEAUMONT" } },
  { lat: 48.95827, lng: 2.32945, data: { drive: true, zip: 93800, city: "ÉPINAY-SUR-SEINE" } },
  { lat: 47.38091, lng: -1.64448, data: { drive: false, zip: 44810, city: "HÉRIC" } },
  { lat: 46.97047, lng: -1.33153, data: { drive: false, zip: 85600, city: "BOUFFÉRÉ" } },
  { lat: 46.04532, lng: 4.05548, data: { drive: true, zip: 42153, city: "RIORGES" } },
  { lat: 45.35301, lng: 5.33501, data: { drive: true, zip: 38590, city: "SAINT-ÉTIENNE-DE-SAINT-GEOIRS" } },
  { lat: 45.86416, lng: 6.62534, data: { drive: false, zip: 74120, city: "MEGÈVE" } },
  { lat: 47.48832, lng: -0.54378, data: { drive: true, zip: 49100, city: "ANGERS" } },
  { lat: 43.17459, lng: 2.99269, data: { drive: true, zip: 11100, city: "NARBONNE" } }
];