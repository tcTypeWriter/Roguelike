function Loot(type, coordinates) {
    this.coordinates = {
        x: coordinates.x,
        y: coordinates.y
    };
    this.size;
    this.image = new Image();
    switch (type) {
        case "armour":
            this.size = 30;
            this.image.src = "img/armour.png";
            break;
        case "key":
            this.size = 30;
            this.image.src = "img/key.png";
            break;
        default:
            break;
    }
    this.collider = new Collider(this.coordinates, this.size, this.size);
}
function Coin(value, coordinates) {
    this.value = value;
    this.coordinates = {
        x: coordinates.x,
        y: coordinates.y
    };
    this.size = 20;
    this.image = new Image();
    this.image.src = "img/coin.png";
    this.collider = new Collider(this.coordinates, this.size, this.size);
}
function HpPotion(value, coordinates) {
    this.value = value;
    this.coordinates = {
        x: coordinates.x,
        y: coordinates.y
    };
    this.size = 30;
    this.image = new Image();
    this.image.src = "img/hpPotion.png";
    this.collider = new Collider(this.coordinates, this.size, this.size);
}