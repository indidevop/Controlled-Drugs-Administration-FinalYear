import { contract } from "./index";

const updateLot = async () => {
  let drugID2 = document.getElementById("drugID2").value;
  let nurseState = document.getElementById("nurseState").value;

  let check = await contract.checkNurse();
  if (check == "yes") {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      var locationString =
        "x:" +
        position.coords.longitude +
        "  " +
        "y:" +
        position.coords.latitude;
        await contract.nurseUpdate(nurseState, drugID2,locationString);
    },
    () => {
      alert("Location not available");
    }
  );
  }
  else{
    alert("Invalid user request");
  }
  
  
};

document.getElementById("nurseupdatelotbtn").onclick = updateLot;
