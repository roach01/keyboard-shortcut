var ids = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM';

var saved = localStorage.getItem('save');
saved = saved?saved:'{}';
saved = JSON.parse(saved);
$().ready(function () {

    ids.split('').forEach(function (id) {
        create(id);
    });
    keyBind();
});

var keyBind = function () {
    window.onkeydown = function (event) {
        var key = event.key;
        if (!Number(key)){
            key = key.toUpperCase();
        }
        if (key.length==1){
            var urlInfo = saved[key];
            if (urlInfo){
                window.open(urlInfo.url)
            }
            else {
                edit(key);
            }
        }
    }
};



function create(id) {
    var urlInfo = saved[id];
    var ele = $('#'+id);
    ele.html(`
        <img id="${id}_edit" class="edit size" src="/img/edit.png"/>
        <img id="${id}_delete" class="delete size" src="/img/delete.png"/>
        <span>${id}</span>
        ${urlInfo?`<img id="${id}_favicon" class="favicon size" src="${urlInfo.favicon?urlInfo.favicon:`${urlInfo.url}/favicon.ico`}"/>`:''}
    `);
    $('#'+id+'_edit').on('click',function () {
        edit(id);
    });
    $('#'+id+'_delete').on('click',function () {
        $('#'+id+'_favicon').remove();
        delete saved[id];
        saveToLocal();
    });
    $('#'+id+'_favicon').on('click',function () {
        editFavicon(id);
    })
}

function editFavicon(id) {
    var url = prompt(`请输入键位[${id}]所对应的图标`);
    if (url!=null){
        var urlInfo = saved[id];
        urlInfo.favicon = url;
        saveToLocal();
        var favicon = $('#'+id+'_favicon');
        if (favicon&&favicon[0]){
            favicon[0].src = `${urlInfo.favicon?urlInfo.favicon:`${urlInfo.url}/favicon.ico`}`;
        }
    }
}

function edit(id) {
    var url = prompt(`请输入键位[${id}]所对应的url`);
    if (!url){
        return;
    }
    if (url[0]!='h'&&url[0]!='f'){
        url = 'http://'+url;
    }
    saved[id] = {url:url,favicon:''};
    var favicon = $('#'+id+'_favicon');
    if (favicon&&favicon[0]){
        favicon[0].src = `${url}/favicon.ico`;
    }
    else {
        $('#'+id).append(`<img id="${id}_favicon" class="favicon size" src="${url}/favicon.ico"/>`)
        $('#'+id+'_favicon').on('click',function () {
            editFavicon(id);
        })
    }
    saveToLocal();
}

function saveToLocal() {
    localStorage.setItem('save',JSON.stringify(saved));
}
