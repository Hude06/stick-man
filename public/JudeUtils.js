export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  floor() {
    return new Point(Math.floor(this.x), Math.floor(this.y));
  }
  add(x, y) {
    return new Point(this.x + x, this.y + y);
  }
}
export class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  intersects(otherRect) {
    return (
      this.contains(new Point(otherRect.x, otherRect.y)) ||
      this.contains(new Point(otherRect.x + otherRect.w, otherRect.y)) ||
      this.contains(new Point(otherRect.x, otherRect.y + otherRect.h)) ||
      this.contains(
        new Point(otherRect.x + otherRect.w, otherRect.y + otherRect.h),
      ) ||
      otherRect.contains(new Point(this.x, this.y)) ||
      otherRect.contains(new Point(this.x + this.w, this.y)) ||
      otherRect.contains(new Point(this.x, this.y + this.h)) ||
      otherRect.contains(new Point(this.x + this.w, this.y + this.h))
    );
  }
  contains(pt) {
    return (
      pt.x >= this.x &&
      pt.x <= this.x + this.w &&
      pt.y >= this.y &&
      pt.y <= this.y + this.h
    );
  }
}
