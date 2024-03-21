import { contract, account } from "./index";

// const addPatienttolist = async () => {
//     let pID = document.getElementById('pID').value;

//     let hAssigned = document.getElementById('hAssigned').value;
//     await contract.addPatient(pID, hAssigned, pname)

//     // setTimeout(async () => {
//     //     let val = await contract.checkIfPatientAdded(pID);

//     //     alert(`Patient ${val}`);

//     // }, 10000);

// }
document.getElementById("doctorID").value = localStorage.getItem("account");
const prescribeDrug = async () => {
  let pname = document.getElementById("pname").value;
  let page = document.getElementById("page").value;
  let pgender = document.getElementById("pgender").value;
  let dID = document.getElementById("drugID2").value;
  let doctorID = document.getElementById("doctorID").value;
  let drugdose = document.getElementById("drugdose").value;
  console.log(pgender);
  if (pgender == "Male") {
    pgender = 1;
  } else if (pgender == "Female") {
    pgender = 2;
  } else {
    pgender = 3;
  }
  let pinfo =
    pname + page + pgender + dID.slice(-4) + doctorID.slice(-4) + drugdose;
  // Hash the string using SHA-256
  let hashedString = sjcl.hash.sha256.hash(pinfo);

  // Convert the hashed result to a hexadecimal string
  let hexHashedString = sjcl.codec.hex.fromBits(hashedString).slice(-11);
  let check = await contract.checkDoc();
  if (check == "yes") {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      var locationString =
        "x:" +
        position.coords.longitude +
        "  " +
        "y:" +
        position.coords.latitude;
    
        await contract.assignPatient(
          pname,
          page,
          pgender,
          dID,
          hexHashedString, //patient id
          drugdose,
          doctorID,
          locationString
        );
    },
    () => {
      alert("Location not available");
    }
  );}
  else{
    alert("Invalid user request");
  }

};

document.getElementById("prescribebtn").onclick = prescribeDrug;
