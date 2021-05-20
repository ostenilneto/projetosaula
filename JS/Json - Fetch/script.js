//uso com Async e Await
async function loadPosts() {
    document.getElementById("posts").innerHTML = 'Carregando . . .';
    let req = await fetch('https://jsonplaceholder.typicode.com/posts');
    let json = await req.json();
    montarBlog(json)
}

function montarBlog(lista){
    let html = '';
    
    for (let i in lista){
        html += '<h3>'+lista[i].title+'</h3>';
        html += lista[i].body+'<br/>';
        html += '<hr/>';
    }

    document.getElementById("posts").innerHTML = html;
}

// envio de informações
async function inserirPosts() {
    document.getElementById("posts").innerHTML = 'Carregando . . .';

    let req = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify ({
            title: 'Titulo de teste',
            body: 'Corpo de teste',
            userID: 4
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let json = await req.json();
    console.log(json);
}
async function enviar() {
    let arquivo = document.getElementById('arquivo').files;
    
    //quando tem arquivo usar a classe formdata
    let  body = new FormData();
    body.append('title', 'bla bla bla');
    body.append('arquivo', arquivo);
    
    let req = await fetch('https://meusite.com.br/upload', {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}/*
function mostrar() {
    let imagem = document.getElementById("imagem").files[0];
    let img = document.createElement("img");
    img.src = URL.createObjectURL(imagem);
    img.width = 200;
    document.getElementById("area").appendChild(img);    
}*/
function mostrar() {
    let reader = new FileReader();
    let imagem = document.getElementById("imagem").files[0];
    reader.onloadend = function() {
        let img = document.createElement("img");
        img.src = reader.result;
        img.width = 200;      
        
        document.getElementById("area").appendChild(img);  
    }
    reader.readAsDataURL(imagem);  
}