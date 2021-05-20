let modalQt = 1; // variavel quantidade do Modal
let cart = []; // variavel array carrinho
let modalKey = 0; // variavel para identificar a pizza no carrinho

const c = (el)=> document.querySelector(el); // retorna o item
const cs = (el)=> document.querySelectorAll(el); // retorna um array com os itens
// como irá repetir muitas x, criar uma constante

pizzaJson.map((item, index)=>{ // listagens das pizzas
    let pizzaItem = c('.models .pizza-item').cloneNode(true); //preencher as informações em pizzaitem
    
    pizzaItem.setAttribute('data-key', index); // cria um atributo com a chave sequencia das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; // insere imagem
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; // insere nome
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; // insere descrição
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; // insere valor 2 casas decimais
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); // retira a configuração que atualizava tela ao clicar nas imagens da pizza
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); // atribuindo chave ao item
        modalQt = 1; // sempre que abrir a tela da pizza abrirá com quantidade = 1
        modalKey = key; // adiciona a chave da pizza para ir para o carrinho
        
        c('.pizzaBig img').src = pizzaJson[key].img; // insere nome
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; // insere nome
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; // insere descrição
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; // insere valor 2 casas decimais
        c('.pizzaInfo--size.selected').classList.remove('selected'); // tirar seleção da ultima pizza quando abrir novamente a mesma pizza

        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if (sizeIndex == 2) {
                size.classList.add('selected');
            } // quando abrir novamente a tela a opção GRANDE ficará selecionado(reset)
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        }); // busca os tamanhos de pizza para todos as pizzas

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0; // inicia com opacidade = 0
        c('.pizzaWindowArea').style.display = 'flex'; // aparecer a tela de adicionar item
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200); // após 200ms a tela aparece - animação
    })

    c('.pizza-area').append(pizzaItem);
});

// eventos do modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0; // muda a opacidade = 0
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none'; // fechar a tela de adicionar item
    },500); // após 500ms a tela aparece - animação
} //fechar tela do modal

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMovileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
}); // executar evento closemodal ao clicar no cancelar

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt > 1) {
        modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt
    }//só reduz se for maior que 1    
}); // subtrair -1 ao clicar no -

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
}); // adicionar +1 ao clicar no +

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
}); // selecionar tamanho pizza

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));// Qual o tamanho?
    let identifier = pizzaJson[modalKey].id+'@'+size; // identificar pizza e tamanho
    
    let key = cart.findIndex((item)=>item.identifier == identifier); // busca se já tem identificador e não repete se tiver
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push ({
            identifier,
            id:pizzaJson[modalKey].id, //Adiciona o id da pizza escolhida ao carrinho
            size, // adiciona o tamanho da pizza escolhida ao carrinho
            qt:modalQt // adiciona a quantidade de pizza escolhida ao carrinho
        });
    }
    updateCart();
    closeModal();
}); // botão adicionar ao carrinho, direciona para 

c('.menu-openner').addEventListener('click',()=> {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
}); // aparecer carrinho celular
c('.menu-closer').addEventListener('click',()=> {
        c('aside').style.left = '100vw';
}); // fechar carrinho celular

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length; // atualiza a qtd no carrinho do Mobile


    if(cart.length > 0) {
        c('aside').classList.add('show'); // aparecer carrinho
        c('.cart').innerHTML = ''; // zera os item selecionados

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id); // procura dados do item
            subtotal += pizzaItem.price * cart[i].qt; // valor pizza x quantidade

            let cartItem = c('.models .cart--item').cloneNode(true); // copia os dados
            let pizzaSizeName;

            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
                            
            } // substitui o valor do array por P, M ou G

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; // concatena noma + tamanho

            cartItem.querySelector('img').src = pizzaItem.img; // add imagem ao carrinho
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; // add nome + tamanho pizza ao carrinho
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; // add a quantidade ao carrinho
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt++;
                updateCart();
            }); // adicionar +1 na quantidade ao carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=> {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {

                    cart.splice(i,1); // remove 1 item do carrinho se a qtd = 0
                }
                updateCart();
            }); // subtrair -1 na quantidade ao carrinho
               

            c('.cart').append(cartItem); // adiciona os itens

            desconto = subtotal * 0.1; // valor desconto
            total = subtotal - desconto; // valor total

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`; // apresenta o subtotal na tela;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`; // apresenta o subtotal na tela;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`; // apresenta o subtotal na tela;

        }
    } else {
        c('aside').classList.remove('show'); // fechar carrinho ao zerar itens
        c('aside').style.left = '100vw'; // fechar carrinho ao zerar itens Mobile
    }
} 


