let pcsArr = [
  { id: 1, gpu: "2060s", mother: "Gigabyte", cpu: "Intel I3-10100F", ram: "16", ssd: 480, price: 979, pathImage: `./multimedia/pc1.png`},
  { id: 2, gpu: "3070ti", mother: "Asus", cpu: "Intel I7-10700F", ram: "16", ssd: 480, price: 1189, pathImage: `./multimedia/pc2.png`},
  { id: 3, gpu: "3090ti", mother: "Aorus", cpu: "Intel I9-13900K", ram: "32", ssd: 480, price: 1239, pathImage: `./multimedia/pc3.png`},
  { id: 4, gpu: "4090ti", mother: "Asus", cpu: "AMD 5600G", ram: "32", ssd: 1000, price: 1489, pathImage: `./multimedia/pc4.jpg`},
];
let appliedFilters = {}
let carrito = []

function renderizar() {
  let cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = ""
  let pcsRender = pcsArr
  for (let filtro in appliedFilters) {
    pcsRender = pcsRender.filter((pc) => pc[filtro].toLowerCase().includes(appliedFilters[filtro]))
  }
  pcsRender.forEach((card) => {
    cardsContainer.innerHTML += `<div class="card container__tienda__items__cards__card mb-3 col-md-5">
    <img src=${card.pathImage} class="card-img-top" alt="Imagen de pc con la gpu ${card.gpu}">
    <div class="card-body container__tienda__items__cards__card__body">
    <h4 class="card-title">${card.price} USD</h4>
    <p class="card-text">PC armada gamer con ${card.ram}gb de ram, ${card.ssd}gb, ${card.cpu} y la gpu RTX ${card.gpu}.</p>
    <button class="btn btn-buy-card" id=${card.id}>Agregar al carrito</button>
    </div>
    </div>`;
  });
}
renderizar()

function agregarAlCarrito(id) {
  let producto = pcsArr.find((pc) => pc.id == id)
  if (carrito.includes(producto)) {
    carrito[carrito.indexOf(producto)].cantidad++
  } else {
    producto.cantidad = 1
    carrito.push(producto)
  }
}

/*Evento filtros*/
let filtros = document.querySelectorAll(".input-filtro")
filtros.forEach((filtro) => {
  filtro.addEventListener("input", (e) => {
    appliedFilters[e.target.name] = e.target.id
    renderizar()
  })
})
/*Boton reset filtros*/
let resetFilters = document.getElementById("resetFilters")
resetFilters.onclick = () => {
  appliedFilters = {}
  filtros.forEach((f) => f.checked = false)
  renderizar()
}
/*Evento agregar al carrito*/
let buttonsAgregarAlCarrito = document.querySelectorAll(".btn-buy-card")
buttonsAgregarAlCarrito.forEach((btn) => {
  btn.addEventListener("click", ({target: {id}}) => agregarAlCarrito(id))
})