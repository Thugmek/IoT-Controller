import { Jumbotron, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Jumbotron>
      <h1 className="display-3">Domů</h1>
      <p class="lead">
        Vítejte v aplikaci pro snadnou kontrolu chytré domácnosti. Na levé
        straně se nechází menu, pomocí kterého se můžete dostat na jednotlivé
        moduly aplikace. Uživatelská dokumentace k jednotlivým modulům je k
        dispozici níže na této stránce.
      </p>
      <hr class="my-4" />
      <h2>Rozhlas</h2>
      <p class="lead">
        Modul rozhlas poskytuje rozhraní pro ovládání domovního rozhlasu.
        Umožňuje vytvářet textové zprávy o délce až 200 znaků, které se
        automaticky převedou na řeč a je poté možné je přehrát pomocí
        bezdrátového rozhlasu. Zprávy je samozřejmě možné upravovat a mazat. Je
        také možné zprávu přehrát lokálně, pro kontrolu správnosti zadaného
        textu, pomocí tlačítka přehrát lokálně.
        <br />
        <Link to="/messagePlayer" className="inline">
          Přejít na modul rozhlas.
        </Link>
      </p>
      <hr class="my-4" />
      <h2>
        Kotel <Badge className="badge-info">Již brzy</Badge>
      </h2>
      <p class="lead">
        Modul kotel zobrazuje info o výkonu kotle v přehledném grafu. Rovněž
        upozorní na riziko vyhasnutí při nízkém výkonu.
      </p>
    </Jumbotron>
  );
}

export default Home;
