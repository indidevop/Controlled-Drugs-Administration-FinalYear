import { contract, account } from "./index";
let drugID = document.getElementById("drugID2").value;
const addActor = async () => {
  let actorAddress = document.getElementById("actoraddressHospital").value;
  let actorType = document.getElementById("actorTypeHospital").value;
  let check = await contract.checkHos();
  if (check == "yes") {
    await contract.addActor(actorAddress, actorType);
  } else {
    alert("Invalid user request");
  }
};

document.getElementById("hospitaladdbtn").onclick = addActor;
