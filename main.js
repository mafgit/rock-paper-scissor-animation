const container = document.querySelector(".container");
const container_width = window.innerWidth < 500 ? window.innerWidth : 500;
const container_height = window.innerHeight < 500 ? window.innerHeight : 500;
container.style.width = container_width + "px";
container.style.height = container_height + "px";

const min_v = -5;
const max_v = 5;

class Box {
  constructor(type) {
    this.type = type;
    this.width = 30;
    this.height = 30;

    this.x = Math.random() * (container_width - this.width);
    this.y = Math.random() * (container_width - this.height);
    this.vel_x = min_v + Math.floor(Math.random() * (max_v - min_v + 1));
    this.vel_y = min_v + Math.floor(Math.random() * (max_v - min_v + 1));

    this.element = document.createElement("div");
    this.element.classList.add("box");
    this.element.classList.add(type);
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";

    const icon = document.createElement("img");
    icon.src =
      type == "R"
        ? "./icons/gem-solid.svg"
        : type == "P"
        ? "./icons/note-sticky-solid.svg"
        : "./icons/scissors-solid.svg";
    this.element.appendChild(icon);

    container.appendChild(this.element);
    //   console.log(this.x, this.y, this.vel_x, this.vel_y);

    // this.element.innerText = this.type;
  }

  move() {
    this.x += this.vel_x;
    this.y += this.vel_y;
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  destroy() {
    this.element.classList.add("destroy");
    //   this.element.remove();
  }
}

const collide = (box1, box2) => {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
};

const num_boxes = 20;
let boxes = [];
let r = 0,
  p = 0,
  s = 0;

const types = ["R", "P", "S"];
for (let i = 0; i < num_boxes; i++) {
  let random_index = Math.floor(Math.random() * 3);
  let type = types[random_index];
  let box = new Box(type);
  boxes.push(box);
  if (type === "R") {
    r++;
  } else if (type === "P") {
    p++;
  } else {
    s++;
  }
}

const animate = () => {
  for (let i = 0; i < num_boxes; i++) {
    if (boxes[i] === null) {
      continue;
    }

    let box = boxes[i];
    box.move();

    // bounce off walls
    if (box.x <= 0 || box.x + box.width >= container_width) {
      box.vel_x *= -1;
    }
    if (box.y <= 0 || box.y + box.height >= container_height) {
      box.vel_y *= -1;
    }

    // collision
    for (let j = i + 1; j < num_boxes; j++) {
      if (boxes[j] === null || boxes[i] === null) {
        continue;
      }

      if (collide(boxes[i], boxes[j])) {
        let type1 = boxes[i].type;
        let type2 = boxes[j].type;
        if (
          (type1 === "R" && type2 === "P") ||
          (type1 === "P" && type2 === "S") ||
          (type1 === "S" && type2 === "R")
        ) {
          if (type1 === "R") {
            r--;
          } else if (type1 === "P") {
            p--;
          } else {
            s--;
          }

          boxes[i].destroy();
          boxes[i] = null;
        } else if (
          (type1 === "P" && type2 === "R") ||
          (type1 === "S" && type2 === "P") ||
          (type1 === "R" && type2 === "S")
        ) {
          if (type2 === "R") {
            r--;
          } else if (type2 === "P") {
            p--;
          } else {
            s--;
          }

          boxes[j].destroy();
          boxes[j] = null;
        }
      }
    }

    // update data
    document.getElementById("rocks").innerText = r;
    document.getElementById("papers").innerText = p;
    document.getElementById("scissors").innerText = s;

    let winner = " - ";
    let zero = 0;
    if (r === 0) zero++;
    if (p === 0) zero++;
    if (s === 0) zero++;
    if (zero === 2) {
      if (r !== 0) winner = "Rocks";
      else if (p !== 0) winner = "Papers";
      else if (s !== 0) winner = "Scissors";
      document.getElementById("winner").innerText = winner;
      gameOver = true;
    }
  }

  requestAnimationFrame(animate);
};

let gameOver = false;
animate();
