// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Library {
    struct document {
        uint256 id;
        string title;
        string pinataCID; // Pinata CID for the PDF file
        uint256 timestamp;
    }

    enum Role {
        Owner,
        Admin,
        licencedUser
    }

    modifier onlyAdmin() {
        require(
            roles[msg.sender] == uint256(Role.Admin),
            "Only Admin can call this."
        );
        _;
    }

    modifier onlyOwner() {
        require(
            roles[msg.sender] == uint256(Role.Owner),
            "Only Owner can call this."
        );
        _;
    }

    mapping(address => uint256) public roles;
    mapping(address => uint256) public userCount;

    document[] private documentList;
    mapping(uint => address) public owner;
    uint256 public documentCount;

    event DocumentAdded(uint256 id, string title, string pinataCID, uint256 timestamp);
    event RoleAssigned(address user, string role);
    event RoleRevoked(address user, string role);

    function assignRole(address user, string memory role) public onlyOwner {
        if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("Admin"))) {
            roles[user] = uint256(Role.Admin);
        } else if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("licencedUser"))) {
            roles[user] = uint256(Role.licencedUser);
        } else {
            revert("Invalid role");
        }
        emit RoleAssigned(user, role);
    }

    function revokeRole(address user, string memory role) public onlyOwner {
        if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("Admin"))) {
            roles[user] = uint256(Role.Owner);
        } else if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("licencedUser"))) {
            roles[user] = uint256(Role.Owner);
        } else {
            revert("Invalid role");
        }
        emit RoleRevoked(user, role);
    }

    function addDocument(string memory title, string memory pinataCID, uint256 timestamp) public onlyAdmin {
        uint256 id = documentList.length;
        documentList.push(document(id, title, pinataCID, timestamp));
        owner[id] = msg.sender;
        emit DocumentAdded(id, title, pinataCID, timestamp);
    }

    function getAllDocuments() public view returns (document[] memory) {
        return documentList;
    }

    function getDocument(uint256 id) public view returns (document memory) {
        return documentList[id];
    }
}
