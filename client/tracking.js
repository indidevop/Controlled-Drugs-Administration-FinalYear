import { contract, account } from "./index";

let card = document.getElementById("dcard");
let steps = document.getElementsByClassName("step-button");
let progress = document.getElementById("progress");
let imgList = document.getElementsByClassName("img-fluid");

const track = async () => {
  let dId0 = document.getElementById("drugID2").value;

  let check = await contract.checkIfHash(dId0);

  if (check == false) {
    alert("Drug ID does not exist");
    if (!card.classList.contains("d-none")) {
      card.classList.add("d-none");
    }
  } else {
    document.getElementById("camera-container").classList.add("d-none");
    document.getElementById("progressbar").classList.remove("d-none");
    let val = await contract.tracking(dId0);
    document.getElementById("d1").innerText = val[0];
    document.getElementById("d2").innerText = val[1];
    document.getElementById("d3").innerText = val[2];
    document.getElementById("d4").innerText = val[3];
    document.getElementById("d5").innerText = val[4];

    if (parseInt(val[5]._hex, 16) == 1) {
      document.getElementById("d0").innerText = "Manufactured";
    }
    if (parseInt(val[5]._hex, 16) == 2) {
      document.getElementById("d0").innerText = "In Transit";
    }
    if (parseInt(val[5]._hex, 16) == 3) {
      document.getElementById("d0").innerText = "Delivered";
    }
    if (parseInt(val[5]._hex, 16) == 4) {
      document.getElementById("d0").innerText = "Prescribed";
    }
    if (parseInt(val[5]._hex, 16) == 5) {
      document.getElementById("d0").innerText = "Consumed";
    }
    if (parseInt(val[5]._hex, 16) == 6) {
      document.getElementById("d0").innerText = "Disposed";
    }

    card.classList.remove("d-none");
    let stat = parseInt(val[5]._hex, 16);

    for (let i = 0; i < 5; i++) {
      if (stat >= i + 1) {
        steps[i].classList.add("done");
        progress.setAttribute("value", (i * 105) / 4);
      }
    }

    let val2 = await contract.tracking2(dId0);

    document.getElementById("d6").innerText = val2[0];
    document.getElementById("d7").innerText = val2[1];
    document.getElementById("d8").innerText = parseInt(val2[2]._hex, 16);
    document.getElementById("d9").innerText = parseInt(val2[3]._hex, 16);
    document.getElementById("d10").innerText = val2[4];

    let val3 = await contract.getLocation(dId0);
    console.log(val3);
    if (val3[0].length != 0) {
      steps[0].setAttribute("data-bs-title", val3[0]);
    }
    if (val3[1].length != 0) {
      steps[2].setAttribute("data-bs-title", val3[1]);
    }
    if (val3[2].length != 0) {
      steps[3].setAttribute("data-bs-title", val3[2]);
    }
    if (val3[3].length != 0) {
      steps[4].setAttribute("data-bs-title", val3[3]);
      if (parseInt(val[5]._hex, 16) == 6) {
        document.getElementById('final').innerText = "Disposed";
      }
      else if (parseInt(val[5]._hex, 16) == 5) {
        document.getElementById('final').innerText = "Consumed";
      }
      
    }

    
    
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );

    let val4 = await contract.getImages(dId0);
 
    if (val4[0].length != 0) {
      imgList[0].setAttribute(
        "src",
        `https://gateway.pinata.cloud/ipfs/${val4[0]}`
      );
      document.getElementById("i1").classList.remove("d-none");
    }
    if (val4[1].length != 0) {
      imgList[1].setAttribute(
        "src",
        `https://gateway.pinata.cloud/ipfs/${val4[1]}`
      );
      document.getElementById("i2").classList.remove("d-none");
    }
    if (val4[2].length != 0) {
      imgList[2].setAttribute(
        "src",
        `https://gateway.pinata.cloud/ipfs/${val4[2]}`
      );
      document.getElementById("i3").classList.remove("d-none");
    }
  }
};

document.getElementById("trackbtn").onclick = track;
