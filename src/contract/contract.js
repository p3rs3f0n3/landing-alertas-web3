import { ethers } from "ethers";

// Dirección del contrato desplegado en Base Sepolia
const contractAddress = "0xcaD16f95EA5137Ef52a26ccA4B6dF1c5aab950FC";

const abi = [
  {
    inputs: [
      { internalType: "uint256", name: "index", type: "uint256" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string[]", name: "imageHashes", type: "string[]" },
      { internalType: "string", name: "declarationText", type: "string" }
    ],
    name: "addEvidenceToAlert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "sender", type: "address" },
      { indexed: false, internalType: "string", name: "idEvent", type: "string" },
      { indexed: false, internalType: "string", name: "userName", type: "string" },
      { indexed: false, internalType: "string", name: "latitude", type: "string" },
      { indexed: false, internalType: "string", name: "longitude", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "AlertSent",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "alertIndex", type: "uint256" },
      { indexed: true, internalType: "address", name: "sender", type: "address" },
      { indexed: false, internalType: "string", name: "description", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "EvidenceAdded",
    type: "event"
  },
  {
    inputs: [
      { internalType: "string", name: "idEvent", type: "string" },
      { internalType: "string", name: "userName", type: "string" },
      { internalType: "string", name: "latitude", type: "string" },
      { internalType: "string", name: "longitude", type: "string" },
      { internalType: "string[]", name: "contacts", type: "string[]" }
    ],
    name: "sendAlert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "alerts",
    outputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "string", name: "idEvent", type: "string" },
      { internalType: "string", name: "userName", type: "string" },
      { internalType: "string", name: "latitude", type: "string" },
      { internalType: "string", name: "longitude", type: "string" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      {
        components: [
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string[]", name: "imageHashes", type: "string[]" },
          { internalType: "string", name: "declarationText", type: "string" }
        ],
        internalType: "struct EmergencyAlert.Evidence",
        name: "evidence",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getAlert",
    outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "string[]", name: "", type: "string[]" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string[]", name: "", type: "string[]" },
      { internalType: "string", name: "", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "getAlertsBySender",
    outputs: [
      {
        components: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "string", name: "idEvent", type: "string" },
          { internalType: "string", name: "userName", type: "string" },
          { internalType: "string", name: "latitude", type: "string" },
          { internalType: "string", name: "longitude", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string[]", name: "contacts", type: "string[]" },
          {
            components: [
              { internalType: "string", name: "description", type: "string" },
              { internalType: "string[]", name: "imageHashes", type: "string[]" },
              { internalType: "string", name: "declarationText", type: "string" }
            ],
            internalType: "struct EmergencyAlert.Evidence",
            name: "evidence",
            type: "tuple"
          }
        ],
        internalType: "struct EmergencyAlert.Alert[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTotalAlerts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "getTotalAlertsBySender",
    outputs: [{ internalType: "uint256", name: "count", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
];

export function getContract(signerOrProvider) {
  return new ethers.Contract(contractAddress, abi, signerOrProvider);
}
