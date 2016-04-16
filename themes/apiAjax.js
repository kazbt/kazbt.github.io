var urlAPI = "https://api.kazbt.com";
function getRecent() {
    $.getJSON( urlAPI+"/recent/", function( data ) {
        $("#recent").html('');
        $(data).each(function( index ) {
            if(data[index].timesChecked[0].isAccessible === false ) {
                $("#recent").append('<p><div class="ui error message">'+escape(data[index].domain)+'</div></p>');
            } else {
                $("#recent").append('<p><div class="ui info message">'+escape(data[index].domain)+'</div></p>');
            }
        });
    });
}
function getBlocked() {
    $.getJSON( urlAPI+"/blocked/", function( data ) {
        if(data !=null) {
            $("#loadingTxt").html('');
            $(data).each(function( index ) {
				if (index < 14 ) {
					$("#blocked").append('<div class="item"><div class="content">'+escape(data[index].domain)+'</div></div>');
				}
				else {
					$("#accContent").append('<p>'+escape(data[index].domain)+'</p>');
				}
            });
        }
    }).fail(function ( data) {
        $("#isError503").toggleClass('hidden');
    });
}
function getCounter() {
    $.getJSON( urlAPI+"/total/", function( data ) {
        $("#numBlocked").html('');
        $("#numBlocked").append(escape(data.count));
        if (document.URL.indexOf('en.html') > -1) {
            $('#twitterBtn').attr('href', 'https://twitter.com/intent/tweet?text='+escape(data.count)+' websites are blocked in Kazakhstan&url=http://kazbt.com')
        } else {
            $('#twitterBtn').attr('href', 'https://twitter.com/intent/tweet?text=В Казахстане заблокировано '+
        escape(data.count)+' сайтов&url=http://kazbt.com')   
        }
    });
}
function isValidURL(url) {
	// allow to query IPs
    return /^((\w+\.)?\w+\.\w+|((2[0-5]{2}|1[0-9]{2}|[0-9]{1,2})\.){3}(2[0-5]{2}|1[0-9]{2}|[0-9]{1,2}))(\/)?$/.test(url);
}
getCounter();
getBlocked();
getRecent();

function doRequest() {
    var host = $("#hostname").val();
    if (!$("#isError503").hasClass('hidden')) {
        $("#isError503").toggleClass('hidden');
    }
    if (!$("#isError400").hasClass('hidden')) {
        $("#isError400").toggleClass('hidden');
    }
    if (!$("#isBad").hasClass('hidden')) {
        $("#isBad").toggleClass('hidden');
    }
    if (!$("#isGood").hasClass('hidden')) {
        $("#isGood").toggleClass('hidden');
    }
    if (host === '') {
        $('#errorMsg').html('');
        if (document.URL.indexOf('en.html') > -1) {
            $('#errorMsg').append('Please enter a website domain');   
        } else {
            $('#errorMsg').append('Пожалуйста, введите адрес веб-сайта');
        }
        if ($("#errorMsg").hasClass('hidden')) {
            $("#errorMsg").toggleClass('hidden visible');
        }
        return;
    } else if (!isValidURL(host)) {
        $('#errorMsg').html('');
        if (document.URL.indexOf('en.html') > -1) {
            $('#errorMsg').append('Please enter a valid domain');
        } else {
            $('#errorMsg').append('Введите правильный адрес веб-сайта');
        }
        if ($("#errorMsg").hasClass('hidden')) {
            $("#errorMsg").toggleClass('hidden visible');
        }
        return;
    } else {
        if (!$("#errorMsg").hasClass('hidden')) {
            $("#errorMsg").toggleClass('hidden visible');
        }
        if ($("#loading").hasClass('hidden')) {
            $("#loading").toggleClass('hidden');
        }
        $.getJSON( urlAPI+"?check="+host, function( data ) {
            $("#loading").toggleClass('hidden');
            if (data.code == 503) {
                $("#isError503").toggleClass('hidden');
            } else if (data.code == 400) {
                $("#isError400").toggleClass('hidden');
            }
            else {
                var result = $(data.timesChecked).get(-1).isAccessible;
                var f = new Date($(data.timesChecked).get(-1).dateChecked);
                if(result === false ) {
                    $('#timeCheckedB').html('');
                    $("#isBad").toggleClass('hidden');
                    $('#timeCheckedB').append('<abbr title="'+f+'">('+$.timeago(f)+')</abbr>');
                }
                else {
                    $('#timeCheckedG').html('');
                    $("#isGood").toggleClass('hidden');
                    $('#timeCheckedG').append('<abbr title="'+f+'">('+$.timeago(f)+')</abbr>');
                }
                getRecent();
            }
        });
        //$("#hostname").val('');
    }
}