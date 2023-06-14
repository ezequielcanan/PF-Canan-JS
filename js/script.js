let carrito = [];
const productosArr = [
  { id: 1, nombre: "Pelota", categoria: "Deportes", precio: 1000 },
  { id: 2, nombre: "Remera", categoria: "Ropa", precio: 7000 },
  { id: 3, nombre: "Short", categoria: "Ropa", precio: 4000 },
  { id: 4, nombre: "Raqueta de tenis", categoria: "Deportes", precio: 2000 },
  { id: 5, nombre: "Botines", categoria: "Deportes", precio: 8000 },
  { id: 6, nombre: "Pelota de basquet", categoria: "Deportes", precio: 800 },
  { id: 7, nombre: "Silla", categoria: "Muebles", precio: 5000 },
  { id: 8, nombre: "Mesa", categoria: "Muebles", precio: 15000 },
  { id: 9, nombre: "Escritorio", categoria: "Muebles", precio: 22500 },
];

function menu() {
  let opcion;
  do {
    opcion = Number(
      prompt(
        "Bienvenido al menu principal, elija una opción:\n 0. Cerrar\n 1. Productos\n 2. Carrito de compras \n"
      )
    );
    switch (opcion) {
      case 0:
        return 0;
      case 1:
        productos();
        break;
      case 2:
        carrito();
        break;
      default:
        alert("Opcion no valida");
    }
  } while (opcion < 1 || opcion > 3 || isNaN(opcion));
}

function productos() {
  let opcionProductos;
  let cantidad;

  do {
    opcionProductos = Number(
      prompt(
        verArrayObjetos(productosArr) +
          "\n\n1. Agregar al carrito\n 2. Filtrar por categoria\n 3. Filtrar por precio menor a:\n 0. Volver al menu principal"
      )
    );
    if (opcionProductos === 0) {
      menu();
    } else if (opcionProductos < 1 || opcionProductos > 3) {
      alert("Tiene que ingresar un numero correcto");
    }
  } while (
    opcionProductos < 1 ||
    opcionProductos > 3 ||
    isNaN(opcionProductos)
  );
    switch (opcionProductos) {
      case 0:
        menu()
      case 1:
        agregar()
        break
    }
}

function agregar() {
  let cantidad;
  let producto;
  let exists;
  do {
    producto = Number(
      prompt(
        verArrayObjetos(productosArr) +
          "\nElige un producto para agregar al carrito, ingresa su id. 0 para volver"
      )
    );
    exists = productosArr.some((p) => p.id === producto);
    if (producto === 0) {
      menu();
    } else if (!exists) {
      alert("Ingrese un id correcto");
    }
  } while (!exists);
  do {
    cantidad = Number(
      prompt("Cantidad a comprar del producto elegido: ")
    );
    if (isNaN(cantidad)) {
      alert("Ingresa el numero de productos que desea comprar");
    }
  } while (isNaN(cantidad));
  let indexProduct;
  menu();
}

function carrito() {
  let carritoOpcion;
  do {
    carritoOpcion = Number(
      prompt("Total: $" + total + "\n1. Ver carrito\n2. Comprar carrito")
    );
    switch (carritoOpcion) {
      case 0:
        menu();
        break;
      case 1:
        total = 0;
        alert("Carrito borrado");
        menu();
        break;
      case 2:
        total = 0;
        alert("Carrito comprado");
        menu();
        break;
      default:
        alert("Opcion no valida");
    }
  } while (carritoOpcion != 0 || carritoOpcion != 1 || isNaN(carritoOpcion));
}

function verArrayObjetos(array) {
  let strArray = "ID - Nombre - Precio\n";
  array.forEach((e) => {
    strArray += e.id + "- " + e.nombre + " - $" + e.precio + "\n";
  });
  return strArray;
}

menu();
