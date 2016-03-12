function Cell(coordinates, what, passability) {
    this.coordinates = coordinates;
    this.what = what;
    this.collider = new Collider(coordinates, 50, 50);
    this.passability = passability;
}
