import { contract } from "./index";

async function fun() {
  let drugID = document.getElementById("drugID2").value;
  if (drugID.length === 0) {
    alert("Scan the QR first");
    return;
  }
  const form = new FormData();
  form.append("file", inImg.files[0]);

  const options = {
    method: "POST",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2OWE5MDI3MC04NGM1LTQxY2UtYmMzYy1lZWQ2ZTViNjk4YzEiLCJlbWFpbCI6ImFtZXlraXNob3JAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijg3ZWE4NGQ0YmIxMmQzYzFiOTNlIiwic2NvcGVkS2V5U2VjcmV0IjoiMmIzYTQ4M2RiZmU2YzRjMzY4MmU3NzlkMTY3NmIzNjYwNWFjZGZmMzgwZDViOWNkZjYyMzMyYTUzZTE0MjYwZiIsImlhdCI6MTcwODQ1MTgyMH0.f_N9zz0L8deFpGq-kRZxdEi_XJiwew8gzWkqH9THhDo",
    },
    body: form,
  };

  fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", options)
    .then((response) => response.json())
    .then(async (response) => {
      await contract.addImage(response.IpfsHash,drugID);
      
    })
    .catch((err) => console.error(err));
    
}

let inImg = document.getElementById("image");
document.getElementById("btn").addEventListener("click", fun);
