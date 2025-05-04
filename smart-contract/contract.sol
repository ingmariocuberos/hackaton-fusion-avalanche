// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecureEscrow {
    address public owner;

    struct Deposit {
        uint256 amount;
        address depositor;
        address beneficiary;
        bool released;
    }

    mapping(bytes32 => Deposit) public deposits;

    event Deposited(bytes32 indexed depositId, address indexed depositor, address indexed beneficiary, uint256 amount);
    event Released(bytes32 indexed depositId, address indexed beneficiary, uint256 amount);
    event Refunded(bytes32 indexed depositId, address indexed depositor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el owner puede ejecutar esta funcion");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function generateDepositId(address depositor, address beneficiary, uint256 amount, uint256 nonce) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(depositor, beneficiary, amount, nonce));
    }

    // 1. El usuario deposita fondos indicando el beneficiario
    function deposit(address beneficiary, uint256 nonce) external payable {
        require(msg.value > 0, "Debes enviar AVAX");
        require(beneficiary != address(0), "Beneficiario invalido");

        bytes32 depositId = generateDepositId(msg.sender, beneficiary, msg.value, nonce);
        require(deposits[depositId].amount == 0, "Este deposito ya existe");

        deposits[depositId] = Deposit({
            amount: msg.value,
            depositor: msg.sender,
            beneficiary: beneficiary,
            released: false
        });

        emit Deposited(depositId, msg.sender, beneficiary, msg.value);
    }

    // 2. El owner autoriza el desembolso total o parcial a la wallet beneficiaria
    function releaseFunds(bytes32 depositId, uint256 amount) external onlyOwner {
        Deposit storage d = deposits[depositId];
        require(!d.released, "Fondos ya liberados");
        require(amount > 0 && amount <= d.amount, "Cantidad invalida");

        d.amount -= amount;
        if (d.amount == 0) {
            d.released = true;
        }

        (bool success, ) = d.beneficiary.call{value: amount}("");
        require(success, "Error al enviar fondos");

        emit Released(depositId, d.beneficiary, amount);
    }

    // 3. El depositante puede recuperar sus fondos si aún no se han liberado
    function refund(bytes32 depositId) external {
        Deposit storage d = deposits[depositId];
        require(!d.released, "Fondos ya liberados");
        require(msg.sender == d.depositor, "Solo el depositante puede reembolsar");

        uint256 amountToRefund = d.amount;
        d.amount = 0;
        d.released = true;

        (bool success, ) = d.depositor.call{value: amountToRefund}("");
        require(success, "Fallo el reembolso");

        emit Refunded(depositId, d.depositor, amountToRefund);
    }

    // Protección de emergencia: permitir que el owner transfiera fondos en caso de bug o bloqueo
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Recibir AVAX por fallback
    receive() external payable {}
}