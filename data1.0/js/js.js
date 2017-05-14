//渲染html
function appendHtml(json){
    var json = '<tr title="'+ json.id_  +'">' +
                    '<td><input class="checkS" type="checkbox"  title="'+ json.id_  +'"></td>' +
                    '<td>'+ json.id_ +'</td>' +
                    '<td><input type="text" value="'+ json.classify +'" disabled></td>' +
                    '<td><input type="text" value="'+ json.heading +'" disabled></td>' +
                    '<td><input type="text" value="'+ json.grade +'" disabled></td>' +
                    '<td><input type="text" value="'+ json.status +'" disabled></td>' +
                    '<td><input type="text" value="'+ json.createTime +'" disabled></td>' +
                    '<td><input type="text" value="'+ json.creator +'" disabled></td>' +
                    '<td><input type="text" value="'+ json.area +'" disabled></td>' +
                    '<td><input class="del" type="button" value="删除" title="'+ json.id_ +'"></td>' +
                '</tr>';
    return json;
}

//循环插入已有数据
function initHtml(datas){
    $('tbody').html('');
    $.each(datas, function(key, val){
        $('tbody').append(appendHtml(val));
    })
}

initHtml(data);  //页面渲染

//删除数据
function delData(id){
    for(var i = 0; i < data.length; i ++){
        if(id == data[i].id_){
            data.splice(i, 1);
        }
    }
}

$('body').on('click', '.del', function(){
    var id = parseInt($(this).attr('title'));
    delData(id);
    $(this).parent('td').parent('tr').remove();
})

//添加数据
var names = {                 //获取输入框名
    classify: '.classify',
    heading: '.heading',
    grade: '.grade',
    status: '.status',
    createTime: '.createTime',
    creator: '.creator',
    area: '.area'
}

var id_ = 0;
$.each(data, function(key, val){
    if(val.id_ > id_){
        id_ = val.id_;
    }
})

function addData(names, error){
    var sta = 0;                         //判断输入值是否为空
    $.each(names, function(key, val){
        if($(val).val() == ''){
            sta += 1;
        }else {
            sta += 0;
        }
    })
    if(sta > 0){
        $(error).show();
        return false;
    }else {
        $(error).hide();
        var data = {                                //得到输入数据
            classify: $(names.classify).val(),
            heading: $(names.heading).val(),
            grade: $(names.grade).val(),
            status: $(names.status).val(),
            createTime: $(names.createTime).val(),
            creator: $(names.creator).val(),
            area: $(names.area).val()  
        };
        return data;
    }
}

function clearInp(names){               //清空输入
    $.each(names, function(key, val){
        $(val).val('');
    })
}

var val;
$('.addBtn').on('click', function(){
    if(addData(names, '.error')){
        val = addData(names, '.error');
        id_ ++;
        val.id_ = id_;
        data.unshift(val);
        initHtml(data);
        clearInp(names);
    }
})

//顺序倒序
function sort(data, sta, fun){
    var tmp;
    if(sta){
        for(var i = 0; i < data.length; i ++){
            for(var j = i; j < data.length; j++){
                if(data[i].id_ > data[j].id_){
                    tmp = data[i];
                    data[i] = data[j];
                    data[j] = tmp;
                }
            }
        }
    }else {
        for(var i = 0; i < data.length; i ++){
            for(var j = i; j < data.length; j++){
                if(data[i].id_ < data[j].id_){
                    tmp = data[i];
                    data[i] = data[j];
                    data[j] = tmp;
                }
            }
        }
    }
    fun();
}

var sta = 1;
$('.up-down').on('click', function(){
    if(sta == 1){
        sort(data, false, function(){
            initHtml(data);
        });
        sta = 0;
        $(this).html('&#xe605;');
    }else {
        sort(data, true, function(){
            initHtml(data);
        });
        sta = 1;
        $(this).html('&#xe6e1;');
    }
})

//全选和全不选
var selects = [];                              //所有选中的checkbox
$('body').on('click', '.checkS', function(){
    var id = parseInt($(this).attr('title'));
    if($(this).hasClass('q')){
        $.each(selects, function(key, val){
            if(id == val){
                selects.splice(key, 1);
            }
        })
        $('.checkAll').removeAttr('checked').removeClass('q');
        $(this).removeClass('q');
    }else {
        selects.push(id);
        $(this).addClass('q');
        if(selects.length == $('tbody tr').length){
            $('.checkAll').attr('checked', true).addClass('q');
        }
    }
})

//全选
$('.checkAll').on('click', function(){
    if($(this).attr('checked')){
        $('.checkS').attr('checked', true);
    }else {
        $('.checkS').attr('checked', false);
    }
})

//选中删除
$('.delete').on('click', function(){
    var delSel = [];
    if($('.checkAll').attr('checked')){      //如果全选
        data = [];
        $('tbody').html('');
        $('.checkAll').attr('checked', false);
    }else {                                  //非全选
        $.each(selects, function(key, val){
            for(var i = 0; i < data.length; i ++){
                if(val == data[i].id_){
                    delSel.push(val);
                    data.splice(i, 1);
                    $.each(delSel, function(key, val){
                        $('tr').each(function(){
                            var id = parseInt($(this).attr('title'));
                            if(val == id){
                                $(this).remove();
                            }
                        })
                    })
                }
            }
        })   
    }
    selects = [];
})

//键盘上下移动 delete键删除
$('tbody tr').eq(0).addClass('h');

var ind = $('tbody tr.h').index();

$(window).keydown(function(e){
    var key = e.keyCode;
    switch(key){
        case 38:
            if(ind > 0){
                ind --;
            }
            $('tbody tr').eq(ind).addClass('h').siblings('tr').removeClass('h');
        break;
        case 40:
            if(ind < $('tbody tr').length - 1){
                ind ++;
            }
            $('tbody tr').eq(ind).addClass('h').siblings('tr').removeClass('h');
        break;
        case 46:
            /*$.each(selects, function(key, val){
                for(var i = 0; i < data.length; i ++){
                    if(val == data[i].id_){
                        data.splice(i, 1);
                        $('tr').each(function(){
                            var id = $(this).attr('title');
                            if(val == id){
                                $(this).remove();
                            }
                        })
                    }
                }
            })*/
            var id = $('tbody tr.h').attr('title');
            $('tbody tr.h').remove();
            $('tr').each(function (){
                console.log(id);
                for(var i = 0; i < data.length; i ++){
                    if(id == data[i].id_){
                        data.splice(i, 1);
                    }
                }
            })
            ind = 0;
            $('tbody tr').eq(ind).addClass('h').siblings('tr').removeClass('h');
        break;
        case 13:
            var id = $('tbody tr').eq(ind).attr('title');
            var html_ = $('tbody tr').eq(ind).children('td').eq(0).children('input');
            if(html_.hasClass('q')){
                $.each(selects, function(key, val){
                    if(id == val){
                        selects.splice(key, 1);
                    }
                })
                $('.checkAll').removeAttr('checked').removeClass('q');
                html_.removeClass('q');
                html_.removeAttr('checked');
            }else {
                selects.push(id);
                html_.attr('checked', true);
                html_.addClass('q');
                if(selects.length == $('tbody tr').length){
                    $('.checkAll').attr('checked', true).addClass('q');
                }
            }
        break;
    }
})

//双击编辑数据
$('body td').dblclick(function(){
    $(this).children('input[type="text"]').removeAttr('disabled');
})






