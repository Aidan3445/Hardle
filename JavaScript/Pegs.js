// class for the color pegs of a guess based on the closeness to the secret word
class Pegs {
  constructor(y, g, guessed) {
    this.colors = [
      // pegs start out all white
      color("white"),
      color("white"),
      color("white"),
      color("white"),
      color("white"),
    ];
    for (let i = 0; i < y; i++) {
      // replace the first y number of pegs with yellow
      this.colors[i] = color(255, 224, 71);
    }
    for (let i = 0; i < g; i++) {
      // replace the next g number of pegs with green
      this.colors[i + y] = color(78, 153, 40);
    }
    if (guessed) {
      for (let i = 0; i < 5 - y - g; i++) {
        // if guessed then remaining pegs are grey
        this.colors[i + y + g] = color(175, 175, 175);
      }
    }
  }

  // draw pegs in the pentagon
  draw(index, tileSize) {
    let x = width / 2 + 2.8 * tileSize;
    let y = (index * tileSize * 11) / 10 + tileSize / 1.2;
    // rotate and draw pegs with corresponding color
    for (let i = 0; i < this.colors.length; i++) {
      push();
      ellipseMode(CENTER);
      fill(this.colors[i]);
      translate(p5.Vector.fromAngle(((2 * PI) / 5) * (i - 1.25), 10));
      ellipse(x, y, tileSize / 5, tileSize / 5);
      pop();
    }
  }

  // convert to json
  static toJSON(obj) {
    let y = 0;
    let g = 0;
    // convert colors to yellow and green counts
    for (let i of obj.colors) {
      if (i.levels[1] == 224) {
        y++;
      } else if (i.levels[1] == 153) {
        g++;
      }
    }
    let json = {
      y: y,
      g: g,
    };
    return json;
  }

  // create pegs from json
  static fromJSON(json) {
    let p = new Pegs(json.y, json.g);
    return p;
  }
}
