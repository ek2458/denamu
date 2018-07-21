// CUSTOM JS FILE //
window.addEventListener('load',init);

function init(){
    // on page load, get data and render
    getData();
}

function getData(){
    $.ajax({
        url: '/api/get',
        type: 'GET',
        failure: function(err){
            console.log ("Could not get the data");
            return alert("Something went wrong");
        },
        success: function(data) {
            console.log(data);
            var secretes = data.secretes;
            secretes.forEach(function(currentSecrete){
                var htmlToAppend =
                '<div class="col-md-4 card">'+
                  '<h2>'+currentSecrete.title+'</h2>'+
                    '<p>'+currentSecrete.secrete.substr(0, 280)+'</p>'+
                    '<div class="control-panel">'+
                        '<a href="/sori/'+currentSecrete._id+'">더 읽기</a>'+
                    '</div>'+
                '</div>'
                $('#secrete-holder').append(htmlToAppend);
            });

            secretes.forEach(function(currentSecrete){
                var htmlToAppend =
                '<div class="col-md-4 card">'+
                  '<h2>'+currentSecrete.title+'</h2>'+
                    '<p>'+currentSecrete.secrete.substr(0, 280)+'</p>'+
                    '<div class="control-panel">'+
                        '<a href="/sori/'+currentSecrete._id+'">더 읽기</a>'+
                        '<a href="/blowaway/'+currentSecrete._id+'">삭제</a>'+
                    '</div>'+
                '</div>'
                $('#secrete-holder02').append(htmlToAppend);
            });
        }
    });
}
