import { contract } from "./index";

const addActor = async () => {
  let actorAddress = document.getElementById("actoraddress").value;
  let actorType = document.getElementById("actorType").value;
  let check = await contract.checkCDR();
  if (check == "yes") {
    await contract.addActor(actorAddress, actorType);
  } else {
    alert("Invalid user request");
  }
};

document.getElementById("addbtn").onclick = addActor;
