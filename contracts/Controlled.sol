// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

contract Controlled {
    address public CDR = 0xD8b5eFb7244b6cE7AB0C48EAE4b29B20e807B8F0;
    address public hospital = 0x0000000000000000000000000000000000000000;
    address public manufacturer = 0x0000000000000000000000000000000000000000;
    address public nurse = 0x0000000000000000000000000000000000000000;
    address public doctor = 0x0000000000000000000000000000000000000000;

    struct lotData {
        string pID;
        address hospitalAssigned;
        address doctor;
        address nurse;
        string drugName;
        uint drugQuantity;
        uint drugQuantityUsed;
        uint lotState;
        string drugMFD;
        string drugEXP;
        address mAddr;
    }

    struct patient {
        string pID;
        uint age;
        uint gender; // 1,2,3
        address hospitalAssigned;
        string pname;
        uint dose;
        string dHash;
        address docAddr;
    }

    struct lotImages {
        string manuImg;
        string delivImg;
        string usedImg;
    }

    struct lotCoordinates {
        string manuLL;
        string hospLL;
        string presLL;
        string useLL;
    }

    string[] lotHashes;
    patient[] patientList;

    mapping(address => string[]) hInvertory; // hospital to drug hash mapping
    mapping(string => lotData) allLots; // drugHash to lotData mapping
    mapping(string => lotImages) imgList;
    mapping(string => lotCoordinates) coordList;

    function addActor(address newActor, string memory actorType) public {
        require(msg.sender == CDR || msg.sender == hospital);
        if (
            CDR != 0x0000000000000000000000000000000000000000 &&
            msg.sender == CDR
        ) {
            if (
                keccak256(abi.encodePacked(actorType)) ==
                keccak256(abi.encodePacked("hospital"))
            ) {
                hospital = newActor;
            }
            if (
                keccak256(abi.encodePacked(actorType)) ==
                keccak256(abi.encodePacked("manufacturer"))
            ) {
                manufacturer = newActor;
            }
        }
        if (
            hospital != 0x0000000000000000000000000000000000000000 &&
            msg.sender == hospital
        ) {
            if (
                keccak256(abi.encodePacked(actorType)) ==
                keccak256(abi.encodePacked("nurse"))
            ) {
                nurse = newActor;
            }

            if (
                keccak256(abi.encodePacked(actorType)) ==
                keccak256(abi.encodePacked("doctor"))
            ) {
                doctor = newActor;
            }
        }
    }



    function checkIfHash(string memory ipfs) public view returns (bool) {
        for (uint i = 0; i < lotHashes.length; i++) {
            if (
                keccak256(abi.encodePacked(ipfs)) ==
                keccak256(abi.encodePacked(lotHashes[i]))
            ) {
                return true;
            }
        }
        return false;
    }

    function checkIfHash2(string memory ipfs) public view returns (string memory) {
        for (uint i = 0; i < lotHashes.length; i++) {
            if (
                keccak256(abi.encodePacked(ipfs)) ==
                keccak256(abi.encodePacked(lotHashes[i]))
            ) {
                return "Added successfully";
            }
        }
        return "Failed to add";
    }

    // Manufacturer
    function addLot(
        string memory name,
        uint quantity,
        string memory ipfs,
        address hospitalID,
        string memory mfg,
        string memory exp,
        address mAddr,
        string memory location
    ) public {
        if (manufacturer == msg.sender) {
            if (!checkIfHash(ipfs)) {
                lotHashes.push(ipfs);
                allLots[ipfs].hospitalAssigned = hospitalID;
                allLots[ipfs].drugName = name;
                allLots[ipfs].drugQuantity = quantity;
                allLots[ipfs].drugMFD = mfg;
                allLots[ipfs].drugEXP = exp;
                allLots[ipfs].lotState = 1; //manufactured
                allLots[ipfs].drugQuantityUsed = 0;
                allLots[ipfs].mAddr = mAddr;
                coordList[ipfs].manuLL = location;
            }
        }
    }

    // For manufacturer and hospital
    function updateLotState(string memory ipfs, string memory location) public {
        if (
            manufacturer == msg.sender &&
            checkIfHash(ipfs) &&
            allLots[ipfs].lotState == 1
        ) {
            allLots[ipfs].lotState = 2; //enRoute
        }
        if (
            hospital == msg.sender &&
            checkIfHash(ipfs) &&
            allLots[ipfs].lotState == 2 &&
            allLots[ipfs].hospitalAssigned == hospital
        ) {
            allLots[ipfs].lotState = 3; //delivered
            hInvertory[msg.sender].push(ipfs);
            coordList[ipfs].hospLL = location;
        }
    }

    function checkLotState(string memory ipfs) public view returns (uint) {
        if (checkIfHash(ipfs)) {
            return allLots[ipfs].lotState;
        } else {
            return 101; // drug not added
        }
    }

    // Doctor can add patient to the system
    // function addPatient(
    //     uint pID,
    //     address hospitalAssigned,
    //     string memory pname
    // ) public {
    //     if (doctor == msg.sender) {
    //         patientList.push(
    //             patient(pID, hospitalAssigned, pname, 0, "not assigned")
    //         );
    //     }
    // }

    function checkIfPatientAdded(
        string memory pID
    ) public view returns (string memory) {
        for (uint i = 0; i < patientList.length; i++) {
            if (
                keccak256(abi.encodePacked(patientList[i].pID)) ==
                keccak256(abi.encodePacked(pID))
            ) {
                return "Added";
            }
        }
        return "Not Found";
    }

    // Doctor can assign drug to patient
    function assignPatient(
        string memory pname,
        uint age,
        uint gender,
        string memory ipfs,
        string memory patientID,
        uint requiredQ,
        address dAddr,
        string memory location
    ) public {
        address hospitalAddress = allLots[ipfs].hospitalAssigned;
        if (doctor == msg.sender) {
            patientList.push(
                patient(
                    patientID,
                    age,
                    gender,
                    hospitalAddress,
                    pname,
                    0,
                    "not assigned",
                    dAddr
                )
            );
            for (uint i = 0; i < hInvertory[hospitalAddress].length; i++) {
                if (
                    keccak256(
                        abi.encodePacked(hInvertory[hospitalAddress][i])
                    ) == keccak256(abi.encodePacked(ipfs))
                ) {
                    if (allLots[ipfs].drugQuantity >= requiredQ) {
                        allLots[ipfs].pID = patientID;
                        for (uint j = 0; j < patientList.length; j++) {
                            if (
                                keccak256(
                                    abi.encodePacked(patientList[j].pID)
                                ) == keccak256(abi.encodePacked(patientID))
                            ) {
                                patientList[j].dHash = ipfs;
                                patientList[j].dose = requiredQ;
                                allLots[ipfs].lotState = 4; //prescribed
                                allLots[ipfs].drugQuantityUsed = requiredQ;
                                allLots[ipfs].doctor = doctor;
                                coordList[ipfs].presLL = location;
                                return;
                            }
                        }
                        
                    }
                }
            }
        }
    
    }

    // function checkIfPatientAssigned(
    //     string memory pID,
    //     string memory ipfs
    // ) public view returns (string memory) {
    //     for (uint i = 0; i < patientList.length; i++) {
    //         if (
    //             keccak256(abi.encodePacked(patientList[i].pID)) ==
    //             keccak256(abi.encodePacked(pID)) &&
    //             keccak256(abi.encodePacked(patientList[i].dHash)) ==
    //             keccak256(abi.encodePacked(ipfs))
    //         ) {
    //             return "Successful prescription";
    //         }
    //     }
    //     return "Quantity unavailable or Doctor ID not found";
    // }

    // Nurse can change lot state
    function nurseUpdate(string memory state, string memory ipfs, string memory location) public {
        if (
            nurse == msg.sender &&
            (allLots[ipfs].lotState == 4 || allLots[ipfs].lotState == 5)
        ) {
            allLots[ipfs].nurse = nurse;
            if (
                keccak256(abi.encodePacked(state)) ==
                keccak256(abi.encodePacked("consumed"))
            ) {
                allLots[ipfs].lotState = 5;
                coordList[ipfs].useLL = location;
            }
            if (
                keccak256(abi.encodePacked(state)) ==
                keccak256(abi.encodePacked("disposed"))
            ) {
                allLots[ipfs].lotState = 6;
                coordList[ipfs].useLL = location;
            }
            // if state==5 then drug was used, if 6 then disposed
        }
    }

    function tracking(
        string memory ipfs
    )
        public
        view
        returns (string memory, address, address, address, string memory, uint)
    {
        return (
            allLots[ipfs].pID,
            allLots[ipfs].hospitalAssigned,
            allLots[ipfs].doctor,
            allLots[ipfs].nurse,
            allLots[ipfs].drugName,
            allLots[ipfs].lotState
        );
    }
    function tracking2(
        string memory ipfs
    ) public view returns (string memory, string memory, uint, uint, address) {
        return (
            allLots[ipfs].drugMFD,
            allLots[ipfs].drugEXP,
            allLots[ipfs].drugQuantity,
            allLots[ipfs].drugQuantityUsed,
            allLots[ipfs].mAddr
        );
    }

    function addImage(string memory imgHash, string memory lotID) public {
        if (manufacturer == msg.sender) {
            imgList[lotID].manuImg = imgHash;
        }
        if (hospital == msg.sender) {
            imgList[lotID].delivImg = imgHash;
        }
        if (nurse == msg.sender) {
            imgList[lotID].usedImg = imgHash;
        }
    }

    function getImages(
        string memory lotID
    ) public view returns (string memory, string memory, string memory) {
        return (
            imgList[lotID].manuImg,
            imgList[lotID].delivImg,
            imgList[lotID].usedImg
        );
    }

    function addLocation(string memory location, string memory lotID) public {
        if (manufacturer == msg.sender) {
            coordList[lotID].manuLL = location;
        }
        if (hospital == msg.sender) {
            coordList[lotID].hospLL = location;
        }
        if (doctor == msg.sender) {
            coordList[lotID].presLL = location;
        }
        if (nurse == msg.sender) {
            coordList[lotID].useLL = location;
        }
    }

    function getLocation(
        string memory lotID
    )
        public
        view
        returns (string memory, string memory, string memory, string memory)
    {
        return (
            coordList[lotID].manuLL,
            coordList[lotID].hospLL,
            coordList[lotID].presLL,
            coordList[lotID].useLL
        );
    }

        function checkifAdded(
        address newActor,
        string memory actorType
    ) public view returns (string memory) {
        if (
            keccak256(abi.encodePacked(actorType)) ==
            keccak256(abi.encodePacked("manufacturer"))
        ) {
            if (manufacturer == newActor) {
                return "Manufacturer added successfully";
            } else {
                return "Error occured";
            }
        }
        if (
            keccak256(abi.encodePacked(actorType)) ==
            keccak256(abi.encodePacked("hospital"))
        ) {
            if (hospital == newActor) {
                return "Hospital added successfully";
            } else {
                return "Error occured";
            }
        }
        if (
            keccak256(abi.encodePacked(actorType)) ==
            keccak256(abi.encodePacked("doctor"))
        ) {
            if (doctor == newActor) {
                return "Doctor added successfully";
            } else {
                return "Error occured";
            }
        }
        if (
            keccak256(abi.encodePacked(actorType)) ==
            keccak256(abi.encodePacked("nurse"))
        ) {
            if (nurse == newActor) {
                return "Nurse added successfully";
            } else {
                return "Error occured";
            }
        } 
            return "Incorrect call";
    
    }

    
    function checkCDR() public view returns (string memory){
         if(msg.sender==CDR)
         {
            return "yes";
         }
         return "no";
         }
    function checkManu() public view returns (string memory){
         if(msg.sender==manufacturer)
         {
            return "yes";
         }
         return "no";
         }
    function checkHos() public view returns (string memory){
         if(msg.sender==hospital)
         {
            return "yes";
         }
         return "no";
         }
    function checkDoc() public view returns (string memory){
         if(msg.sender==doctor)
         {
            return "yes";
         }
         return "no";
         }
    function checkNurse() public view returns (string memory){
         if(msg.sender==nurse)
         {
            return "yes";
         }
         return "no";
         }
    // function checkQuantity(uint requiredQ,string memory ipfs) public view returns (string memory)
    // {
    //     if(allLots[ipfs].drugQuantity >= requiredQ)
    //     {
    //        return "possible";
    //     }
    //     else{
    //         return "na";
    //     }
    // }


}
