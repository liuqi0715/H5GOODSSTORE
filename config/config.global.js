$.ajaxPrefilter( function(options, originalOptions, jqXHR){
    /*options对象 包括accepts、crossDomain、contentType、url、async、type、headers、error、dataType等许多参数选项
    originalOptions对象 就是你为$.ajax()方法传递的参数对象，也就是 { url: "/index.php" }
    jqXHR对象 就是经过jQuery封装的XMLHttpRequest对象(保留了其本身的属性和方法)
    1.判断基本类型：
    Object.prototype.toString.call(null);//”[object Null]”
    Object.prototype.toString.call(undefined);//”[object Undefined]”
    Object.prototype.toString.call(“abc”);//”[object String]”
    Object.prototype.toString.call(123);//”[object Number]”
    Object.prototype.toString.call(true);//”[object Boolean]”*/

    var token0 = localStorage.getItem('token');

    options.url = 'http://192.168.0.156:8019'+options.url
    if(Object.prototype.toString.call(options.data) == "[object FormData]"){
        options.data.append("userid","11111");
    }else if(Object.prototype.toString.call(options.data) == "[object String]"){
        if(Object.prototype.toString.call(originalOptions.data) == "[object Object]"){
            // options.data = $.param($.extend(originalOptions.data||{}, {
            //     userid: "1111111"
            // }));


        }else if(Object.prototype.toString.call(originalOptions.data) == "[object String]"){
            options.data = JSON.parse(options.data);
            // options.data.token = token0;
            options.data.token = "7f035958-451a-4dca-98f2-62fbad8c186b"
            options.data = JSON.stringify(options.data);
        }
    }else if(options.data==undefined){
        var params = {
            // "token":token0
            "token":"7f035958-451a-4dca-98f2-62fbad8c186b"
        } 
        options.data = JSON.stringify(params) ;
    }
});
    $.ajaxSetup({success:function(result){
        console.log(result,"result")
    },
    complete:function (XMLHttpRequest, textStatus) {
        // console.log(XMLHttpRequest,textStatus)
        // if (XMLHttpRequest.responseJSON.errorInfo==null){
        //     // console.log(XMLHttpRequest.responseJSON.data,"XMLHttpRequest.responseJSON.data")
        // } else {
        //     // console.log('測試是否監聽到成功狀態并統一響應')
        // }
    }
});