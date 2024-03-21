import { contract } from "./index.mjs";
console.log("loaded");

const updateLot = async () => {
  // console.log("called")
  let drugID2 = document.getElementById("drugID2").value;
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      var locationString =
        "x:" +
        position.coords.longitude +
        "  " +
        "y:" +
        position.coords.latitude;
        await contract.updateLotState(drugID2,locationString);
    },
    () => {
      alert("Location not available");
    }
  );
  
  
  

  // setTimeout(async () => {
  //     let val=await contract.checkLotState(drugID2);

  //     if(val==1){
  //         alert(`Lot state for drugID '${drugID2}' is: `+`Manufactured`);
  //     }
  //     else if(val==2){
  //         alert(`Lot state for drugID '${drugID2}' is: `+`In Transit`);
  //     }
  //     else if(val==3){
  //         alert(`Lot state for drugID '${drugID2}' is: `+`Delivered`);
  //     }
  //     else if(val==4){
  //         alert(`Lot state for drugID '${drugID2}' is: `+`Prescribed`);
  //     }
  //     else if(val==5){
  //         alert(`Lot state for drugID '${drugID2}' is: `+`Consumed`);
  //     }
  //     else if(val==6){
  //         alert(`Lot state for drugID '${drugID2}' is: `+`Disposed`);
  //     }
  //     else{
  //         alert(`Not found !`);
  //     }
  // }, 3000);
};

document.getElementById("updatelotbtn").onclick = updateLot;
