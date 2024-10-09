import SSBUBoxArt from "../assets/img/SSBUBoxArt.jpg";
import SF6BoxArt from "../assets/img/SF6BoxArt.jpg";
import Tekken8BoxArt from "../assets/img/Tekken8BoxArt.jpg";
import DBFZBoxArt from "../assets/img/DBFZBoxArt.jpg";

const GameOptionsComponent = () => {
  return [
    { id: "1386", name: "Super Smash Bros Ultimate", image: SSBUBoxArt },
    { id: "43868", name: "Street Fighter 6", image: SF6BoxArt },
    { id: "33945", name: "Guilty Gear -STRIVE-", image: null },
    { id: "49783", name: "Tekken 8", image: Tekken8BoxArt },
    { id: "287", name: "Dragon Ball FighterZ", image: DBFZBoxArt },
    { id: "1", name: "Super Smash Bros Melee", image: null },
    { id: "48548", name: "Granblue Fantasy Versus: Rising", image: null },
    { id: "48559", name: "Mortal Kombat 1", image: null },
    { id: "36963", name: "The King of Fighters XV", image: null },
    { id: "36865", name: "Melty Blood - Type Lumina -", image: null },
    { id: "50203", name: "Under Night In-Birth II Sys:Celes", image: null },
  ];
};

export default GameOptionsComponent;
