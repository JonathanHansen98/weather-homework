$(document).ready(function () {
    let savedSearches = JSON.parse(localStorage.getItem("saved searches"))
    if (savedSearches === null) {
        savedSearches = [];
    }
    else if (savedSearches !== null) {
        for (let index = 0; index < savedSearches.length; index++) {
            let nameRow = $("<div>")
            $(nameRow).attr("class", "row")
            let nameCol = $("<div>")
            $(nameCol).attr("class", "col-12")
            let cityTag = $("<p>")
            $(cityTag).text(savedSearches[index])
            $(cityTag).attr("class", "past-search")
            nameCol.append(cityTag)
            nameRow.append(nameCol)
            $("#past-cities").prepend(nameRow)
        }
    }

    $("#clear-btn").click(function () {
        localStorage.clear()
        $("#past-cities").empty()
        location.reload()
    })

    $(".past-search").click(function (e) {
        let clicked = $(this)[0].innerText
        let appID = "c72069b9fb7b44e0bf302d327be440b0";
        const queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + clicked + "&appid=" + appID;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (res) {
            $(".clear").empty()
            displayCity(queryURL, appID)
        })
    })
        
    $("#search-btn").click(function (e) {
        var search = $("#search").val()
        let appID = "c72069b9fb7b44e0bf302d327be440b0";
        const queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + search + "&appid=" + appID;
        if (search === "") {
            alert("Please choose a City")
        } else {
            e.preventDefault()
            $("#five-day-forecast").empty()
            $(".clear").empty()
            displayCity(queryURL, appID)
            $("#search-form").trigger("reset")
        }
    })

    function displayCity(queryURL, appID) {
        $("#five-day-forcast").empty()
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (res) {
            let oneCall = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + res.coord.lat + "&lon=" + res.coord.lon + "&appid=" + appID
            $(".hide").removeClass("hide")
            // Get City,Country names and append to html
            let cityName = res.name
            let country = res.sys.country
            let nameTag = $("<h1>")
            $(nameTag).text(cityName + ", " + country)
            $("#name").append(nameTag)
            // Get temps and append to html
            let temp = res.main.temp
            let high = res.main.temp_max
            let low = res.main.temp_min
            let tempEl = $("<p>")
            let highEl = $("<p>")
            let lowEl = $("<p>")
            $(tempEl).text("Current Temp: " + temp)
            $(highEl).text("Today's High: " + high)
            $(lowEl).text("Today's Low: " + low)
            $("#current-temp").append(tempEl)
            $("#high").append(highEl)
            $("#low").append(lowEl)
            let condition = res.weather[0].description
            let condFixed = condition.charAt(0).toUpperCase() + condition.slice(1)
            let condEl = $("<p>")
            $(condEl).text("Current Conditions: " + condFixed)
            $("#current-conditions").append(condEl)
            var prefix = 'wi-';
            let iconCode = res.weather[0].id
            var icon = weatherIcons[iconCode].icon;
            if (!(iconCode > 699 && iconCode < 800) && !(iconCode > 899 && iconCode < 1000)) {
                icon = 'day-' + icon;
            }
            icon = prefix + icon;
            console.log(icon)
            let iconEl = $("<img>")
            $(iconEl).attr("src", "./img/svg/" + icon + ".svg")
            $(iconEl).attr("class", "icon")
            $(iconEl).attr("class", "w-50")
            $("#weather-img").append(iconEl)
            // Append Past Cities
            let nameRow = $("<div>")
            $(nameRow).attr("class", "row")
            let nameCol = $("<div>")
            $(nameCol).attr("class", "col-12")
            let cityTag = $("<p>")
            $(cityTag).text(cityName)
            $(cityTag).attr("class", "past-search")
            nameCol.append(cityTag)
            nameRow.append(nameCol)
            $("#past-cities").prepend(nameRow)
            savedSearches.push(cityName)
            localStorage.setItem("saved searches", JSON.stringify(savedSearches))
            // Make UV index ajax call
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/uvi?appid=" + appID + "&lat=" + res.coord.lat + "&lon=" + res.coord.lon,
                method: "GET"
            }).then(function (res2) {
                // console.log(res2)
                let uvIndex = parseInt(res2.value)
                let uvEl = $("<p>")
                uvEl.attr("class", "uvInd d-inline")
                $(uvEl).text("UV Index: " + uvIndex)
                $("#uvInd").append(uvEl)
                if (uvIndex >= 0 && uvIndex <= 2) {
                    uvEl.addClass("favorable")
                }
                else if (uvIndex >= 3 && uvIndex <= 7) {
                    uvEl.addClass("moderate")
                }
                else if (uvIndex >= 8) {
                    uvEl.addClass("severe")
                }
            })
            $.ajax({
                url: oneCall,
                method: "GET"
            }).then(function (res3) {
                console.log(res3)
                let week = res3.daily
                for (let index = 1; index < 6; index++) {
                    console.log(week[index])
                    let cityUTC = new Date(parseInt(week[index].dt) * 1000)
                    let convertedTime = cityUTC.toUTCString()
                    let time = (convertedTime.slice(0, 17))
                    // 
                    let mainCard = $("<div>")
                    mainCard.addClass("col-sm-2 text-center forecast-card mx-auto")
                    let nameRow = $("<div>")
                    nameRow.attr("class", "row")
                    let nameCol = $("<div>")
                    nameCol.attr("class", "col-12")
                    let nameEl = $("<h4>")
                    nameEl.text(time)
                    nameCol.append(nameEl)
                    nameRow.append(nameCol)
                    mainCard.append(nameRow)
                    // 
                    let highRow = $("<div>")
                    highRow.attr("class", "row")
                    let highCol = $("<div>")
                    highCol.attr("class", "col-12")
                    let highEl = $("<h5>")
                    highEl.text("High: " + week[index].temp.max)
                    highCol.append(highEl)
                    highRow.append(highCol)
                    mainCard.append(highRow)
                    // 
                    let lowRow = $("<div>")
                    lowRow.attr("class", "row")
                    let lowCol = $("<div>")
                    lowCol.attr("class", "col-12")
                    let lowEl = $("<h5>")
                    lowEl.text("Low: " + week[index].temp.min)
                    lowCol.append(lowEl)
                    lowRow.append(lowCol)
                    mainCard.append(lowRow)
                    //
                    let condRow = $("<div>")
                    condRow.attr("class", "row")
                    let condCol = $("<div>")
                    condCol.attr("class", "col-12")
                    let condEl = $("<h5>")
                    let descrip = week[index].weather[0].description
                    let descripFixed = descrip.charAt(0).toUpperCase() + descrip.slice(1)
                    console.log(descripFixed)
                    condEl.text(descripFixed)
                    condCol.append(condEl)
                    condRow.append(condCol)
                    // Icon
                    console.log(week[index].weather[0].id)
                    var prefix = 'wi wi-';
                    var code = week[index].weather[0].id;
                    var icon = weatherIcons[code].icon;
                    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
                        icon = 'day-' + icon;
                    }
                    icon = prefix + icon;
                    let iconEl = $("<i>")
                    iconEl.addClass(icon)
                    iconEl.addClass("icon-i")
                    mainCard.append(condRow)
                    condCol.append(iconEl)
                    $("#five-day-forcast").append(mainCard)
                }
            })
        })
    }


})


