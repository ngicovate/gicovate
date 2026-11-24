// Lo que comparten todas las páginas del sitio: el modo claro y oscuro, y las
// palabras que van pasando por el buscador.
//
// Va como archivo aparte y no repetido dentro de cada página, porque si no son
// cuatrocientas copias de lo mismo y el navegador lo baja cada vez.

(function () {
  var raiz = document.documentElement;

  /* ——————————————— claro y oscuro ———————————————
     Sin elección guardada, manda lo que tenga puesto el sistema; el botón
     guarda la decisión y desde ahí manda ella. Lo que evita el parpadeo
     blanco al cargar no está acá sino en una línea dentro de <head>: para
     cuando este archivo llega, la página ya se dibujó. */
  function guardado() { try { return localStorage.getItem('tema'); } catch (e) { return null; } }
  function actual() {
    // Primero lo que el documento tiene puesto, que es lo que se está viendo.
    // Si solo mirara el almacenamiento, en una ventana privada —donde guardar
    // falla en silencio— la pastilla quedaría marcando lo contrario de lo que
    // muestra la página.
    return raiz.getAttribute('data-tema') || guardado() ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');
  }
  var pastilla = document.getElementById('tema');
  if (pastilla) {
    var pintar = function () {
      var t = actual();
      [].forEach.call(pastilla.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', b.dataset.tema === t ? 'true' : 'false');
      });
    };
    pintar();
    pastilla.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      raiz.setAttribute('data-tema', b.dataset.tema);
      try { localStorage.setItem('tema', b.dataset.tema); } catch (e) {}
      pintar();
    });
    // Si nunca eligió nada y cambia el sistema, la página lo sigue.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (!guardado()) pintar();
    });
  }

  /* ——————————————— las palabras del buscador ———————————————
     Autores y conceptos que están de verdad adentro del sitio. Se comprobó uno
     por uno contra el índice: si el buscador sugiere un nombre y después no lo
     encuentra, la sugerencia es una mentira. Por eso faltan algunos que
     parecerían obvios: una palabra que el buscador no encuentra es una
     sugerencia que miente. */
  var PALABRAS = [
    'Etgar Keret', 'juego', 'Fabián Casas', 'escritura creativa', 'Borges',
    'infancia', 'Saul Leiter', 'poesía', 'Hanif Kureishi', 'fotografía',
    'Bruno Schulz', 'mirada', 'Mark Twain', 'silencio', 'Dylan Thomas',
    'creatividad', 'Antoni Tàpies', 'memoria', 'Pedro Mairal', 'muelle',
    'Carl Jung', 'escritura', 'María Negroni', 'flow', 'Paul Celan',
    'Bukowski', 'taller', 'Walter Benjamin', 'Caetano Veloso', 'John Cleese',
    'Pizarnik', 'Roberto Bolaño', 'Emily Dickinson', 'Baricco', 'cuaderno',
    'insight', 'Joan Didion', 'entrevista', 'Geertz', 'disponibilidad',
    'Goffman', 'Sontag', 'diario de campo'
  ];

  var campos = [].slice.call(document.querySelectorAll('.campo'));
  if (!campos.length) return;

  // Cada buscador arranca en una palabra distinta, así no van los tres al
  // mismo tiempo diciendo lo mismo.
  var arranque = Math.floor(Math.random() * PALABRAS.length);

  campos.forEach(function (campo, k) {
    var entrada = campo.querySelector('input');
    var rueda = campo.querySelector('.rueda');
    if (!entrada || !rueda) return;

    var i = (arranque + k * 7) % PALABRAS.length;
    entrada.classList.add('con-rueda');
    rueda.innerHTML = '<span>' + PALABRAS[i] + '</span>';

    var marcarEscrito = function () { campo.classList.toggle('escrito', !!entrada.value); };
    entrada.addEventListener('input', marcarEscrito);
    marcarEscrito();

    // Quieto mientras alguien está escribiendo o tiene el cursor adentro: una
    // palabra que se mueve sola debajo de lo que estás tipeando distrae.
    var quieto = function () {
      return entrada.value || document.activeElement === entrada ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    setInterval(function () {
      if (quieto()) return;
      i = (i + 1) % PALABRAS.length;
      var sale = rueda.firstChild;
      var entra = document.createElement('span');
      entra.textContent = PALABRAS[i];
      entra.className = 'entra';
      if (sale) sale.className = 'sale';
      rueda.appendChild(entra);
      setTimeout(function () { if (sale && sale.parentNode) sale.parentNode.removeChild(sale); }, 300);
    }, 2800 + k * 300);
  });
})();
