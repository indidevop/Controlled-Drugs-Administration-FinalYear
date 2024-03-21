import { contract } from "./index";
let account = localStorage.getItem("account");
document.getElementById("mAddr").value = account;
const addLot = async () => {
  let drugName = document.getElementById("drugName").value;
  let drugManu = document.getElementById("drugManu").value;
  let drugExp = document.getElementById("drugExp").value;
  let drugQu = document.getElementById("drugQu").value;
  let drugQpu = document.getElementById("drugQpu").value;
  let hAddr = document.getElementById("hAddr").value;

  let dinfo =
    drugName + drugManu + drugExp + drugQu + drugQpu + hAddr.slice(-4);

  let hashedString = sjcl.hash.sha256.hash(dinfo);

  // Convert the hashed result to a hexadecimal string
  let drugID = sjcl.codec.hex.fromBits(hashedString).slice(-11);

  const obj = {
    drugID: drugID,
    drugName: drugName,
    drugQ: drugQu * drugQpu,
    hAddr: hAddr,
  };

  let val = JSON.stringify(obj);
  let url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${val}`;
  document.getElementById("qrImg").setAttribute("src", url);
  document.getElementById("downloadBtn").removeAttribute("disabled");
  document.getElementById("downloadBtn").setAttribute("data-url", url);

  document.getElementById("info").classList.add("d-none");
  document.getElementById("qrdisplay").classList.remove("d-none");
  let check = await contract.checkManu();
  if (check == "yes") {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        var locationString =
          "x:" +
          position.coords.longitude +
          "  " +
          "y:" +
          position.coords.latitude;
        await contract.addLot(
          drugName,
          drugQu * drugQpu,
          drugID,
          hAddr,
          drugManu,
          drugExp,
          account,
          locationString
        );
      },
      () => {
        alert("Location not available");
      }
    );
  } else {
    alert("Invalid user request");
  }
};

document.getElementById("addlotbtn").onclick = addLot;
