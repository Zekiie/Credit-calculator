//Taken element by id
var element = function (id) {
    return document.getElementById(id);
};

var today = new Date(),
    sliderSum = element('sumSlider'),
    sliderDay = element('daySlider'),
    sum = element('sum'),
    sumLabel = element('sumLabel'),
    days = element('datepicker'),
    dayLabel = element('dayLabel'),
    recievesum = element('recieve-sum'),
    persentRes = element("percent"),
    returnDay = element('data-return');

$(function() {
    $( "#datepicker" ).datepicker({
        showOn: "button",
        buttonImage: "https://s7.postimg.org/t5326waa3/cal.png",
        buttonImageOnly: true,
        buttonText: "Выберите дату",
        hidden: false,
        dateFormat: "dd MM yy, D",
        minDate: 0,
        maxDate: 29,
        onSelect: function (dateStr) {
            returnDay.innerText = this.value;
            var date = $(this).datepicker('getDate'),
                dayResult = Math.round((date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))+1;
            dayLabel.innerText = dayResult;
            sliderDay.value = dayResult;
            days.value = dayResult;
            percent();
            returnSum();
            changerSlider ();
        }
    })
});

//Russification calendar

$( function( factory ) {
        // Browser globals
        factory( jQuery.datepicker );
}( function( datepicker ) {

    datepicker.regional.ru = {
        closeText: "Закрыть",
        prevText: "&#x3C;Пред",
        nextText: "След&#x3E;",
        currentText: "Сегодня",
        monthNames: [ "январь","февраль","март","апрель","май","июнь",
            "июль","август","сентябрь","октябрь","ноябрь","декабрь" ],
        dayNamesShort: [ "Вс","Пн","Вт","Ср","Чт","Пт","Сб" ],
        dayNamesMin: [ "Вс","Пн","Вт","Ср","Чт","Пт","Сб" ],
        weekHeader: "Нед",
        dateFormat: "dd.mm.yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: "" };
    datepicker.setDefaults( datepicker.regional.ru );

    return datepicker.regional.ru;

} ) );

//Display time + 8 minute from now
    function time () {
    var arr =[],
        hours = today.getHours() === 24 ? '0' + 0: today.getHours(),
        minutes = (today.getMinutes() + 8) < 10 ? '0' + (today.getMinutes()+8): (today.getMinutes()+8);
    if (hours < 10 && hours !== "00") {
            hours = '0' + hours;
        }
    if (minutes >= 60) {
        minutes = '0' + (minutes - 60);
        hours ++;
        if (hours < 10 && hours !== "00") {
            hours = '0' + hours;
        }
    }
        arr.push(hours, minutes);
        return arr.join('').split('');
    }
// console.log(time());

   window.onload = function () {
        element('hour-1').innerHTML = time()[0];
        element('hour-2').innerHTML = time()[1];
        element('minute-1').innerHTML = time()[2];
        element('minute-2').innerHTML = time()[3];
};

// Slider functions

function changerSlider () {
    var el, newPoint, newPlace, offset;

    $("input[type='range']").change(function() {
        el = $(this);
        width = el.width();

        newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
        offset = 15.5;

        if (newPoint < 0) { newPlace = 0; }
        else if (newPoint > 1) { newPlace = width; }
        else { newPlace = width * newPoint + offset; offset -= newPoint; }

        el
            .next(".range-output")
            .css({
                left: newPlace,
                marginLeft: offset + "%"
            });
        $(this).css('background',
            '-webkit-gradient(linear, left top, right top, '
            + 'color-stop(' + newPoint + ', #71B023), '
            + 'color-stop(' + newPoint + ', #CCCCCC)'
            + ')'
        );

    })
        .trigger('change');
}

$(changerSlider());


//Percentage function

function percent() {
    var per = (sliderSum.value/10000)*days.value;
    persentRes.innerText = per.toFixed(2) + " грн";
    return (+per.toFixed(2));
}

//Returned Sum
function returnSum () {
    var result = +sum.value + percent();
    element('returnSum').innerText = result;
}


//Sum Slider and all outputs
sliderSum.oninput = function() {
    sum.value = this.value;
    sumLabel.innerText = this.value;
    recievesum.innerText = this.value + " грн";
    percent();
    returnSum();
};
sum.onchange = function() {
    if(this.value > +sliderSum.max){
        this.value = sliderSum.max;
    }
    if (this.value < 50 || isNaN(this.value)) {
        this.value = sliderSum.min;
    }
    sliderSum.value = this.value;
    sumLabel.innerText = this.value;
    recievesum.innerText = this.value + " грн";
    percent();
    returnSum();
};

var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
    };

//Day Slider and all outputs
sliderDay.oninput = function() {
    days.value = this.value;
    dayLabel.innerText = this.value;
    res = (today.getUTCDate()+ +this.value - 1);
    returnDay.innerText = changeDay(res);
    percent();
    returnSum();
};
days.onchange = function() {
    if (this.value > 31) {
        this.value = sliderDay.max;
    }
    if (this.value < 1) {
        this.value = sliderDay.min;
    }
    sliderDay.value = this.value;
    dayLabel.innerText = this.value;
    res = (today.getUTCDate()+ +this.value - 1);
    returnDay.innerText = changeDay(res);
    percent();
    returnSum ()
};

function changeDay (n) {
    var a = today.toLocaleString("ru", options).split(' ');
    a.pop();
    if (n > 30) {
       n = (today.getUTCDate()+ +days.value - 31);
       a.splice(0, 1, n);
       a.splice(1, 1, 'мая');
    }
    a.splice(0, 1, n);
    return a.join(' ');
}

//Buttons minus and plus
var plusSumBtn = element('add-sum'),
    minusSumBtn = element('subst-sum'),
    plusDayBtn = element('add-day'),
    minusDayBtn = element('subst-day'),
    stepSum = sliderSum.step,
    stepDay = sliderDay.step;

function addSum(){
    sliderSum.value = +sliderSum.value + +stepSum;
    sumLabel.innerText = sliderSum.value;
    sum.value = sliderSum.value;
    recievesum.innerText = sliderSum.value + " грн";
    percent();
    returnSum();
}

function substrctSum(){
    sliderSum.value = +sliderSum.value - +stepSum;
    sumLabel.innerText = sliderSum.value;
    sum.value = sliderSum.value;
    recievesum.innerText = sliderSum.value + " грн";
    percent();
    returnSum();
}

function addDay(){
    sliderDay.value = +sliderDay.value + +stepDay;
    dayLabel.innerText = sliderDay.value;
    days.value = sliderDay.value;
    res = (today.getUTCDate()+ +sliderDay.value - 1);
    returnDay.innerText = changeDay(res);
    percent();
    returnSum();
}

function substrctDay(){
    sliderDay.value = +sliderDay.value - +stepDay;
    dayLabel.innerText = sliderDay.value;
    days.value = sliderDay.value;
    res = (today.getUTCDate()+ +sliderDay.value - 1);
    returnDay.innerText = changeDay(res);
    percent();
    returnSum();
}

plusSumBtn.addEventListener('click', addSum);
minusSumBtn.addEventListener('click', substrctSum);
plusDayBtn.addEventListener('click', addDay);
minusDayBtn.addEventListener('click', substrctDay);

//Slider Color changer and tooltip moving functions

$('#subst-sum, #subst-day, #add-day, #add-sum, #sum, .box-value').on('click change', function () {
    var el, newPoint, newPlace, offset;

    $("input[type='range']").change(function() {
        el = $(this);
        width = el.width();

        newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
        offset = 15.5;

        if (newPoint < 0) { newPlace = 0; }
        else if (newPoint > 1) { newPlace = width; }
        else { newPlace = width * newPoint + offset; offset -= newPoint; }

        el
            .next(".range-output")
            .css({
                left: newPlace,
                marginLeft: offset + "%"
            });
        $(this).css('background',
            '-webkit-gradient(linear, left top, right top, '
            + 'color-stop(' + newPoint + ', #71B023), '
            + 'color-stop(' + newPoint + ', #CCCCCC)'
            + ')',
            '-moz-linear-gradient(linear, left top, right top, '
            + 'color-stop(' + newPoint + ', #71B023), '
            + 'color-stop(' + newPoint + ', #CCCCCC)'
            + ')'
        );

    })
        .trigger('change');
});









